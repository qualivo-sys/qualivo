# -*- coding: utf-8 -*-
# Lista preseleccionada para la tanda de noviembre (acuerdo del 27-oct con Marc).
#
# De donde sale: busquedas de empresas en Apollo del 29-oct, por comunidad
# autonoma, 5 a 20 empleados, con etiquetas de climatizacion, frio, servicio
# tecnico, mantenimiento y proteccion contra incendios. Sin Navarra ni Euskadi
# (TicketBAI): no se busco en esas dos comunidades.
#
# Como se filtra:
#   1. Codigo NAICS: fuera fabricantes (31-33), mayoristas (42), ingenierias
#      (5413), informatica (5415) y comercio (44).
#   2. Fuera las 69 empresas ya contactadas en el piloto (dominios de
#      clics-estado.json).
#   3. Revision a mano empresa por empresa, por nombre, dominio y codigo de
#      actividad. Las decisiones estan en revision.json, con el motivo de cada
#      descarte.
#   4. Lectura de la web de cada superviviente (rev-lote*.tsv): oficio, ciudad,
#      veredicto, segmento y una senal verificable para la primera linea. Sale
#      lo que no encaja, lo de Navarra y Euskadi y lo que es claramente grande.
#      Las webs caidas NO se descartan, por el aviso de Marc del 27-oct: el
#      dominio del decisor a menudo no carga y hay que buscar la sociedad.
#
# SOLO DATOS DE EMPRESA. Ni nombres de personas ni correos personales: eso se
# enriquece despues, cuando Marc valide la lista, y no se versiona.
#
# Uso:
#   python3 lista_apollo.py <candidatas.json> <revision.json> [rev-lote*.tsv ...]
# Escribe lista/lista-29oct.csv y lista/revision-29oct.csv
import csv, glob, json, os, re, sys

S = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(os.path.dirname(S), "lista")

REGION = {
    "Madrid": "Madrid", "Cataluna": "Cataluña", "Valencia": "C. Valenciana",
    "Andalucia": "Andalucía", "Aragon-Murcia-Galicia": "Aragón, Murcia o Galicia",
    "Resto": "Castilla y León, Castilla-La Mancha, Baleares, Canarias, Asturias, "
             "Cantabria, Extremadura o La Rioja",
    "Espana": "España (sin Navarra ni Euskadi)",
}

# El segmento decide que mensaje recibe. Se mira en nombre y dominio, en este
# orden: lo mas especifico primero.
SEGMENTOS = [
    ("incendios", r"extint|fuego|fire|incend|pci|segurifoc|proteclisa|normex|nex ?seguridad|chacarrex|jomar"),
    ("puertas", r"automatism|puerta"),
    ("legionela", r"medioambient|legionel|hidroser|sanal"),
    ("frio", r"fr[ií]o|frig|refri|cold|kenfri|fricl|difrica|frimos|thermo king|coolgades"),
    ("mantenimiento", r"mantenim|facility|facilities|servicios generales|serveis|servicios integrales|"
                      r"multinergia|tallers|support man|indice|segman|ecemis|gides|himan|danblar|"
                      r"multiservicios|reparaciones|servitec|servinco|mi3|grupo mr|inesma"),
    ("clima", r"clim|aire|air|calef|termal|therm|gas|confort|cald|fan2tec|ductolux|energ"),
]

MOTIVO = {
    "clima": "Instaladora y mantenedora de climatización: revisiones periódicas de equipos, "
             "avisos de averías y técnicos en ruta. Es el sector con el que abre la web de Kubysoft.",
    "frio": "Frío y refrigeración: registro de carga y fugas de gas por equipo (gases fluorados) "
            "y revisiones con valores. Encaja con el checklist dentro del parte.",
    "incendios": "Protección contra incendios: revisiones trimestrales y anuales obligatorias "
                 "(RIPCI) con acta. Es el caso más claro para el checklist en el parte.",
    "legionela": "Control de legionela y aguas: cada visita registra parámetros que hay que poder "
                 "demostrar. Encaja con el checklist con valores.",
    "puertas": "Puertas automáticas: mantenimiento preventivo repartido por muchos clientes, con "
               "parte de revisión en cada visita.",
    "mantenimiento": "Mantenimiento técnico de edificios o industria: avisos, preventivos por "
                     "contrato y técnicos desplazados. Planificación y rutas es su día a día.",
}

# Nombres que dicen el oficio sin dudas. El resto entra por codigo de
# actividad (instaladora, NAICS 2382) y Marc lo confirma al validar.
CLARO = r"clim|aire|fr[ií]o|frig|refri|extint|fuego|fire|incend|pci|mantenim|facility|calef|gas|servicio|servei|automatism"


def segmento(r):
    t = (r.get("nombre", "") + " " + r.get("dominio", "")).lower()
    for s, pat in SEGMENTOS:
        if re.search(pat, t):
            return s
    return "mantenimiento"


def lee_web(ficheros):
    """Revision de webs por dominio. Acepta el dominio con o sin www."""
    web = {}
    for f in ficheros:
        for r in csv.DictReader(open(f, encoding="utf-8"), delimiter="\t"):
            d = (r.get("dominio") or "").lower().strip().removeprefix("www.").strip("/")
            if d:
                web[d] = {k: (v or "").strip() for k, v in r.items() if k}
    return web


def main(cand, revi, *tsv):
    c = json.load(open(cand))
    rev = json.load(open(revi))
    web = lee_web([g for t in tsv for g in glob.glob(t)])
    os.makedirs(SALIDA, exist_ok=True)
    filas = []
    for dom, d in rev.items():
        if d["decision"] != "dentro":
            continue
        r = c[dom]
        w = web.get(dom, {})
        ver = w.get("veredicto", "").lower()
        nota = w.get("nota", "").upper()
        if "TICKETBAI" in nota:
            rev[dom] = {"decision": "fuera", "motivo": "web: sede en Navarra o Euskadi"}
            continue
        if "GRANDE" in nota:
            rev[dom] = {"decision": "fuera", "motivo": "web: grupo o más de 20 empleados"}
            continue
        if ver == "no encaja":
            rev[dom] = {"decision": "fuera", "motivo": "web: " + (w.get("oficio") or "no encaja")}
            continue
        s = w.get("segmento") if w.get("segmento") in MOTIVO else segmento(r)
        claro = bool(re.search(CLARO, (r.get("nombre", "") + " " + dom).lower()))
        if ver == "encaja":
            confianza = "alta: web revisada"
        elif ver.startswith("ca"):
            confianza = "web caída: buscar la sociedad operativa"
        elif ver == "dudosa":
            confianza = "media: web revisada sin confirmar mantenimiento"
        else:
            confianza = "alta: por nombre" if claro else "media: confirmar oficio en su web"
        motivo = MOTIVO[s]
        if w.get("oficio"):
            motivo = f"Su web: {w['oficio'].rstrip('.')}. " + motivo
        filas.append({
            "empresa": r.get("nombre"),
            "dominio": dom,
            "web": r.get("web") or f"http://www.{dom}",
            "telefono_empresa": r.get("tel") or "",
            "zona": w.get("ciudad") or r.get("provincia") or REGION.get(r["regiones"][0], r["regiones"][0]),
            "segmento": s,
            "codigo_actividad": ",".join(r.get("naics") or []),
            "motivo_encaje": motivo,
            "senal_web": w.get("señal", ""),
            "primera_linea": w.get("primera_linea", ""),
            "confianza": confianza,
            "mensaje": f"copy/mensajes-noviembre.md#{s}",
            "fuente": "Apollo, búsqueda del 29-oct",
        })
    filas.sort(key=lambda f: (f["segmento"], f["confianza"], f["zona"], f["empresa"]))
    with open(os.path.join(SALIDA, "lista-29oct.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0]))
        w.writeheader()
        w.writerows(filas)
    with open(os.path.join(SALIDA, "revision-29oct.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["empresa", "dominio", "decision", "motivo_descarte"])
        for dom, d in sorted(rev.items(), key=lambda x: (x[1]["decision"], x[0])):
            w.writerow([c[dom].get("nombre"), dom, d["decision"], d.get("motivo", "")])
    from collections import Counter
    print(len(filas), "empresas")
    print(Counter(f["segmento"] for f in filas))
    print(Counter(f["confianza"] for f in filas))
    print(Counter(bool(f["primera_linea"]) for f in filas))
    print(Counter(d.get("motivo") for d in rev.values() if d["decision"] == "fuera").most_common())


if __name__ == "__main__":
    main(*sys.argv[1:])
