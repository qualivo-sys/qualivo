#!/usr/bin/env python3
"""Carga automatica de leads con la API de Apollo (sin el aviso del conector).

Uso: cd $S && SP=$S python3 bin/auto_apollo.py <smartlead_key> [objetivo=100] [max_creditos=250] [--dry]

Flujo:
 1. organizations/search (Espana, 5-50 empleados, con pixel de anuncios) rotando
    familias de palabras clave y paginas; guarda lo visto en apollo_orgs_vistas.json
    para que cada dia salgan empresas nuevas.
 2. Descarta antes de gastar: dominios ya contactados (enviados_reales.json),
    ya revelados y nombres fuera de ICP.
 3. mixed_people/api_search (gratis) sobre esas empresas: 1 decisor por empresa.
 4. people/bulk_match de 10 en 10 (1 credito por match), hasta el tope.
 5. Filtros fijos (verificado, mismo dominio, <=50 empleados, no contactado) y
    carga con carga_senal_v2.py: formacion -> Meta formacion v2, resto -> Google Ads.
La clave de Apollo se lee de $S/.apollo_key; nunca se imprime.
"""
import json, os, re, subprocess, sys, time, urllib.request, urllib.error

S = os.environ.get("SP") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = open(os.path.join(S, ".apollo_key")).read().strip()
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
# 19-nov: "facebook_custom_audiences" no existe en Apollo (0 resultados) y "facebook_widget" es el botón social, no anuncios.
# El píxel de Meta real es "facebook_pixel".
ADS = ["google_adwords_conversion", "google_ads", "google_remarketing", "facebook_pixel", "linkedin_ads", "bing_ads", "doubleclick_conversion"]
FAMILIAS = [
    ["formacion", "escuela", "academia", "cursos", "master", "e-learning", "training", "oposiciones"],
    ["consultoria", "asesoria", "asesoria fiscal", "gestoria", "financial advisory", "business consulting"],
    ["coaching", "idiomas", "language school", "escuela de negocios", "business school", "formacion para empresas"],
    ["consultoria de recursos humanos", "franquicias", "mentoring", "consultoria estrategica", "marketing training"],
]
# Modo --edu (Maikel 19-nov: «atacar a todas las escuelas de formación online de España»):
# solo formación/educación, todo a Meta formación v2, más páginas por búsqueda.
EDU = [
    ["formacion online", "cursos online", "e-learning", "elearning", "online education", "online courses", "educacion online", "formacion a distancia"],
    ["academia online", "escuela online", "master online", "postgrado", "formacion profesional", "fp online", "certificaciones", "titulos propios"],
    ["oposiciones", "preparacion oposiciones", "academia de oposiciones", "idiomas online", "ingles online", "clases online", "academia de idiomas"],
    ["formacion para empresas", "formacion bonificada", "fundae", "formacion continua", "escuela de negocios", "business school", "formacion tecnica"],
    ["escuela de diseño", "bootcamp", "escuela de marketing", "escuela de fotografia", "escuela de cocina", "escuela de musica", "escuela de danza", "escuela de yoga"],
    ["academia", "escuela", "formacion", "training", "education", "cursos", "masters", "educacion"],
]
NO_ICP = re.compile(r"abogad|legal|law|asociaci|federaci|gremi|fundaci|colegio|universidad|universitat|ayuntamiento|camara|"
                    r"agencia|marketing digital|software|seleccion|recruit|staffing|talent|empleo|inmobiliaria|clinica|dental|university|autoescuela", re.I)


def api(path, body):
    req = urllib.request.Request("https://api.apollo.io/api/v1/" + path, data=json.dumps(body).encode(),
                                 headers={"X-Api-Key": KEY, "Content-Type": "application/json", "User-Agent": UA})
    for i in range(3):
        try:
            return json.load(urllib.request.urlopen(req, timeout=90))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(20 * (i + 1)); continue
            raise SystemExit(f"Apollo {path} -> HTTP {e.code}: {e.read()[:200]!r}")
    raise SystemExit("Apollo: demasiados 429")


def load(name, default):
    p = os.path.join(S, name)
    return json.load(open(p)) if os.path.exists(p) else default


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    sl_key = args[0]
    objetivo = int(args[1]) if len(args) > 1 else 100
    max_cred = int(args[2]) if len(args) > 2 else 250
    dry = "--dry" in sys.argv
    edu = "--edu" in sys.argv
    global FAMILIAS, NO_ICP
    pref, npag, mult = ("e", 10, 6) if edu else ("", 3, 3)
    if edu:
        FAMILIAS = EDU
        NO_ICP = re.compile(NO_ICP.pattern.replace("|empleo", ""), re.I)

    env = set(json.load(open(os.path.join(S, "enviados_reales.json")))["correos"])
    env_dom = {e.split("@")[1] for e in env if "@" in e}
    estado = load("apollo_orgs_vistas.json", {"vistas": [], "pagina": {}})
    vistas = set(estado["vistas"])
    cred = 0

    # 1-2. empresas nuevas
    orgs = {}
    # Modo --edu: primero el ranking por volumen probable de leads (bin/universo_edu.py), de arriba abajo.
    rank_p = os.path.join(S, "edu_universo.json")
    if edu and os.path.exists(rank_p):
        minp = int(os.environ.get("EDU_MIN_PUNTOS", "3"))
        # Del ranking no se descarta por "vista" (antes se buscaba solo CEO/fundador): se descarta lo ya revelado.
        import glob
        rev_dom = set()
        for g in glob.glob(os.path.join(S, "*revelados*.json")) + glob.glob(os.path.join(S, "*", "*revelados*.json")):
            try:
                for x in json.load(open(g)):
                    d = (x.get("dom") or (x.get("email") or "@").split("@")[1] or "").lower()
                    if d: rev_dom.add(d)
            except Exception:
                pass
        for f in json.load(open(rank_p)):
            if len(orgs) >= objetivo * mult: break
            if f["puntos"] < minp or f["dom"] in env_dom or f["dom"] in rev_dom or NO_ICP.search(f["name"] or ""):
                continue
            orgs[f["id"]] = f["dom"]; vistas.add(f["id"])
        print(f"del ranking de volumen (>= {minp} puntos): {len(orgs)}")
    for fi, fam in enumerate(FAMILIAS):
        if len(orgs) >= objetivo * mult:
            break
        pag = estado["pagina"].get(pref + str(fi), 1)
        for _ in range(npag):
            r = api("organizations/search", {"organization_locations": ["Spain"], "organization_num_employees_ranges": ["5,10", "11,50"],
                                             "currently_using_any_of_technology_uids": ADS, "q_organization_keyword_tags": fam,
                                             "per_page": 100, "page": pag})
            cred += 1
            lista = (r.get("organizations") or []) + (r.get("accounts") or [])
            pag += 1
            for o in lista:
                oid = o.get("organization_id") or o.get("id")
                dom = (o.get("primary_domain") or o.get("domain") or "").lower()
                if not oid or not dom or oid in vistas or dom in env_dom or NO_ICP.search(o.get("name") or ""):
                    vistas.add(oid); continue
                orgs[oid] = dom; vistas.add(oid)
            if not lista:
                pag = 1; break
            if len(orgs) >= objetivo * mult:
                break
        estado["pagina"][pref + str(fi)] = pag
        if len(orgs) >= objetivo * mult:
            break
    print(f"empresas nuevas candidatas: {len(orgs)}")

    # 3. decisores (gratis)
    ids, ya = [], set()
    oids = list(orgs)
    for i in range(0, len(oids), 50):
        r = api("mixed_people/api_search", {"organization_ids": oids[i:i + 50], "person_seniorities": ["owner", "founder", "c_suite"] + (["director", "head"] if edu else []),
                                            "contact_email_status": ["verified"], "person_locations": ["Spain"], "per_page": 100})
        rank = lambda t: 0 if re.search(r"ceo|founder|fundador|director general|directora general|gerente|owner|propietari|socio|director acad|directora acad|director de la escuela|directora de la escuela", (t or "").lower()) else 1
        for p in sorted(r.get("people") or [], key=lambda p: rank(p.get("title"))):
            on = (p.get("organization") or {}).get("name")
            if not p.get("has_email") or on in ya or re.search(r"\bcto\b|technology|sistemas|financ|rrhh|recursos humanos|human resources|it\b|ingenier", (p.get("title") or "").lower()):
                continue
            ya.add(on); ids.append(p["id"])
    print(f"decisores con email verificado: {len(ids)}")

    # 4. revelar
    filas = []
    tope = min(len(ids), max_cred - cred, int(objetivo * 1.8))
    for i in range(0, tope, 10):
        r = api("people/bulk_match", {"details": [{"id": x} for x in ids[i:i + 10]]})
        cred += r.get("credits_consumed") or 0
        for m in r.get("matches") or []:
            if not m: continue
            o = m.get("organization") or {}
            filas.append(dict(email=m.get("email"), email_status=m.get("email_status"), catchall=bool(m.get("email_domain_catchall")),
                              dom=o.get("primary_domain"), country=m.get("country"), industry=o.get("industry"),
                              emp=o.get("estimated_num_employees"), first_name=m.get("first_name"), last_name=m.get("last_name"),
                              company_name=o.get("name"), title=m.get("title")))
    hoy = time.strftime("%Y%m%d")
    json.dump(filas, open(os.path.join(S, f"auto_revelados_{hoy}_{time.strftime('%H%M')}.json"), "w"), ensure_ascii=False, indent=1)

    # 5. filtros y carga
    ok, caidas = [], {}
    for r in filas:
        e = (r["email"] or "").lower(); por = None
        if not e: por = "sin email"
        elif r["email_status"] != "verified": por = "no verificado"
        elif e.split("@")[1] != (r["dom"] or "").lower(): por = "dominio cruzado"
        elif (r["emp"] or 0) > 50: por = "mas de 50"
        elif e in env: por = "ya contactado"
        if por: caidas[por] = caidas.get(por, 0) + 1; continue
        r = dict(r); r.pop("emp")
        r["puerta"] = "meta_ads" if edu or re.search(r"education|e-learning|training|higher", r["industry"] or "") else "google_ads"
        ok.append(r)
    fich = os.path.join(S, (f"auto_edu_{hoy}_{time.strftime('%H%M')}_ok.json" if edu else f"auto_{hoy}_ok.json"))
    json.dump(ok, open(fich, "w"), ensure_ascii=False, indent=1)
    estado["vistas"] = sorted(vistas)
    json.dump(estado, open(os.path.join(S, "apollo_orgs_vistas.json"), "w"))
    print(f"revelados: {len(filas)} | pasan filtros: {len(ok)} | caidas: {caidas} | creditos: {cred}")
    if not ok:
        return
    cmd = ["python3", os.path.join(S, "bin", "carga_senal_v2.py"), sl_key, os.path.basename(fich)] + (["--dry"] if dry else [])
    out = subprocess.run(cmd, cwd=S, env=dict(os.environ, SP=S), capture_output=True, text=True, timeout=600)
    print("\n".join(l[:220] for l in out.stdout.strip().splitlines()[-6:]))
    if not dry:
        # registrar los que de verdad entraron
        cargados = 0
        for r in ok:
            try:
                req = urllib.request.Request(f"https://server.smartlead.ai/api/v1/leads/?api_key={sl_key}&email={r['email']}", headers={"User-Agent": UA})
                d = json.load(urllib.request.urlopen(req, timeout=30))
                if d and any(c.get("campaign_id") in (3963336, 4635534) for c in d.get("lead_campaign_data", [])):
                    env.add(r["email"].lower()); cargados += 1
            except Exception:
                pass
        p = os.path.join(S, "enviados_reales.json"); d = json.load(open(p)); d["correos"] = sorted(env); json.dump(d, open(p, "w"))
        print(f"CARGADOS: {cargados}")


if __name__ == "__main__":
    main()
