#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Regenera el copy de los leads que siguen en cola, con el texto actual de
# carga_v3.py. Se usa cuando cambia el copy y hay leads sin enviar.
#
# Motivo: la API de Smartlead acepta POST /campaigns/{id}/settings con
# send_as_plain_text=false, responde {"ok":true} y NO cambia el valor. Con la
# campana en texto plano, un cuerpo en HTML llega con las etiquetas a la vista.
# Hasta que el interruptor se toque desde el panel, el copy vuelve a texto.
import json
import re
import sys
import time
import urllib.request
import importlib.util

K = sys.argv[1]
CID = sys.argv[2]
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
B = "https://server.smartlead.ai/api/v1"


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


spec = importlib.util.spec_from_file_location("cv", "captacion/scripts/carga_v3.py")
cv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cv)

hechos = saltados = fallos = 0
off = 0
while True:
    d = call("GET", f"{B}/campaigns/{CID}/leads?api_key={K}&offset={off}&limit=100")
    b = (d or {}).get("data") or []
    for it in b:
        l = it.get("lead") or it
        if (it.get("status") or "").upper() != "STARTED":
            saltados += 1
            continue
        cf = l.get("custom_fields") or {}
        puerta = cf.get("puerta")
        emp = l.get("company_name") or ""
        nom = l.get("first_name") or ""
        if not (puerta and emp and nom):
            fallos += 1
            continue
        v = {}
        if puerta == "crm":
            m = re.match(r"vuestro (.+)$", cf.get("subject1") or "")
            if not m:
                fallos += 1
                continue
            v = {"crm": m.group(1)}
        x = {"email": l.get("email"), "first_name": nom, "company_name": emp,
             "dom": l.get("website") or "", "puerta": puerta, "v": v}
        s, b1, b2, b3 = cv.construir(x)
        r = call("POST", f"{B}/campaigns/{CID}/leads/{l['id']}?api_key={K}",
                 {"email": l.get("email"),
                  "custom_fields": {"subject1": s, "body1": b1, "body2": b2,
                                    "body3": b3, "puerta": puerta}})
        if r.get("err"):
            fallos += 1
        else:
            hechos += 1
    if len(b) < 100:
        break
    off += 100
print(f"copy actualizado: {hechos} · ya enviados: {saltados} · fallos: {fallos}")
