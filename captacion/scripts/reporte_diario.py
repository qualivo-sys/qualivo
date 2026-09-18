#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Reporte diario de envios de Qualivo.
# Uso: python3 reporte_diario.py <SMARTLEAD_API_KEY> [YYYY-MM-DD]
# Imprime, para el dia indicado (por defecto hoy, hora de Madrid):
# envios, aperturas, clics, respuestas y rebotes por campana, mas
# el nivel del deposito (notStarted) de las campanas activas.
import json, sys, urllib.request, datetime, zoneinfo, collections

KEY = sys.argv[1]
TZ = zoneinfo.ZoneInfo("Europe/Madrid")
DIA = sys.argv[2] if len(sys.argv) > 2 else datetime.datetime.now(TZ).date().isoformat()
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126"}

def req(u):
    return json.loads(urllib.request.urlopen(urllib.request.Request(u, headers=UA)).read())

camps = req(f"https://server.smartlead.ai/api/v1/campaigns?api_key={KEY}")
tot = collections.Counter()
filas = []
for c in camps:
    cid = c["id"]
    n = collections.Counter()
    off = 0
    while True:
        d = req(f"https://server.smartlead.ai/api/v1/campaigns/{cid}/statistics?api_key={KEY}&offset={off}&limit=500")
        rows = d.get("data") or []
        for r in rows:
            if (r.get("sent_time") or "")[:10] == DIA:
                n["env"] += 1
                if r.get("is_bounced"): n["reb"] += 1
            if (r.get("open_time") or "")[:10] == DIA and (r.get("open_count") or 0) > 0:
                n["ap"] += 1
            if (r.get("click_time") or "")[:10] == DIA and (r.get("click_count") or 0) > 0:
                n["clic"] += 1
            if (r.get("reply_time") or "")[:10] == DIA:
                n["resp"] += 1
        if len(rows) < 500: break
        off += 500
    if sum(n.values()):
        filas.append((c["name"][:38], c["status"], n))
        tot.update(n)
    # deposito de las activas aunque no hayan movido nada hoy
    if c["status"] == "ACTIVE":
        a = req(f"https://server.smartlead.ai/api/v1/campaigns/{cid}/analytics?api_key={KEY}")
        s = a.get("campaign_lead_stats") or {}
        filas_dep = (c["name"][:38], int(s.get("notStarted") or 0), int(s.get("inprogress") or 0))
        print(f"DEPOSITO|{filas_dep[0]}|{filas_dep[1]}|{filas_dep[2]}")

print(f"\nREPORTE {DIA}")
print(f"{'CAMPANA':40} {'EST':8} {'ENV':>4} {'AP':>4} {'CLIC':>4} {'RESP':>4} {'REB':>4}")
for nombre, st, n in sorted(filas, key=lambda x: -x[2]["env"]):
    print(f"{nombre:40} {st:8} {n['env']:>4} {n['ap']:>4} {n['clic']:>4} {n['resp']:>4} {n['reb']:>4}")
print(f"{'TOTAL':40} {'':8} {tot['env']:>4} {tot['ap']:>4} {tot['clic']:>4} {tot['resp']:>4} {tot['reb']:>4}")
