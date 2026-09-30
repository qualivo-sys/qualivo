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
import html, json, os, re, ssl, time, urllib.request
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

# Buzones genericos. No se tiran, pero van los ultimos, y por que:
#
# Medido el 23-sep sobre los 329 envios de las cuatro puertas de Maps:
#   genericos (info@, contacto@, recepcion@...)  163 envios · 11 rebotes · 6,7%
#   con nombre de persona                        166 envios ·  1 rebote  · 0,6%
#
# Once veces peor. Y lo estabamos eligiendo a proposito sin querer: la linea
# de abajo hacia sorted(propios)[0], o sea orden alfabetico, y el alfabeto
# pone "administracion@" y "contacto@" por delante de "nuria@". Se escogia el
# peor buzon de cada web de forma sistematica.
#
# Asesorias era 73% genericos y reboto al 22,7%, lo que obligo a pausarla.
# Formacion es 94% personales y lleva 80 envios con cero rebotes.
# Ampliada el 25-sep: al reprocesar las 400 fichas de Maps, "paciente@",
# "alumni@" y "hey@" se colaron como si fueran personas y no lo son. El sector
# manda en esto: en una clinica "paciente@" es el buzon general, y en formacion
# lo son "alumni@" y "matriculas@".
GENERICO = re.compile(r"^(info|contacto|contacte|contacta|escribenos|hola|hey|"
                      r"admin|administracio[nó]|recepcio[nó]|clinica|cl[ií]nica|"
                      r"cita|citas|reservas|comercial|ventas|general|correo|mail|"
                      r"buzon|oficina|secretaria|atencion|atencioncliente|"
                      r"consultas|asesoria|gestoria|paciente|pacientes|alumni|"
                      r"alumno|alumnos|matricula|matriculas|admisiones|soporte|"
                      r"ayuda|team|equipo|hello|contact|support)@",
                      re.I)


def rango(e):
    """Ordena candidatos: primero el que parece una persona."""
    return (1 if GENERICO.match(e) else 0, len(e), e)

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

# Restos de HTML que se pegan por delante del correo cuando no hay espacio
# entre la entidad y la direccion: "&nbsp;info@x.es" sale como "nbspinfo@x.es"
# y ">info@x.es" como "u003einfo@x.es". Aparecieron el 23-sep al ampliar
# el rastreo a /equipo y /nosotros, que llevan mas marcado que /contacto.
# No llego ninguna a una campana, pero con un prefijo de mas la direccion no
# existe y el correo rebota.
# Solo se quitan los restos que NO pueden ser el principio de un nombre real.
# "gt", "lt", "amp", "quot" y "shy" quedan fuera a proposito: gtalon@,
# ltorres@, amparo@ y quotient@ son direcciones perfectamente normales y al
# incluirlas esta limpieza convertia gtalon@ en alon@. Se rompian correos
# buenos para arreglar cinco malos, que es peor que el problema.
PEGOTE = re.compile(r"^(?:nbsp|zwnj|zwsp|ensp|emsp|thinsp|"
                    r"u00[0-9a-fA-F]{2}|#\d{2,5};?)+", re.I)


def despega(e):
    """Quita entidades HTML y espacios codificados pegados por delante."""
    e = html.unescape(e or "").strip().lower()
    previo = None
    while previo != e:
        previo = e
        # %20 y compania: el correo venia dentro de un href con espacios
        # codificados. El 25-sep se colo "%20info@miquelrevert..." hasta la
        # lista de candidatos, y esa direccion no existe.
        e = re.sub(r"^(?:%20|%09|%0a|%0d|%c2%a0)+", "", e)
        e = re.sub(r"^[\s.,;:<>()\[\]\"'\\/]+", "", e)
        e = PEGOTE.sub("", e)
    return e.strip(" .,;:")
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
            e = despega(e)
            if not e or BASURA.search(e) or ROL_MALO.match(e) or len(e) > 70:
                continue
            if not CORREO.fullmatch(e):
                continue
            hall.add(e)
        if hall and pag:
            break
    dom = r["dominio"]
    propios = [e for e in hall if e.split("@")[-1].endswith(dom)]
    orden = sorted(propios, key=rango) or sorted(hall, key=rango) or [""]
    elegido = orden[0]
    senales = [k for k, p in PISTAS if re.search(p, texto, re.I)]
    return {**r, "email": elegido, "generico": bool(GENERICO.match(elegido)),
            "otros": [e for e in orden[1:3]],
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
