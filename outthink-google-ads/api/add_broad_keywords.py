#!/usr/bin/env python3
"""Amplía el listado de keywords de OT26_Search en concordancia AMPLIA
y refuerza las negativas de campaña (amplia abre mucho el embudo).
Uso: python3 add_broad_keywords.py [--real]"""
import json, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
CAMPAIGN = f"customers/{CID}/campaigns/24182552133"
VALIDATE = "--real" not in sys.argv

AD_GROUPS = {
    "200661841858": ["ai act", "reglamento ia", "reglamento europeo inteligencia artificial",
                     "ley de inteligencia artificial", "normativa europea ia",
                     "ai act 2026", "cumplimiento ai act"],
    "197433188617": ["cumplimiento normativo inteligencia artificial",
                     "gobernanza inteligencia artificial", "auditoria de ia",
                     "riesgos ia empresas", "dpo inteligencia artificial",
                     "proteccion de datos inteligencia artificial"],
    "199171526786": ["evento ia madrid", "congreso inteligencia artificial",
                     "jornada inteligencia artificial", "foro ia empresas",
                     "conferencia ia españa", "eventos ia 2026"],
}
# La marca se queda en FRASE: "outthink" en amplia arrastraría basura en inglés.
BRAND_PHRASE = {"203250685081": ["outthink for ai", "outthink 2026", "foro outthink"]}

NEG_EXTRA = ["chatgpt", "curso online", "certificacion", "universidad", "tfg", "tfm",
             "descargar", "wikipedia", "generador", "imagenes", "trabajo", "sueldo",
             "practicas", "becas", "apuntes", "que es la inteligencia artificial"]

d = urllib.parse.urlencode({"client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
    "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=d)) as r:
    TOK = json.load(r)["access_token"]
H = {"Authorization": f"Bearer {TOK}", "developer-token": CREDS["developer_token"],
     "Content-Type": "application/json"}

ops = []
for ag, kws in AD_GROUPS.items():
    for kw in kws:
        ops.append({"adGroupCriterionOperation": {"create": {
            "adGroup": f"customers/{CID}/adGroups/{ag}", "status": "ENABLED",
            "keyword": {"text": kw, "matchType": "BROAD"}}}})
for ag, kws in BRAND_PHRASE.items():
    for kw in kws:
        ops.append({"adGroupCriterionOperation": {"create": {
            "adGroup": f"customers/{CID}/adGroups/{ag}", "status": "ENABLED",
            "keyword": {"text": kw, "matchType": "PHRASE"}}}})
for neg in NEG_EXTRA:
    ops.append({"campaignCriterionOperation": {"create": {
        "campaign": CAMPAIGN, "negative": True,
        "keyword": {"text": neg, "matchType": "BROAD"}}}})

req = urllib.request.Request(
    f"https://googleads.googleapis.com/v25/customers/{CID}/googleAds:mutate",
    data=json.dumps({"mutateOperations": ops, "validateOnly": VALIDATE}).encode(), headers=H)
print(f"{len(ops)} operaciones ({'VALIDATE' if VALIDATE else 'REAL'})")
try:
    with urllib.request.urlopen(req) as r:
        body = json.load(r)
except urllib.error.HTTPError as e:
    print("ERROR", e.read().decode()[:2500]); raise SystemExit(1)
print("VALIDACION OK" if VALIDATE else f"CREADO: {len(body.get('mutateOperationResponses', []))} recursos")
