# -*- coding: utf-8 -*-
# De las fichas crudas de Maps a leads cargables: filtra, lee la web de cada
# uno, saca correo y senales, y deja un JSON por sector.
#
# El orden importa y es el del plan: primero se descarta lo que nunca deberia
# entrar (cadenas grandes, clientes, duplicados de Smartlead) y DESPUES se sale
# a internet. Al reves se gastan minutos leyendo webs de empresas que ibamos a
# tirar igual.
#
# Criterio de tamano: Maps no da empleados. El proxy que uso es la cadena: una
# clinica con quince sedes no es una empresa de 5 a 50 personas y ademas tiene
# su propio departamento de marketing. Las excluyo por nombre conocido y por
# dominios que aparecen muchas veces en la propia extraccion.
import json, os, re, ssl, time, urllib.request
import concurrent.futures as cf
from collections import Counter

S = os.path.dirname(os.path.abspath(__file__))
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}
CTX = ssl.create_default_context(); CTX.check_hostname = False; CTX.verify_mode = ssl.CERT_NONE
B = "https://server.smartlead.ai/api/v1"

# Cadenas y franquicias: tienen equipo propio y no son nuestro ICP.
CADENA = re.compile(
    r"\b(vitaldent|dentix|sanitas|adeslas|clinica\s*baviera|corporaci[oó]n\s*dermo|"
    r"ivi|quir[oó]nsalud|hm\s*hospitales|dental\s*company|impress|smysecret|"
    r"invisalign|caser|mapfre|asisa|dkv|gestor[ií]a\s*online|ayuda\s*t|"
    r"declarando|taxdown|getquipu|holded|sage|a3|wolters)\b", re.I)

# Buzones de rol que NO valen aunque sean el unico publicado en la web. Ojo:
# en negocio local info@ ES el buzon del duenyo muchas veces, asi que aqui la
# lista es mas corta que en Apollo y solo tira lo que de verdad no lee nadie.
ROL_MALO = re.compile(r"^(no-?reply|noreply|postmaster|webmaster|abuse|privacy|"
                      r"rgpd|lopd|protecciondedatos|newsletter|mailer)@", re.I)

PISTAS = [
    ("meta_ads", r"connect\.facebook\.net|fbq\s*\(|facebook\.com/tr\?"),
    ("google_ads", r"googleadservices|gtag/js\?id=AW-"),
    ("analitica", r"googletagmanager\.com|G-[A-Z0-9]{8,}"),
    ("crm_hubspot", r"js\.hs-scripts\.com|hubspot"),
    ("crm_zoho", r"zoho"),
    ("crm_odoo", r"odoo"),
    ("mailchimp", r"mailchimp|list-manage"),
    ("brevo", r"sendinblue|brevo"),
    ("activecampaign", r"activehosted|activecampaign"),
    ("whatsapp", r"wa\.me/|api\.whatsapp\.com"),
    ("chat", r"tawk\.to|intercom|crisp\.chat|zendesk|livechat|whatshelp"),
    ("cita_online", r"doctoralia|citaprevia|cita-previa|reservar\s*cita|booking|calendly"),
    ("formulario", r"<form[^>]*|wpcf7|gravityform|elementor-form|hbspt\.forms"),
]
CORREO = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
BASURA = re.compile(r"@(sentry|wix|wordpress|example|domain|godaddy|squarespace|"
                    r"shopify|jquery|gstatic|googleapis|w3\.org|schema\.org)|"
                    r"\.(png|jpg|jpeg|gif|webp|svg|css|js)$", re.I)


def baja(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers=UA),
                                    timeout=20, context=CTX) as f:
            return f.read(500000).decode("utf-8", "ignore")
    except Exception:
        return ""


def mira(r):
    base = r["web"] if r["web"].startswith("http") else "https://" + r["web"]
    base = base.split("?")[0].rstrip("/")
    portada = baja(base)
    if not portada:
        return {**r, "email": "", "senales": [], "vivo": False}
    texto = portada
    hall = set()
    for pag in ("", "/contacto", "/contacto/", "/contact", "/es/contacto",
                "/contacte", "/aviso-legal", "/politica-de-privacidad"):
        h = portada if pag == "" else baja(base + pag)
        if not h:
            continue
        texto += h
        for e in CORREO.findall(h):
            e = e.strip(".").lower()
            if BASURA.search(e) or ROL_MALO.match(e) or len(e) > 70:
                continue
            hall.add(e)
        if hall and pag:
            break
    dom = r["dominio"]
    propios = [e for e in hall if e.split("@")[-1].endswith(dom)]
    elegido = (sorted(propios) or sorted(hall) or [""])[0]
    senales = [k for k, p in PISTAS if re.search(p, texto, re.I)]
    return {**r, "email": elegido, "otros": sorted(hall - {elegido})[:2],
            "senales": senales, "vivo": True}


def ya_en_smartlead():
    K = open(os.path.join(S, ".smartlead_key")).read().strip()

    def g(u):
        for i in range(3):
            try:
                with urllib.request.urlopen(urllib.request.Request(u, headers=UA),
                                            timeout=90) as f:
                    return json.loads(f.read().decode())
            except Exception:
                if i == 2:
                    return {}
                time.sleep(2)
    correos, doms = set(), set()
    for c in g(f"{B}/campaigns?api_key={K}") or []:
        off = 0
        while True:
            d = g(f"{B}/campaigns/{c['id']}/leads?api_key={K}&offset={off}&limit=100")
            b = (d or {}).get("data") or []
            for it in b:
                e = ((it.get("lead") or it).get("email") or "").lower()
                if e:
                    correos.add(e)
                    doms.add(e.split("@")[-1])
            if len(b) < 100:
                break
            off += 100
    return correos, doms


if __name__ == "__main__":
    crudo = json.load(open(os.path.join(S, "maps_sector_todo.json")))
    bloq = {l.strip().lower() for l in open(os.path.join(S, "bloqueados.txt"))
            if l.strip()} if os.path.exists(os.path.join(S, "bloqueados.txt")) else set()

    # 1. una ficha por dominio, quedandose con la de mas resenas
    porDom = {}
    for x in crudo:
        w = x.get("website") or ""
        if not w:
            continue
        dm = w.split("//")[-1].split("/")[0].lower().replace("www.", "")
        if not dm or "." not in dm:
            continue
        v = porDom.get(dm)
        if not v or (x.get("reviewsCount") or 0) > (v.get("reviewsCount") or 0):
            porDom[dm] = x
    print("dominios unicos:", len(porDom))

    # 2. cadenas fuera, por nombre y por repeticion del dominio en la extraccion
    veces = Counter(w.get("website", "").split("//")[-1].split("/")[0].lower().replace("www.", "")
                    for w in crudo if w.get("website"))
    fuera = Counter()
    cand = []
    for dm, x in porDom.items():
        nombre = x.get("title") or ""
        if CADENA.search(nombre) or CADENA.search(dm):
            fuera["cadena"] += 1; continue
        if veces[dm] >= 4:
            fuera["multisede"] += 1; continue
        if dm in bloq:
            fuera["bloqueado"] += 1; continue
        cand.append({"empresa": nombre, "web": x["website"], "dominio": dm,
                     "telefono": x.get("phone") or "", "ciudad": x.get("_ciudad"),
                     "sector": x.get("_sector"), "resenas": x.get("reviewsCount") or 0,
                     "nota": x.get("totalScore")})
    print("candidatos tras filtro:", len(cand), dict(fuera))

    # 3. duplicados contra lo ya cargado
    correos, doms = ya_en_smartlead()
    antes = len(cand)
    cand = [c for c in cand if c["dominio"] not in doms]
    print(f"duplicados de Smartlead fuera: {antes - len(cand)} · quedan {len(cand)}")

    # 4. ahora si, a leer webs
    with cf.ThreadPoolExecutor(12) as ex:
        leidos = list(ex.map(mira, cand))

    buenos = [r for r in leidos if r["email"] and r["email"].split("@")[-1] not in doms
              and r["email"] not in correos]
    print(f"con correo util: {len(buenos)} de {len(leidos)} "
          f"(webs caidas: {sum(1 for r in leidos if not r['vivo'])})")

    for sec in ("clinicas", "asesorias", "formacion"):
        lote = [r for r in buenos if r["sector"] == sec]
        p = os.path.join(S, f"sector_{sec}.json")
        json.dump(lote, open(p, "w"), ensure_ascii=False, indent=1)
        s = Counter(k for r in lote for k in r["senales"])
        print(f"  {sec}: {len(lote)} -> {p}")
        print(f"     senales: {dict(s.most_common(6))}")
