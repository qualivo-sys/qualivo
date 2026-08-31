#!/usr/bin/env python3
"""Sustituye los RSA por versiones con titulares específicos de cada grupo
(mantiene 11 de los 15 aprobados y cambia 4 por otros relevantes al tema del grupo)
y pone techo de CPC en Search. Uso: python3 improve_rsa.py [--real]"""
import json, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
VALIDATE = "--real" not in sys.argv
CPC_CEILING = 3_000_000  # 3,00 €

BASE_HEADLINES = [
    "OutThink 2026 · Madrid", "Foro de IA y Regulación", "¿Te afecta el AI Act?",
    "Comprende el AI Act en 1 día", "Con AEPD, OCDE y ONU", "24 Sept · Casa del Lector",
    "Ponencias y talleres de IA", "Regístrate: plazas limitadas", "IA, ciberseguridad, cuántica",
    "Habla con quien regula", "Cumple la normativa de IA", "Foro presencial en Madrid",
    "Evento de IA para empresas", "Agenda de primer nivel", "Networking institucional",
]
DESCRIPTIONS = [
    "Foro presencial con AEPD, OCDE, ONU y Gobierno de España. 24 de septiembre, Madrid.",
    "Entiende el AI Act y sal con un mapa claro de obligaciones. Plazas limitadas.",
    "Ponencias, talleres y networking sobre IA, ciberseguridad y cuántica. Regístrate.",
    "Un solo día para resolver lo que ningún informe resuelve. Casa del Lector, Madrid.",
]
# Titulares genéricos que se retiran en cada grupo para dejar hueco a los específicos
DROP = ["Networking institucional", "Agenda de primer nivel",
        "Ponencias y talleres de IA", "IA, ciberseguridad, cuántica"]

SPECIFIC = {
    "200661841858": ["AI Act para empresas", "Reglamento europeo de IA",
                     "Obligaciones del AI Act", "¿Cumples ya el AI Act?"],
    "197433188617": ["Riesgos de la IA en tu empresa", "Protección de datos e IA",
                     "Compliance de IA en España", "Gobernanza de IA aplicada"],
    "199171526786": ["Congreso de IA en Madrid", "Foro de IA · 24 septiembre",
                     "Evento IA Madrid 2026", "Jornada de IA para empresas"],
    "203250685081": ["OutThink for AI · Adigital", "OutThink: foro de IA",
                     "OutThink 2026 · Registro", "OutThink · Casa del Lector"],
}
UTM = {"200661841858": "AIACT", "197433188617": "COMPLIANCE",
       "199171526786": "EVENTOS", "203250685081": "MARCA"}

for ag, hs in SPECIFIC.items():
    for h in hs:
        assert len(h) <= 30, f"{h!r} tiene {len(h)} caracteres"

d = urllib.parse.urlencode({"client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
    "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=d)) as r:
    TOK = json.load(r)["access_token"]
H = {"Authorization": f"Bearer {TOK}", "developer-token": CREDS["developer_token"],
     "Content-Type": "application/json"}

req = urllib.request.Request(
    f"https://googleads.googleapis.com/v25/customers/{CID}/googleAds:search",
    data=json.dumps({"query":
        "SELECT ad_group.id, ad_group_ad.resource_name FROM ad_group_ad "
        "WHERE campaign.id = 24182552133 AND ad_group_ad.status != 'REMOVED'"}).encode(), headers=H)
with urllib.request.urlopen(req) as r:
    old = {x["adGroup"]["id"]: x["adGroupAd"]["resourceName"] for x in json.load(r)["results"]}

kept = [h for h in BASE_HEADLINES if h not in DROP]
ops = []
for ag, specific in SPECIFIC.items():
    heads = kept + specific
    assert len(heads) == 15, len(heads)
    ops.append({"adGroupAdOperation": {"create": {
        "adGroup": f"customers/{CID}/adGroups/{ag}", "status": "ENABLED",
        "ad": {"finalUrls": [f"https://rai.outthink.es/?utm_source=google&utm_medium=cpc"
                             f"&utm_campaign=OT26_Search&utm_content=OT26_RSA_{UTM[ag]}"],
               "responsiveSearchAd": {"headlines": [{"text": h} for h in heads],
                                      "descriptions": [{"text": x} for x in DESCRIPTIONS]}}}}})
    if ag in old:
        ops.append({"adGroupAdOperation": {"remove": old[ag]}})

ops.append({"campaignOperation": {"updateMask": "target_spend.cpc_bid_ceiling_micros", "update": {
    "resourceName": f"customers/{CID}/campaigns/24182552133",
    "targetSpend": {"cpcBidCeilingMicros": str(CPC_CEILING)}}}})

req = urllib.request.Request(
    f"https://googleads.googleapis.com/v25/customers/{CID}/googleAds:mutate",
    data=json.dumps({"mutateOperations": ops, "validateOnly": VALIDATE}).encode(), headers=H)
print(f"{len(ops)} operaciones ({'VALIDATE' if VALIDATE else 'REAL'})")
try:
    with urllib.request.urlopen(req) as r: json.load(r)
except urllib.error.HTTPError as e:
    print("ERROR", e.read().decode()[:2500]); raise SystemExit(1)
print("OK")
