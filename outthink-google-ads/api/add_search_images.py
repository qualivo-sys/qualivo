#!/usr/bin/env python3
"""Añade recursos de imagen a la campaña de Search (aumentan CTR en móvil).
Usa creatividades ya subidas y aprobadas. Uso: python3 add_search_images.py [--real]"""
import json, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
ASSETS = json.loads((BASE/"asset_map.json").read_text())
CID = "9188115388"
CAMPAIGN = f"customers/{CID}/campaigns/24182552133"
VALIDATE = "--real" not in sys.argv

# Search admite cuadrada (1:1) y horizontal (1.91:1). Usamos los conceptos institucionales.
SQUARE = ["OT26_P1_SQ", "OT26_P2_SQ", "OT26_R3_SQ"]
LANDSCAPE = ["OT26_P1_HZ", "OT26_P2_HZ", "OT26_R3_HZ"]

d = urllib.parse.urlencode({"client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
    "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=d)) as r:
    TOK = json.load(r)["access_token"]
H = {"Authorization": f"Bearer {TOK}", "developer-token": CREDS["developer_token"],
     "Content-Type": "application/json"}

ops = []
for name in SQUARE:
    ops.append({"create": {"campaign": CAMPAIGN, "asset": ASSETS[name],
                           "fieldType": "AD_IMAGE"}})
for name in LANDSCAPE:
    ops.append({"create": {"campaign": CAMPAIGN, "asset": ASSETS[name],
                           "fieldType": "AD_IMAGE"}})

req = urllib.request.Request(
    f"https://googleads.googleapis.com/v25/customers/{CID}/campaignAssets:mutate",
    data=json.dumps({"operations": ops, "validateOnly": VALIDATE}).encode(), headers=H)
print(f"{len(ops)} imágenes ({'VALIDATE' if VALIDATE else 'REAL'})")
try:
    with urllib.request.urlopen(req) as r: json.load(r)
except urllib.error.HTTPError as e:
    print("ERROR", e.read().decode()[:1800]); raise SystemExit(1)
print("OK")
