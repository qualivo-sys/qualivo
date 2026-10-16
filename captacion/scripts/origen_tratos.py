#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Dice de que canal viene cada trato de GHL y, opcionalmente, lo etiqueta.
#
# El problema: el campo "source" se ha ido rellenando a mano durante meses y hay
# trece valores distintos para cinco canales reales. "Facebook", "Meta Lead Form
# HTL (rescate manual)" y "Meta - formulario instantaneo" son lo mismo. "Q-Flow
# email", "origen-outbound", "Motor V3 · puerta CRM" y "Cold email · senal
# Google Ads" tambien. Asi no se puede leer que canal trae negocio.
#
# Aqui se normaliza a cinco canales y se deja una etiqueta "canal-..." en el
# contacto, que es lo que permite filtrar en GHL. Las etiquetas se suman, no
# sustituyen: no se borra nada de lo que ya hubiera.
#
# Uso: python3 origen_tratos.py [--etiqueta]
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from collections import Counter, defaultdict

S = ("/tmp/claude-0/-home-user-qualivo/"
     "382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad")
K = open(os.path.join(S, ".ghl_key")).read().strip()
B = "https://services.leadconnectorhq.com"
H = {"Authorization": f"Bearer {K}", "Version": "2021-07-28",
     "Accept": "application/json", "Content-Type": "application/json",
     "User-Agent": "Mozilla/5.0 Chrome/126"}

# De la cadena que haya en source o en las etiquetas, al canal de verdad.
# El orden importa: se queda con la primera que encaje.
#
# "Respuesta real" es email frio: asi se llamaban los tratos que se abrian al
# contestar alguien una campana. Y los de LinkedIn se reconocen por el correo
# ficticio "@linkedin.pendiente", que es lo que se puso cuando no habia email.
REGLAS = [
    ("base-antigua",  r"rescatado|rescate-funnel|rescate manual"),
    ("linkedin",      r"linkedin"),
    ("email-frio",    r"q-?flow|origen-outbound|motor v3|cold email|señal|senal|"
                      r"respuesta real"),
    ("meta-ads",      r"facebook|meta\b|instant[aá]neo|lead form"),
    ("web",           r"qualivo\.io|landing|diagn[oó]stico"),
]
ETIQUETA = {"base-antigua": "canal-base-antigua", "email-frio": "canal-email-frio",
            "meta-ads": "canal-meta-ads", "linkedin": "canal-linkedin",
            "web": "canal-web", "sin-identificar": "canal-sin-identificar"}


def api(m, ruta, cuerpo=None):
    r = urllib.request.Request(f"{B}{ruta}",
                               data=json.dumps(cuerpo).encode() if cuerpo is not None else None,
                               headers=H, method=m)
    for i in range(3):
        try:
            with urllib.request.urlopen(r, timeout=60) as f:
                return json.loads(f.read().decode())
        except urllib.error.HTTPError as e:
            return {"err": f"{e.code} {e.read().decode()[:160]}"}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(2)


def canal(texto):
    t = (texto or "").lower()
    for nombre, rx in REGLAS:
        if re.search(rx, t):
            return nombre
    return "sin-identificar"


def correos_en_smartlead():
    """Todos los correos que han pasado por una campana de Smartlead.

    Es la unica forma honesta de atribuir los tratos a los que nadie les puso
    origen: si el correo esta ahi, vino de email frio. Si no esta, se queda
    sin identificar y se dice, en vez de adivinar."""
    ruta = os.path.join(S, ".smartlead_key")
    if not os.path.exists(ruta):
        return set()
    k = open(ruta).read().strip()
    ua = {"User-Agent": "Mozilla/5.0 Chrome/126"}
    base = "https://server.smartlead.ai/api/v1"

    def g(u):
        for i in range(3):
            try:
                with urllib.request.urlopen(urllib.request.Request(u, headers=ua),
                                            timeout=60) as f:
                    return json.loads(f.read().decode())
            except Exception:
                if i == 2:
                    return {}
                time.sleep(2)

    out = set()
    for c in g(f"{base}/campaigns?api_key={k}") or []:
        off = 0
        while True:
            d = g(f"{base}/campaigns/{c['id']}/leads?api_key={k}&offset={off}&limit=100")
            b = (d or {}).get("data") or []
            for it in b:
                e = ((it.get("lead") or it).get("email") or "").lower()
                if e:
                    out.add(e)
            if len(b) < 100:
                break
            off += 100
    return out


def main():
    etiqueta = "--etiqueta" in sys.argv
    ops = json.load(open(os.path.join(S, "ops.json"), encoding="utf-8"))
    pipes = json.load(open(os.path.join(S, "pipes.json"), encoding="utf-8"))
    cont = json.load(open(os.path.join(S, "ops_contactos.json"), encoding="utf-8"))

    sl = correos_en_smartlead()
    print(f"correos conocidos en Smartlead: {len(sl)}\n")

    filas = []
    for o in ops:
        c = cont.get(o.get("contactId") or "", {})
        # se mira el source del contacto, el de la oportunidad y las etiquetas:
        # el dato esta repartido entre los tres segun quien lo creara.
        pistas = " ".join([c.get("source", ""), o.get("source") or "",
                           " ".join(c.get("tags", [])), o.get("name") or "",
                           c.get("email", "")])
        ca = canal(pistas)
        # Ultimo recurso antes de rendirse: si el correo esta en Smartlead, el
        # trato salio de una campana de email frio aunque nadie lo anotara.
        if ca == "sin-identificar" and (c.get("email") or "").lower() in sl:
            ca = "email-frio"
        p = pipes.get(o["pipelineId"], {})
        filas.append({
            "canal": ca,
            "pipeline": p.get("n", "?"),
            "etapa": (p.get("e") or {}).get(o["pipelineStageId"], "?"),
            "estado": o.get("status"),
            "nombre": o.get("name") or c.get("nombre") or "",
            "email": c.get("email", ""),
            "valor": o.get("monetaryValue") or 0,
            "contactId": o.get("contactId"),
            "origen_bruto": c.get("source") or o.get("source") or "(vacio)",
        })

    print(f"{'canal':16} {'tratos':>7} {'abiertos':>9} {'valor':>10}")
    for ca, n in Counter(f["canal"] for f in filas).most_common():
        ab = sum(1 for f in filas if f["canal"] == ca and f["estado"] == "open")
        v = sum(f["valor"] for f in filas if f["canal"] == ca)
        print(f"{ca:16} {n:7} {ab:9} {v:9}€")

    print("\npor canal y etapa (solo abiertos):")
    d = defaultdict(Counter)
    for f in filas:
        if f["estado"] == "open":
            d[f["canal"]][f"{f['pipeline'][:12]} · {f['etapa']}"] += 1
    for ca in d:
        print(f"  {ca}")
        for k, v in d[ca].most_common():
            print(f"      {v:3}  {k}")

    json.dump(filas, open(os.path.join(S, "tratos_por_canal.json"), "w"),
              ensure_ascii=False, indent=1)

    if not etiqueta:
        print("\n[seco] nada etiquetado. Añade --etiqueta para escribirlo en GHL.")
        return
    # Una etiqueta por contacto, no por trato: un contacto con dos tratos no
    # necesita la etiqueta dos veces.
    ya, hechos, fallos = set(), 0, 0
    for f in filas:
        cid = f["contactId"]
        if not cid or cid in ya:
            continue
        ya.add(cid)
        tags = list(set((cont.get(cid, {}).get("tags") or []) + [ETIQUETA[f["canal"]]]))
        r = api("PUT", f"/contacts/{cid}", {"tags": tags})
        if r.get("err"):
            fallos += 1
        else:
            hechos += 1
        time.sleep(0.25)
    print(f"\netiquetados {hechos} contactos · fallos {fallos}")


if __name__ == "__main__":
    main()
