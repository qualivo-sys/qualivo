#!/usr/bin/env python3
"""Universo de escuelas de formación en España ordenado por volumen probable de leads (19-nov).

Pedido de Maikel: «que veamos que pueden tener un volumen alto de leads».
Uso: cd $S && SP=$S python3 bin/universo_edu.py [max_creditos=150]
Coste: 1 crédito por página de 100 empresas (no revela correos). Deja $S/edu_universo.json
ordenado por puntuación; auto_apollo.py --edu lo consume de arriba abajo.

Señales de volumen (todas antes de gastar en revelar):
  - anuncios en Google Y en Meta a la vez (captación pagada multicanal)     +3
  - más canales de pago (LinkedIn Ads, Bing, DoubleClick)                   +1
  - CRM (HubSpot, Salesforce, Zoho, Pipedrive, Clientify)                   +2
  - herramientas de embudo (Calendly, Typeform, Hotjar)                     +1
  - contratando comerciales / asesores de admisiones                        +3
  - tráfico web (ranking Alexa): <300k +3, <1M +2, con ranking +1
  - plantilla 21-50 +2, 11-20 +1; crecimiento de plantilla 12m >10%         +1
"""
import json, os, re, sys, time, urllib.request, urllib.error

S = os.environ.get("SP") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = open(os.path.join(S, ".apollo_key")).read().strip()
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
ADS = ["google_adwords_conversion", "google_ads", "google_remarketing", "facebook_pixel", "linkedin_ads", "bing_ads", "doubleclick_conversion"]
KW = ["formacion online", "cursos online", "e-learning", "elearning", "online education", "online courses", "educacion online",
      "formacion a distancia", "academia online", "escuela online", "master online", "postgrado", "formacion profesional",
      "oposiciones", "idiomas online", "formacion para empresas", "formacion bonificada", "fundae", "escuela de negocios",
      "business school", "bootcamp", "academia", "escuela", "formacion", "training", "education", "cursos", "masters"]
FUERA = re.compile(r"autoescuela|auto escuela|guarder|infantil|colegio|universidad|universitat|ayuntamiento|fundaci|asociaci|"
                   r"federaci|gimnasio|gym|crossfit|dental|clinica|abogad|inmobiliaria|software|agencia", re.I)
# Solo escuelas: sector educativo en Apollo, o nombre/dominio de escuela.
EDU_IND = re.compile(r"education|e-learning|elearning|training|coaching|higher|educaci|formaci", re.I)
EDU_NOM = re.compile(r"escuela|escola|academ|formaci|master|m[aá]ster|oposic|school|campus|institut|curso|learning|"
                     r"training|educa|idioma|language|bootcamp|cualifica|fp\b|estudios|business school", re.I)
cred = 0


def api(body):
    global cred
    req = urllib.request.Request("https://api.apollo.io/api/v1/organizations/search", data=json.dumps(body).encode(),
                                 headers={"X-Api-Key": KEY, "Content-Type": "application/json", "User-Agent": UA})
    for i in range(3):
        try:
            cred += 1
            return json.load(urllib.request.urlopen(req, timeout=90))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(20 * (i + 1)); continue
            raise SystemExit(f"Apollo HTTP {e.code}: {e.read()[:200]!r}")
    raise SystemExit("Apollo: demasiados 429")


def todas(extra, tope):
    base = {"organization_locations": ["Spain"], "organization_num_employees_ranges": ["5,10", "11,20", "21,50"],
            "q_organization_keyword_tags": KW, "per_page": 100}
    base.update(extra)
    out, pag = {}, 1
    while cred < tope:
        r = api(dict(base, page=pag))
        lista = (r.get("organizations") or []) + (r.get("accounts") or [])
        for o in lista:
            oid = o.get("organization_id") or o.get("id")
            if oid: out[oid] = o
        tot = (r.get("pagination") or {}).get("total_pages") or 1
        if not lista or pag >= tot: break
        pag += 1
    return out


def main():
    tope = int(sys.argv[1]) if len(sys.argv) > 1 else 150
    raw_p = os.path.join(S, "edu_universo_raw.json")
    if os.path.exists(raw_p) and "--refrescar" not in sys.argv:
        raw = json.load(open(raw_p)); uni = raw["uni"]; tiene = {k: set(v) for k, v in raw["tiene"].items()}
        print(f"universo en caché: {len(uni)} empresas (0 créditos; --refrescar para rehacerlo)")
    else:
        uni = todas({"currently_using_any_of_technology_uids": ADS}, tope - 25)
        print(f"universo con píxel de anuncios: {len(uni)} empresas ({cred} créditos)")
        tiene = None
    señales = {
        "google_y_meta": {"currently_using_all_of_technology_uids": ["google_adwords_conversion", "facebook_pixel"]},
        "mas_canales": {"currently_using_any_of_technology_uids": ["linkedin_ads", "bing_ads", "doubleclick_conversion"]},
        "crm": {"currently_using_any_of_technology_uids": ["hubspot", "salesforce", "zoho_crm", "pipedrive", "clientify"]},
        "embudo": {"currently_using_any_of_technology_uids": ["calendly", "typeform", "hotjar"]},
        "contratando_ventas": {"currently_using_any_of_technology_uids": ADS,
                               "q_organization_job_titles": ["asesor", "admisiones", "comercial", "orientador", "ventas", "sales", "telemarketing", "captacion"]},
    }
    if tiene is None:
        tiene = {k: set(todas(v, tope)) for k, v in señales.items()}
        json.dump({"uni": uni, "tiene": {k: sorted(v) for k, v in tiene.items()}, "fecha": time.strftime("%Y-%m-%d")}, open(raw_p, "w"))
    for k, v in tiene.items(): print(f"  señal {k}: {len(v)}")
    filas = []
    for oid, o in uni.items():
        nom = o.get("name") or ""; dom = (o.get("primary_domain") or "").lower()
        if not dom or FUERA.search(nom) or FUERA.search(dom): continue
        if not (EDU_IND.search(o.get("industry") or "") or EDU_NOM.search(nom) or EDU_NOM.search(dom)): continue
        p, por = 0, []
        def suma(n, why):
            nonlocal p; p += n; por.append(why)
        if oid in tiene["google_y_meta"]: suma(3, "Google+Meta")
        if oid in tiene["mas_canales"]: suma(1, "más canales")
        if oid in tiene["crm"]: suma(2, "CRM")
        if oid in tiene["embudo"]: suma(1, "embudo")
        if oid in tiene["contratando_ventas"]: suma(3, "contratando ventas")
        a = o.get("alexa_ranking")
        if a: suma(3 if a < 300000 else 2 if a < 1000000 else 1, f"tráfico {a // 1000}k")
        e = o.get("estimated_num_employees") or 0
        if e >= 21: suma(2, f"{e} pers")
        elif e >= 11: suma(1, f"{e} pers")
        g = o.get("organization_headcount_twelve_month_growth") or 0
        if g > 0.1: suma(1, "crece")
        filas.append(dict(id=oid, name=nom, dom=dom, emp=e, industry=o.get("industry"), puntos=p, por=por))
    filas.sort(key=lambda f: -f["puntos"])
    json.dump(filas, open(os.path.join(S, "edu_universo.json"), "w"), ensure_ascii=False, indent=1)
    dist = {}
    for f in filas: dist[f["puntos"]] = dist.get(f["puntos"], 0) + 1
    print("reparto por puntos:", dict(sorted(dist.items(), reverse=True)))
    print(f"alto volumen (>=5): {sum(1 for f in filas if f['puntos'] >= 5)} | medio (3-4): {sum(1 for f in filas if 3 <= f['puntos'] <= 4)}")
    print(f"escuelas tras filtro de sector: {len(filas)}")
    for f in filas[:25]: print(f"  {f['puntos']:>2}  {f['name'][:40]:40} {f['dom']:28} {(f['industry'] or '')[:22]:22} {', '.join(f['por'])}")
    print(f"créditos: {cred}")


if __name__ == "__main__":
    main()
