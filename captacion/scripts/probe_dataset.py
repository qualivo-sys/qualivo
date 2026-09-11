#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Sonda de webs para el dataset "Estado de la captacion B2B".
# Uso: python3 probe_dataset.py <fichero_json_con_[{web,v}]> [csv_destino]
# Anade una fila por dominio: fecha, vertical, dominio y senales de captacion.
# El CSV es acumulativo y deduplica por dominio (no re-sondea los ya vistos).
import sys, json, csv, re, subprocess, datetime, os
from concurrent.futures import ThreadPoolExecutor

SRC = sys.argv[1]
DST = sys.argv[2] if len(sys.argv) > 2 else "captacion/datos/probe-dataset.csv"
HOY = datetime.date.today().isoformat()
CHAT = {"crisp": "client.crisp.chat", "tawk": "embed.tawk.to", "intercom": "widget.intercom.io",
        "hubspot_chat": "js.hs-scripts.com", "tidio": "code.tidio.co", "zendesk": "static.zdassets.com",
        "smartsupp": "smartsuppchat.com"}
COLS = ["fecha", "vertical", "dominio", "estado", "bytes", "formularios", "campos_email",
        "gtm", "ga4", "meta_pixel", "linkedin_pixel", "google_ads", "hubspot", "chat",
        "whatsapp", "mailto_generico", "titulo"]

vistos = set()
if os.path.exists(DST):
    with open(DST) as f:
        for row in csv.DictReader(f):
            vistos.add(row["dominio"])

def sonda(item):
    d, v = item["web"], item["v"]
    if not d or d in vistos:
        return None
    r = subprocess.run(["curl", "-sL", "--max-time", "12", "-A",
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126",
                        "https://" + d], capture_output=True)
    s = r.stdout.decode("utf-8", "ignore")
    low = s.lower()
    if len(s) < 2500:
        return {"fecha": HOY, "vertical": v, "dominio": d, "estado": "BLOQUEADA_O_CAIDA",
                "bytes": len(s), **{c: "" for c in COLS[5:]}}
    mailtos = set(re.findall(r'mailto:([^"\'>\s?]+)', s))
    gen = any(m.split("@")[0].lower() in ("info", "hola", "contacto", "contacte", "comercial",
                                          "administracion", "general") for m in mailtos)
    t = re.findall(r"<title[^>]*>(.*?)</title>", s, re.S)
    return {"fecha": HOY, "vertical": v, "dominio": d, "estado": "OK", "bytes": len(s),
            "formularios": low.count("<form"),
            "campos_email": len(re.findall(r'type=["\']email["\']', low)),
            "gtm": int("googletagmanager.com/gt" in low),
            "ga4": int(bool(re.search(r"gtag/js\?id=g-", low))),
            "meta_pixel": int("connect.facebook.net" in low),
            "linkedin_pixel": int("snap.licdn.com" in low),
            "google_ads": int("googleadservices" in low or "gtag/js?id=aw-" in low),
            "hubspot": int("hs-scripts" in low or "hsforms" in low),
            "chat": ",".join(k for k, u in CHAT.items() if u in low),
            "whatsapp": int(bool(re.search(r"wa\.me/|api\.whatsapp\.com/send", low))),
            "mailto_generico": int(gen),
            "titulo": (t[0].strip()[:80] if t else "")}

items = [x for x in json.load(open(SRC)) if x.get("web")]
with ThreadPoolExecutor(max_workers=10) as ex:
    filas = [f for f in ex.map(sonda, items) if f]
nuevo = not os.path.exists(DST)
with open(DST, "a", newline="") as f:
    w = csv.DictWriter(f, fieldnames=COLS)
    if nuevo: w.writeheader()
    for fila in filas: w.writerow(fila)
print(f"sondadas {len(filas)} webs nuevas -> {DST}")
