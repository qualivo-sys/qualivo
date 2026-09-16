#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Reescribe el copy de los leads que TODAVIA NO HAN RECIBIDO NADA.
#
# Cuando se corrige el texto en carga_v3.py, los leads ya cargados siguen
# llevando el copy viejo pegado en sus custom_fields: el copy viaja con el lead,
# no con la campana. Esto los pone al dia.
#
# Solo toca los STARTED (en cola). A un INPROGRESS o COMPLETED no se le cambia
# el texto: ya recibio el email 1 y cambiarselo solo desalinea el hilo con los
# seguimientos que le quedan por recibir.
#
# La puerta y las variables se recuperan del propio lead: la puerta esta en
# custom_fields y el CRM o la herramienta se leen del asunto, que es donde
# quedaron ("vuestro Salesforce", "vuestra lista de Brevo").
#
# Uso: python3 refrescar_copy.py <API_KEY> [--aplica]
import importlib.util
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error

K = sys.argv[1]
APLICA = "--aplica" in sys.argv
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
B = "https://server.smartlead.ai/api/v1"

# La campana de rescate lleva su propio copy (copy_rescate.py), no el de las
# puertas: no se toca desde aqui.
FUERA = {3967855}


def api(m, ruta, cuerpo=None):
    url = f"{B}{ruta}{'&' if '?' in ruta else '?'}api_key={K}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, headers=UA, method=m)
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                t = r.read().decode()
                return json.loads(t) if t.strip().startswith(("{", "[")) else {"raw": t}
        except urllib.error.HTTPError as e:
            return {"err": f"{e.code} {e.read().decode()[:160]}"}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(2)


spec = importlib.util.spec_from_file_location(
    "cv", os.path.join(os.path.dirname(os.path.abspath(__file__)), "carga_v3.py"))
cv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cv)

# De que puerta sale cada asunto, para recuperar la variable que le falta.
DE_ASUNTO = [
    (re.compile(r"^vuestra lista de (.+)$"), "herramienta"),
    (re.compile(r"^vuestro (?!Google Ads$)(.+)$"), "crm"),
]

tocados = saltados = fallos = 0
sin_puerta = []
for c in api("GET", "/campaigns") or []:
    if c["id"] in FUERA or c.get("status") != "ACTIVE":
        continue
    off = 0
    while True:
        d = api("GET", f"/campaigns/{c['id']}/leads?offset={off}&limit=100")
        lote = (d or {}).get("data") or []
        for it in lote:
            l = it.get("lead") or it
            if (it.get("status") or "").upper() != "STARTED":
                saltados += 1
                continue
            cf = l.get("custom_fields") or {}
            puerta, asunto = cf.get("puerta"), cf.get("subject1") or ""
            if not puerta or puerta not in cv.PUERTAS:
                sin_puerta.append(l.get("email"))
                fallos += 1
                continue
            v = {}
            for rx, campo in DE_ASUNTO:
                m = rx.match(asunto)
                if m and f"{{{campo}}}" in cv.PUERTAS[puerta][0]:
                    v = {campo: m.group(1)}
                    break
            if any(x in cv.PUERTAS[puerta][0] + cv.PUERTAS[puerta][1]
                   for x in ("{crm}", "{herramienta}")) and not v:
                sin_puerta.append(l.get("email"))
                fallos += 1
                continue
            x = {"email": l.get("email"), "first_name": l.get("first_name") or "",
                 "company_name": l.get("company_name") or "",
                 "dom": l.get("website") or "", "puerta": puerta, "v": v}
            try:
                s, b1, b2, b3 = cv.construir(x)
            except Exception:
                fallos += 1
                continue
            if b1 == cf.get("body1"):
                saltados += 1
                continue
            if not APLICA:
                tocados += 1
                continue
            r = api("POST", f"/campaigns/{c['id']}/leads/{l['id']}",
                    {"email": l.get("email"),
                     "custom_fields": {"subject1": s, "body1": b1, "body2": b2,
                                       "body3": b3, "puerta": puerta}})
            if r.get("err"):
                fallos += 1
            else:
                tocados += 1
        if len(lote) < 100:
            break
        off += 100

print(f"{'[seco] ' if not APLICA else ''}en cola actualizados: {tocados} · "
      f"sin tocar (ya enviados o ya al dia): {saltados} · fallos: {fallos}")
if sin_puerta:
    print(f"sin puerta o sin variable ({len(sin_puerta)}): {sin_puerta[:8]}")
