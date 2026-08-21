#!/usr/bin/env python3
"""Motor de la biblioteca estratégica de Qualivo.

Cruza ICP × Dolor × Ángulo × Nivel, puntúa cada combinación con las señales
calientes de la semana y devuelve las salidas diarias de QUALIVO DAILY:
Top 10 contenidos · Top 5 anuncios · Top 3 lead magnets · Top 3 landings ·
Top 3 campañas.

Fuente de verdad de los dolores: 01-dolores.md (se parsea, no se duplica).

Uso:
    python3 motor.py                 # informe del día
    python3 motor.py --icp ICP-FOR   # forzar ICP
    python3 motor.py --json          # salida JSON para el agente
"""
import argparse
import datetime as dt
import json
import re
from pathlib import Path

BASE = Path(__file__).parent
DATOS = BASE / "datos"

# ---------------------------------------------------------------- ángulos

ANGULOS = {
    "A-ERROR": "El error",
    "A-COSTE": "El coste oculto",
    "A-MITO": "El mito",
    "A-CONTRA": "Contrarian",
    "A-CASO": "Caso real",
    "A-DIAG": "Diagnóstico",
    "A-FRAME": "Framework / mecanismo",
    "A-COMPA": "Comparativa",
    "A-TEND": "Tendencia",
    "A-PRED": "Predicción",
    "A-BTS": "Behind the scenes",
    "A-OPOR": "Oportunidad",
}

# ángulos válidos por nivel (04-niveles-consciencia.md). El primero de cada
# lista es la casilla fuerte del nivel.
COMPAT = {
    1: ["A-COSTE", "A-DIAG", "A-TEND", "A-PRED"],
    2: ["A-ERROR", "A-MITO", "A-CONTRA", "A-COMPA", "A-COSTE", "A-OPOR"],
    3: ["A-CONTRA", "A-FRAME", "A-DIAG", "A-COMPA", "A-CASO"],
    4: ["A-FRAME", "A-CASO", "A-BTS", "A-OPOR"],
    5: ["A-CASO", "A-BTS", "A-FRAME"],
}

CUOTA_NIVEL = {1: 0.30, 2: 0.30, 3: 0.25, 4: 0.10, 5: 0.05}

CTA = {
    1: "ninguno (o «guárdalo»)",
    2: "Escríbeme FUGAS",
    3: "Escríbeme DIAGNÓSTICO / lead magnet",
    4: "Diagnóstico gratuito (Calculadora de Fugas)",
    5: "Reservar el escáner",
}

# A-CASO bloqueado hasta que haya piloto cerrado con permiso (regla 3 de 05-matriz)
BLOQUEADOS = {"A-CASO"}

DOLORES_ENTRADA = ["D-DIR-02", "D-DIR-01", "D-COM-10", "D-OPS-01",
                   "D-MKT-03", "D-COM-01", "D-DIR-04", "D-DIR-10"]

AREAS = {"MKT": "Marketing", "COM": "Comercial", "OPS": "Operaciones", "DIR": "Dirección"}

# ---------------------------------------------------------------- carga

FILA = re.compile(
    r"^\|\s*\*\*(D-[A-Z]{3}-\d{2})\*\*\s*\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|\s*$")


def cargar_dolores():
    """Parsea las tablas de 01-dolores.md. Único sitio donde viven los dolores."""
    dolores = {}
    for linea in (BASE / "01-dolores.md").read_text(encoding="utf-8").splitlines():
        m = FILA.match(linea.strip())
        if not m:
            continue
        did, llano, senal, escape, etiquetas = (c.strip() for c in m.groups())
        etapa, _, familia = etiquetas.partition("·")
        dolores[did] = {
            "id": did,
            "area": AREAS[did.split("-")[1]],
            "llano": llano.strip("«» "),
            "senal": senal,
            "escape": escape,
            "etapa": etapa.strip(),
            "familia": familia.strip(),
        }
    return dolores


def cargar(nombre):
    return json.loads((DATOS / nombre).read_text(encoding="utf-8"))


# ---------------------------------------------------------------- puntuación

def peso_senal(dolor_id, senales, hoy):
    for s in senales["senales"]:
        if s["dolor"] != dolor_id:
            continue
        if s.get("caduca") and dt.date.fromisoformat(s["caduca"]) < hoy:
            continue
        return s["peso"], s
    return 0.0, None


def puntuar(icp_id, icp, dolor_id, angulo, nivel, senales, hist, hoy, icp_semana,
            canal="organico"):
    # --- reglas de compatibilidad (descartan) ---
    if angulo in BLOQUEADOS:
        return None
    if angulo not in COMPAT[nivel]:
        return None
    if dolor_id not in icp["dolores"] and dolor_id not in DOLORES_ENTRADA:
        return None

    codigo = f"{icp_id}·{dolor_id}·{angulo}·N{nivel}"
    for p in hist["publicado"]:
        dias = (hoy - dt.date.fromisoformat(p["fecha"])).days
        if p["codigo"] == codigo and dias < 60:
            return None
        if p["codigo"].split("·")[1] == dolor_id and dias < 14:
            return None

    # --- factores ---
    peso, senal = peso_senal(dolor_id, senales, hoy)
    f_senal = 30 * peso

    f_icp = 20 if icp_id == icp_semana else max(0, 20 - 2 * icp["prioridad"])

    if dolor_id in icp["dolores"]:
        pos = icp["dolores"].index(dolor_id)
        f_dolor = 20 - 2 * pos
    else:
        f_dolor = 8  # dolor de entrada, vale para cualquiera

    f_encaje = 15 if COMPAT[nivel][0] == angulo else 9
    if senal and senal.get("angulo_sugerido") == angulo:
        f_encaje = 15

    f_cuota = 10 * CUOTA_NIVEL[nivel] / 0.30

    usados = [p["codigo"].split("·")[2] for p in hist["publicado"][-3:]]
    f_frescura = 0 if angulo in usados else 5
    f_canal = 8 if (canal == "organico" and angulo == "A-BTS") else 0

    total = (f_senal + f_icp + f_dolor + f_encaje + f_cuota + f_frescura + f_canal)
    return {
        "codigo": codigo, "icp": icp_id, "icp_nombre": icp["nombre"],
        "dolor": dolor_id, "angulo": angulo, "angulo_nombre": ANGULOS[angulo],
        "nivel": nivel, "puntos": round(total, 1),
        "senal": senal["fuente"] if senal else None,
        "cta": CTA[nivel], "no_decir": icp["no_decir"],
    }


def generar(icp_semana=None, hoy=None, canal="organico"):
    """canal='organico' habla a la audiencia que YA tenemos (ICP-TRA, sin sector).
    canal='pago' habla al ICP de la semana, porque en publicidad y en puerta fria
    elegimos nosotros quien nos ve."""
    hoy = hoy or dt.date.today()
    dolores = cargar_dolores()
    icps = cargar("icps.json")
    senales = cargar("senales.json")
    hist = cargar("historial.json")
    if icp_semana is None:
        icp_semana = "ICP-TRA" if canal == "organico" else min(
            (k for k in icps if k != "ICP-TRA"),
            key=lambda k: icps[k]["prioridad"])

    cands = []
    for icp_id, icp in icps.items():
        for dolor_id in dolores:
            for angulo in ANGULOS:
                for nivel in COMPAT:
                    c = puntuar(icp_id, icp, dolor_id, angulo, nivel,
                                senales, hist, hoy, icp_semana, canal)
                    if c:
                        c["llano"] = dolores[dolor_id]["llano"]
                        c["escape"] = dolores[dolor_id]["escape"]
                        c["area"] = dolores[dolor_id]["area"]
                        cands.append(c)
    cands.sort(key=lambda c: -c["puntos"])
    return icp_semana, cands, dolores


def repartir(cands, n=10, icp_semana=None, max_por_dolor=3, max_por_angulo=2):
    """Top n con hilo conductor: todo del ICP de la semana, repartido por niveles
    segun la cuota, con un maximo de piezas por dolor para que la semana tenga
    varios dolores y no uno repetido cinco veces."""
    objetivo = {niv: max(1, round(n * q)) for niv, q in CUOTA_NIVEL.items()}
    pool = [c for c in cands if c["icp"] == icp_semana] or cands
    elegidos, vistos, por_dolor, por_ang = [], set(), {}, {}

    def coger(c, respetar_cuota=True):
        clave = (c["dolor"], c["angulo"])
        if clave in vistos:
            return False
        if por_dolor.get(c["dolor"], 0) >= max_por_dolor:
            return False
        if por_ang.get(c["angulo"], 0) >= max_por_angulo:
            return False
        if respetar_cuota and objetivo[c["nivel"]] <= 0:
            return False
        vistos.add(clave)
        por_dolor[c["dolor"]] = por_dolor.get(c["dolor"], 0) + 1
        por_ang[c["angulo"]] = por_ang.get(c["angulo"], 0) + 1
        objetivo[c["nivel"]] -= 1
        elegidos.append(c)
        return True

    for c in pool:
        if len(elegidos) >= n:
            break
        coger(c)
    for c in pool:  # rellenar huecos que dejo la cuota
        if len(elegidos) >= n:
            break
        coger(c, respetar_cuota=False)
    if len(elegidos) < n:      # ultimo recurso: relajar el tope de angulo
        max_por_angulo = n
        for c in pool:
            if len(elegidos) >= n:
                break
            coger(c, respetar_cuota=False)
    return sorted(elegidos, key=lambda c: (c["nivel"], -c["puntos"]))


def informe(icp_semana, cands, dolores, canal="organico"):
    top10 = repartir(cands, 10, icp_semana)
    anuncios = repartir([c for c in cands if c["nivel"] in (1, 2, 3)],
                        5, icp_semana, max_por_dolor=2)
    magnets = repartir([c for c in cands if c["angulo"] in ("A-DIAG", "A-FRAME")],
                       3, icp_semana, max_por_dolor=1, max_por_angulo=2)
    landings = repartir([c for c in cands if c["nivel"] in (3, 4)],
                        3, icp_semana, max_por_dolor=1, max_por_angulo=2)
    dolores_top = []
    for c in [x for x in cands if x["icp"] == icp_semana] or cands:
        if c["dolor"] not in dolores_top:
            dolores_top.append(c["dolor"])
        if len(dolores_top) == 3:
            break
    return {"icp_semana": icp_semana, "canal": canal, "contenidos": top10, "anuncios": anuncios,
            "lead_magnets": magnets, "landings": landings,
            "campanas": [{"dolor": d, "llano": dolores[d]["llano"],
                          "icp": icp_semana} for d in dolores_top]}


def imprimir(inf):
    print(f"\n📊 QUALIVO DAILY · {dt.date.today():%d-%m-%Y}")
    print(f"Canal: {inf['canal']}   ·   ICP: {inf['icp_semana']}\n")
    print("── TOP 10 CONTENIDOS " + "─" * 40)
    for i, c in enumerate(inf["contenidos"], 1):
        print(f"{i:2}. [N{c['nivel']} · {c['angulo_nombre']}] {c['puntos']:>5} pts  {c['codigo']}")
        print(f"    «{c['llano']}»")
        print(f"    CTA: {c['cta']}" + (f"  ⚡ {c['senal']}" if c["senal"] else ""))
    for titulo, clave in (("TOP 5 ANUNCIOS", "anuncios"),
                          ("TOP 3 LEAD MAGNETS", "lead_magnets"),
                          ("TOP 3 LANDINGS", "landings")):
        print(f"\n── {titulo} " + "─" * (58 - len(titulo)))
        for i, c in enumerate(inf[clave], 1):
            print(f"{i}. {c['codigo']}  «{c['llano']}»")
    print("\n── TOP 3 CAMPAÑAS " + "─" * 43)
    for i, c in enumerate(inf["campanas"], 1):
        print(f"{i}. {c['dolor']} × {c['icp']} — «{c['llano']}»")
    print()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--icp")
    ap.add_argument("--canal", choices=("organico", "pago"), default="organico")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    icp, cands, dols = generar(a.icp, canal=a.canal)
    inf = informe(icp, cands, dols, a.canal)
    if a.json:
        print(json.dumps(inf, ensure_ascii=False, indent=2))
    else:
        imprimir(inf)
