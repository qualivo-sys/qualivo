#!/usr/bin/env python3
"""Crea la Campaña 1 — Search de OutThink 2026 EN PAUSA (mutate atómico).

Uso:
  python3 create_search.py            -> validate_only (no crea nada)
  python3 create_search.py --real     -> creación real
"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())  # JSON con client_id/client_secret/refresh_token/developer_token
CID = "9188115388"
API = "v25"
LANDING = "https://rai.outthink.es/"
UTM = "utm_source=google&utm_medium=cpc&utm_campaign=OT26_Search&utm_content="

VALIDATE_ONLY = "--real" not in sys.argv


def tok():
    data = urllib.parse.urlencode(
        {
            "client_id": CREDS["client_id"],
            "client_secret": CREDS["client_secret"],
            "refresh_token": CREDS["refresh_token"],
            "grant_type": "refresh_token",
        }
    ).encode()
    with urllib.request.urlopen(
        urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    ) as r:
        return json.load(r)["access_token"]


def rn(kind, i):
    return f"customers/{CID}/{kind}/{i}"


HEADLINES = [
    "OutThink 2026 · Madrid",
    "Foro de IA y Regulación",
    "¿Te afecta el AI Act?",
    "Comprende el AI Act en 1 día",
    "Con AEPD, OCDE y ONU",
    "24 Sept · Casa del Lector",
    "Ponencias y talleres de IA",
    "Regístrate: plazas limitadas",
    "IA, ciberseguridad, cuántica",
    "Habla con quien regula",
    "Cumple la normativa de IA",
    "Foro presencial en Madrid",
    "Evento de IA para empresas",
    "Agenda de primer nivel",
    "Networking institucional",
]
DESCRIPTIONS = [
    "Foro presencial con AEPD, OCDE, ONU y Gobierno de España. 24 de septiembre, Madrid.",
    "Entiende el AI Act y sal con un mapa claro de obligaciones. Plazas limitadas.",
    "Ponencias, talleres y networking sobre IA, ciberseguridad y cuántica. Regístrate.",
    "Un solo día para resolver lo que ningún informe resuelve. Casa del Lector, Madrid.",
]

AD_GROUPS = {
    -3: ("OT26_Search_AIAct", "AIACT", [
        "ai act empresas", "ai act españa", "regulación ia cumplimiento",
        "ai act normativa inteligencia artificial", "gobernanza ia"]),
    -4: ("OT26_Search_ComplianceRiesgo", "COMPLIANCE", [
        "riesgos inteligencia artificial", "compliance ia",
        "protección de datos ia", "regulación tecnológica"]),
    -5: ("OT26_Search_EventosIA", "EVENTOS", [
        "evento inteligencia artificial madrid", "congreso ia madrid",
        "foro inteligencia artificial", "conferencia inteligencia artificial madrid"]),
    -6: ("OT26_Search_Marca", "MARCA", [
        "outthink", "outthink madrid", "outthink adigital", "outthink ai"]),
}

NEGATIVES = ["empleo", "curso", "gratis", "máster", "pdf", "resumen"]

SITELINKS = {  # temp id: (texto, url)
    -7: ("Agenda", "https://rai.outthink.es/agenda"),
    -8: ("Ponentes", "https://rai.outthink.es/speakers"),
    -9: ("Talleres", "https://rai.outthink.es/eventos"),
    -10: ("Registro", "https://espacio.adigital.org/evento/outthink-2026/"),
}
CALLOUTS = {
    -11: "Foro presencial",
    -12: "Un solo día",
    -13: "Ponentes internacionales",
    -14: "Plazas limitadas",
}

ops = []

# Presupuesto: 600 € / 24 días (31 ago–23 sept) = 25 €/día
ops.append({"campaignBudgetOperation": {"create": {
    "resourceName": rn("campaignBudgets", -1),
    "name": "OT26_Search_Budget",
    "amountMicros": "25000000",
    "deliveryMethod": "STANDARD",
    "explicitlyShared": False,
}}})

ops.append({"campaignOperation": {"create": {
    "resourceName": rn("campaigns", -2),
    "name": "OT26_Search",
    "status": "PAUSED",
    "advertisingChannelType": "SEARCH",
    "campaignBudget": rn("campaignBudgets", -1),
    "targetSpend": {},
    "networkSettings": {
        "targetGoogleSearch": True,
        "targetSearchNetwork": False,
        "targetContentNetwork": False,
        "targetPartnerSearchNetwork": False,
    },
    "startDateTime": "2026-08-31 00:00:00",
    "endDateTime": "2026-09-24 23:59:59",
    "containsEuPoliticalAdvertising": "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
}}})

# Geo (Comunidad de Madrid) + idioma español
ops.append({"campaignCriterionOperation": {"create": {
    "campaign": rn("campaigns", -2),
    "location": {"geoTargetConstant": "geoTargetConstants/20282"},
}}})
ops.append({"campaignCriterionOperation": {"create": {
    "campaign": rn("campaigns", -2),
    "language": {"languageConstant": "languageConstants/1003"},
}}})
for neg in NEGATIVES:
    ops.append({"campaignCriterionOperation": {"create": {
        "campaign": rn("campaigns", -2),
        "negative": True,
        "keyword": {"text": neg, "matchType": "BROAD"},
    }}})

for tmp, (name, utm_tag, keywords) in AD_GROUPS.items():
    ops.append({"adGroupOperation": {"create": {
        "resourceName": rn("adGroups", tmp),
        "name": name,
        "campaign": rn("campaigns", -2),
        "type": "SEARCH_STANDARD",
        "status": "ENABLED",
    }}})
    for kw in keywords:
        ops.append({"adGroupCriterionOperation": {"create": {
            "adGroup": rn("adGroups", tmp),
            "status": "ENABLED",
            "keyword": {"text": kw, "matchType": "PHRASE"},
        }}})
    ops.append({"adGroupAdOperation": {"create": {
        "adGroup": rn("adGroups", tmp),
        "status": "ENABLED",
        "ad": {
            "finalUrls": [f"{LANDING}?{UTM}OT26_RSA_{utm_tag}"],
            "responsiveSearchAd": {
                "headlines": [{"text": h} for h in HEADLINES],
                "descriptions": [{"text": d} for d in DESCRIPTIONS],
            },
        },
    }}})

for tmp, (text, url) in SITELINKS.items():
    ops.append({"assetOperation": {"create": {
        "resourceName": rn("assets", tmp),
        "sitelinkAsset": {"linkText": text},
        "finalUrls": [url],
    }}})
    ops.append({"campaignAssetOperation": {"create": {
        "campaign": rn("campaigns", -2),
        "asset": rn("assets", tmp),
        "fieldType": "SITELINK",
    }}})
for tmp, text in CALLOUTS.items():
    ops.append({"assetOperation": {"create": {
        "resourceName": rn("assets", tmp),
        "calloutAsset": {"calloutText": text},
    }}})
    ops.append({"campaignAssetOperation": {"create": {
        "campaign": rn("campaigns", -2),
        "asset": rn("assets", tmp),
        "fieldType": "CALLOUT",
    }}})
ops.append({"assetOperation": {"create": {
    "resourceName": rn("assets", -15),
    "structuredSnippetAsset": {"header": "Tipos", "values": ["Ponencias", "Talleres", "Networking"]},
}}})
ops.append({"campaignAssetOperation": {"create": {
    "campaign": rn("campaigns", -2),
    "asset": rn("assets", -15),
    "fieldType": "STRUCTURED_SNIPPET",
}}})

payload = {"mutateOperations": ops, "validateOnly": VALIDATE_ONLY}
req = urllib.request.Request(
    f"https://googleads.googleapis.com/{API}/customers/{CID}/googleAds:mutate",
    data=json.dumps(payload).encode(),
    headers={
        "Authorization": f"Bearer {tok()}",
        "developer-token": CREDS["developer_token"],
        "Content-Type": "application/json",
    },
)
mode = "VALIDATE_ONLY" if VALIDATE_ONLY else "REAL"
print(f"Enviando {len(ops)} operaciones ({mode})...")
try:
    with urllib.request.urlopen(req) as resp:
        body = json.load(resp)
except urllib.error.HTTPError as e:
    print("ERROR", e.code)
    print(e.read().decode()[:4000])
    raise SystemExit(1)

if VALIDATE_ONLY:
    print("VALIDACIÓN OK — sin errores. Ejecuta con --real para crear.")
else:
    results = body.get("mutateOperationResponses", [])
    print(f"CREADO OK — {len(results)} recursos:")
    for r in results:
        for v in r.values():
            print("  ", v.get("resourceName"))
