#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Regenera msg1 y msg2 de los leads ya cargados en una lista de HeyReach.
#
# POR QUE HACE FALTA UN SCRIPT APARTE
#
# msg1 y msg2 no viven en la secuencia de la campana: viven como customFields
# de CADA LEAD, congelados el dia de la carga. Arreglar copy_linkedin.py no
# toca ni un lead ya cargado, y pausar la campana tampoco. Si alguien reanuda
# sin regenerar, sale el texto viejo tal cual.
#
# Es lo que paso el 1-oct: a Rafa Calle (magnettu) le llego "Con lo que
# invertis en LinkedIn..." y contesto "No invertimos 1 euro en LinkedIn".
#
# COMO SABE QUE PUERTA ERA CADA LEAD
#
# No hay que volver a sondear ninguna web: la puerta y la herramienta se leen
# del propio msg1 congelado, que las lleva dentro. Asi no se gastan creditos de
# Apify y no se arriesga a que la sonda vea hoy algo distinto de lo que vio el
# dia de la carga, que seria cambiarle el mensaje a alguien por una razon nueva.
#
# NO ESCRIBE EN HEYREACH. Deja un fichero listo para que lo suba quien tenga el
# ok de Maikel. Cambiar el copy es decision suya.
#
# Uso:
#   python3 regenera_msgs.py lista.json --out nuevos.json
#   python3 regenera_msgs.py lista.json --solo-pendientes conversaciones.json
import importlib.util
import json
import re
import sys
import os

_aqui = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("cl", os.path.join(_aqui, "copy_linkedin.py"))
cl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cl)

# Como se reconoce cada puerta en el msg1 VIEJO. Son las frases que se enviaron
# hasta el 1-oct; si alguna vez se cambian otra vez, esta tabla se queda corta y
# el script lo dice en vez de adivinar.
HUELLAS = [
    ("linkedin_ads", r"invertís en LinkedIn",                            None),
    ("meta_ads",     r"píxel de Meta",                                   None),
    ("google_ads",   r"movéis en Google",                                None),
    ("crm",          r"Con (.+?), ¿tenéis bastante control",             1),
    ("lista",        r"Con (.+?), ¿sabéis cuál de vuestros suscriptores", 1),
]


def lee(lead, campo):
    return next((c.get("value") for c in (lead.get("customFields") or [])
                 if c.get("name") == campo), "")


def deduce(msg1):
    """Devuelve (puerta, asunto) a partir del msg1 viejo, o (None, motivo)."""
    for puerta, patron, grupo in HUELLAS:
        m = re.search(patron, msg1 or "")
        if not m:
            continue
        if grupo is None:
            return puerta, "vuestros anuncios"
        var = m.group(grupo).strip()
        return puerta, (f"vuestro {var}" if puerta == "crm"
                        else f"vuestra lista de {var}")
    return None, "no reconozco la puerta en el msg1 viejo"


def main():
    datos = json.load(open(sys.argv[1], encoding="utf-8"))
    leads = datos.get("items", datos) if isinstance(datos, dict) else datos

    pendientes = None
    if "--solo-pendientes" in sys.argv:
        conv = json.load(open(sys.argv[sys.argv.index("--solo-pendientes") + 1],
                              encoding="utf-8"))
        ya = {c["correspondentProfile"]["profileUrl"].rstrip("/")
              for c in conv.get("items", conv)}
        pendientes = ya

    out, saltados, sin_puerta = [], 0, []
    for l in leads:
        if pendientes is not None and (l.get("profileUrl") or "").rstrip("/") in pendientes:
            saltados += 1          # ya recibio el mensaje: no se le reescribe nada
            continue
        viejo = lee(l, "msg1")
        puerta, asunto = deduce(viejo)
        if puerta is None:
            sin_puerta.append((l.get("profileUrl"), asunto))
            continue
        r = cl.construir(l.get("firstName"), l.get("companyName") or "", puerta, asunto)
        if not r:
            sin_puerta.append((l.get("profileUrl"), "construir() lo descarto"))
            continue
        out.append({
            "profileUrl": l.get("profileUrl"),
            "firstName": l.get("firstName"),
            "companyName": l.get("companyName"),
            "puerta": puerta,
            "msg1": r[0],
            "msg2": r[1],
            "msg1_viejo": viejo,
        })

    print(f"  regenerados      {len(out)}")
    if pendientes is not None:
        print(f"  saltados (ya les llego el mensaje viejo)  {saltados}")
    if sin_puerta:
        print(f"  SIN PUERTA RECONOCIDA  {len(sin_puerta)} -> no se tocan:")
        for u, m in sin_puerta[:5]:
            print(f"      {u}  ({m})")

    # Red de seguridad: ninguno de los nuevos puede afirmar gasto ni uso.
    PROHIBIDO = ["invertís", "invertis", "movéis", "moveis", "estáis comprando",
                 "¿tenéis bastante control", "mandáis campañas"]
    malos = [o for o in out if any(p in o["msg1"] for p in PROHIBIDO)]
    print(f"  afirman gasto o uso: {len(malos)}" + ("  <-- REVISAR" if malos else "  (ninguno)"))

    if "--out" in sys.argv:
        d = sys.argv[sys.argv.index("--out") + 1]
        json.dump(out, open(d, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"  escrito en {d} · NO se ha subido nada a HeyReach")


if __name__ == "__main__":
    main()
