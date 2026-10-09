#!/usr/bin/env python3
"""Guardián de reenvíos de Smartlead.

Detecta si alguna campaña ACTIVA está enviando el paso 1 a leads que ya tenían
correos anteriores (síntoma de reinicio de secuencia) y la PAUSA automáticamente.

Regla de detección: en los envíos de HOY, un lead que recibe sequence_number 1
teniendo ya cualquier envío anterior a más de 3 días cuenta como reenvío. Si una
campaña acumula 3 o más reenvíos hoy, se pausa y se reporta.

Uso: python3 guardia_reenvios.py <SMARTLEAD_API_KEY>
Salida: una línea por campaña; exit code 1 si pausó algo (para alertar).
"""
import json, sys, urllib.request, datetime
from collections import defaultdict

KEY = sys.argv[1]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
BASE = "https://server.smartlead.ai/api/v1"
HOY = datetime.date.today().isoformat()
UMBRAL_DIAS = 3
UMBRAL_REENVIOS = 3

def req(url, data=None):
    r = urllib.request.Request(url, headers={"User-Agent": UA, "Content-Type": "application/json"},
                               data=json.dumps(data).encode() if data else None)
    return json.loads(urllib.request.urlopen(r).read())

camps = [c for c in req(f"{BASE}/campaigns?api_key={KEY}") if c.get("status") == "ACTIVE"]
pausadas = []
for c in camps:
    cid = c["id"]
    rows, off = [], 0
    while True:
        d = req(f"{BASE}/campaigns/{cid}/statistics?api_key={KEY}&offset={off}&limit=100")
        page = d.get("data") or []
        rows += page
        if len(page) < 100:
            break
        off += 100
    por_lead = defaultdict(list)
    for r in rows:
        por_lead[r.get("lead_email")].append(r)
    reenvios = 0
    limite = (datetime.date.today() - datetime.timedelta(days=UMBRAL_DIAS)).isoformat()
    for em, rr in por_lead.items():
        hoy1 = [x for x in rr if (x.get("sent_time") or "").startswith(HOY) and (x.get("sequence_number") or 1) == 1]
        previos = [x for x in rr if x.get("sent_time") and x["sent_time"][:10] < limite]
        if hoy1 and previos:
            reenvios += 1
    if reenvios >= UMBRAL_REENVIOS:
        req(f"{BASE}/campaigns/{cid}/status?api_key={KEY}", {"status": "PAUSED"})
        pausadas.append((cid, c["name"], reenvios))
        print(f"PAUSADA {cid} {c['name']}: {reenvios} reenvios a ya contactados HOY")
    else:
        print(f"ok {cid} {c['name']}: {reenvios} reenvios")
sys.exit(1 if pausadas else 0)
