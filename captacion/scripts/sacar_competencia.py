#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Saca de las campanas a la competencia directa.
#
# Lista revisada a mano, no por regex: "DSD Digital Smile Design" lleva
# "Digital" y es una clinica dental, y "LUDA Partners" lleva "Partners" y es
# una red de farmacias. Los que se van son agencias de marketing, consultoras
# que implantan las mismas herramientas que usamos como senal, y partners
# oficiales de Odoo. A un Odoo Gold Partner no se le escribe "veo que
# trabajais con Odoo, seguro que teneis oportunidades paradas".
import json
import sys
import time
import urllib.request

K = sys.argv[1]
MODO = sys.argv[2] if len(sys.argv) > 2 else "--dry"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
B = "https://server.smartlead.ai/api/v1"
CAMPS = [3963217, 3963237, 3963336, 3964076, 3964077, 3964312, 3964313, 3964316]

FUERA = {
    # agencias de marketing / medios
    "alphapublicidad.com", "otternativemarketing.com", "proacomunicacion.es",
    "royalcomunicacion.com", "sembi.es", "adgmediagroup.es", "agencianous.com",
    "seoinnova.es", "asiri.es", "brutalmedia.tv", "ecomgrowthpartners.com",
    "inkamarketing.es", "leadproagency.com", "themediapower.com",
    "roashunter.com", "seocom.agency", "whyadsmedia.com", "digitalgroup.com",
    "agenciakarmina.com", "agenciasnowball.com", "lin3s.com",
    "asuntosdigitales.com", "mairu.digital", "woxi.digital", "agora-digital.es",
    "neurologyca.com", "alcalink.com", "fidenet.net", "digital55.com",
    # consultoras / partners de las herramientas que usamos como senal
    "dynapps.es", "madetosoft.com", "processcontrol.com", "becolve.com",
    # captacion de talento con agencia en el nombre
    "bluselection.com",
}


def call(m, u, b=None):
    r = urllib.request.Request(u, data=json.dumps(b).encode() if b else None,
                               headers=UA, method=m)
    for i in range(3):
        try:
            with urllib.request.urlopen(r, timeout=45) as f:
                t = f.read().decode()
                try:
                    return json.loads(t)
                except ValueError:
                    return {"raw": t}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(2)


borrados = parados = 0
detalle = []
for cid in CAMPS:
    off = 0
    while True:
        d = call("GET", f"{B}/campaigns/{cid}/leads?api_key={K}&offset={off}&limit=100")
        b = (d or {}).get("data") or []
        for it in b:
            l = it.get("lead") or it
            em = (l.get("email") or "").lower()
            dom = em.split("@")[-1]
            if dom not in FUERA:
                continue
            st = (it.get("status") or "").upper()
            emp = l.get("company_name") or ""
            if MODO == "--dry":
                detalle.append((st, emp, em))
                continue
            if st == "STARTED":
                # aun no ha recibido nada: fuera de la campana
                r = call("DELETE", f"{B}/campaigns/{cid}/leads/{l['id']}?api_key={K}")
                if not r.get("err"):
                    borrados += 1
                    detalle.append(("BORRADO", emp, em))
            else:
                # ya recibio el email 1: no se puede deshacer, pero se corta
                # la secuencia para que no le lleguen los dos seguimientos
                r = call("POST", f"{B}/campaigns/{cid}/leads/{l['id']}/pause?api_key={K}")
                if not r.get("err"):
                    parados += 1
                    detalle.append(("PARADO", emp, em))
                else:
                    detalle.append(("ERROR " + str(r.get("err"))[:40], emp, em))
        if len(b) < 100:
            break
        off += 100

for x in detalle:
    print(f"  [{x[0]:8}] {x[1][:34]:34} {x[2]}")
if MODO == "--dry":
    print(f"\n[dry] {len(detalle)} coincidencias, no se ha tocado nada")
else:
    print(f"\nborrados (aun sin enviar): {borrados} · parados (ya enviados): {parados}")
