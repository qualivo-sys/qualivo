#!/usr/bin/env python3
"""Ajustes de la tarde del día 1:
   - Techo de CPC de Search: 3,00 € -> 5,00 € (perdíamos 70% de impresiones por ranking)
   - Negativas contra búsquedas de texto legal (la amplia trae gente buscando el reglamento)
Uso: python3 ajuste_dia1.py [--real]"""
import json, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
CAMPAIGN = f"customers/{CID}/campaigns/24182552133"
VALIDATE = "--real" not in sys.argv
NUEVO_TECHO = 5_000_000  # 5,00 €

# Quien busca el texto normativo no viene a un foro presencial
NEGATIVAS = [
    "2024 1689", "eur lex", "eurlex", "boe", "texto legal", "texto completo",
    "articulo", "artículo", "article", "consolidado", "diario oficial",
    "traduccion", "resumen ejecutivo", "infografia", "plantilla",
]

d = urllib.parse.urlencode({"client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
    "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=d)) as r:
    TOK = json.load(r)["access_token"]
H = {"Authorization": f"Bearer {TOK}", "developer-token": CREDS["developer_token"],
     "Content-Type": "application/json"}

ops = [{"campaignOperation": {"updateMask": "target_spend.cpc_bid_ceiling_micros", "update": {
    "resourceName": CAMPAIGN, "targetSpend": {"cpcBidCeilingMicros": str(NUEVO_TECHO)}}}}]
for neg in NEGATIVAS:
    ops.append({"campaignCriterionOperation": {"create": {
        "campaign": CAMPAIGN, "negative": True,
        "keyword": {"text": neg, "matchType": "BROAD"}}}})

req = urllib.request.Request(
    f"https://googleads.googleapis.com/v25/customers/{CID}/googleAds:mutate",
    data=json.dumps({"mutateOperations": ops, "validateOnly": VALIDATE}).encode(), headers=H)
print(f"{len(ops)} operaciones ({'VALIDATE' if VALIDATE else 'REAL'})")
try:
    with urllib.request.urlopen(req) as r: json.load(r)
except urllib.error.HTTPError as e:
    print("ERROR", e.read().decode()[:2000]); raise SystemExit(1)
print("OK")
