#!/usr/bin/env python3
"""Crea la campaña de prueba Performance Max "OT26_PMax_Test" (decisión de Maikel, 02-09).

Presupuesto: el de Remarketing (16,67 €/día), que no puede servir por falta de audiencia.
Puja: Maximizar conversiones sin CPA objetivo. Sin expansión de URL final, sin
automatizaciones generativas (texto, vídeo, imagen). Exclusión de marca vía negativas
de campaña. Un solo grupo de recursos con las creatividades P/C validadas, señal de
audiencia ComplianceLegal y temas de búsqueda del brief.

Uso:  GADS_CREDS_FILE=... python3 create_pmax.py [--validate]
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

VALIDATE = "--validate" in sys.argv
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
API = f"https://googleads.googleapis.com/v25/customers/{CID}"
A = f"customers/{CID}/assets/"
LANDING = "https://rai.outthink.es/"
FINAL_URL = f"{LANDING}?utm_source=google&utm_medium=cpc&utm_campaign=OT26_PMax&utm_content=OT26_PMax_AIAct"
START = "2026-09-02 00:00:00"
END = "2026-09-24 23:59:59"
BUDGET_MICROS = 16_670_000  # 16,67 €/día (el de Remarketing)

HEADLINES = [  # ≤30
    "Comprende el AI Act en 1 día", "Cumple la normativa de IA", "OutThink 2026 · Madrid",
    "Foro de IA y Regulación", "Con AEPD, OCDE y ONU", "Evento de IA para empresas",
    "Regístrate: plazas limitadas", "¿Te afecta el AI Act?", "24 de septiembre, Madrid",
]
LONG_HEADLINES = [  # ≤90
    "¿Está tu empresa lista para el AI Act? Resuélvelo el 24 de septiembre en Madrid",
    "Pregunta cara a cara a la AEPD y la OCDE en OutThink 2026",
    "El foro de quienes regulan la IA: AEPD, OCDE, ONU y Gobierno de España",
    "Comprende el AI Act en 1 día y sal con un mapa claro de obligaciones",
]
DESCRIPTIONS = [  # ≤90, la primera ≤60
    "Evento de IA y regulación. 24 sept, Madrid. Regístrate.",
    "Foro presencial con AEPD, OCDE, ONU y Gobierno de España. 24 de septiembre, Madrid.",
    "Entiende el AI Act y sal con un mapa claro de obligaciones. Plazas limitadas.",
    "Ponencias, talleres y networking sobre IA, ciberseguridad y cuántica. Regístrate.",
]
BUSINESS_NAME = "OutThink · Adigital"
IMAGES = {
    "MARKETING_IMAGE": ["414230885994", "414052177265", "414160603999", "414160610968", "414160566832"],
    "SQUARE_MARKETING_IMAGE": ["414160615579", "414052177274", "414053453444", "414052178954", "414160603171"],
    "PORTRAIT_MARKETING_IMAGE": ["414052180397", "414160636711", "414160603159", "414052178963"],
}
LOGO = A + "414160637704"  # Brand Guidelines activo por defecto: nombre y logo van como CampaignAsset

AUDIENCE_SIGNAL = f"customers/{CID}/audiences/357704225"  # OT26_AUD_ComplianceLegal
SEARCH_THEMES = [
    "AI Act", "reglamento europeo inteligencia artificial", "regulación inteligencia artificial empresas",
    "compliance inteligencia artificial", "evento inteligencia artificial madrid", "congreso ia madrid 2026",
    "gobernanza de la ia", "AEPD inteligencia artificial", "normativa ia empresas", "foro inteligencia artificial",
]
NEGATIVES = ["outthink", "out think", "adigital"]  # exclusión de marca: que no se coma a Search/Marca
OPT_OUT = ["FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION", "TEXT_ASSET_AUTOMATION",
           "GENERATE_ENHANCED_YOUTUBE_VIDEOS", "GENERATE_IMAGE_ENHANCEMENT",
           "GENERATE_IMAGE_EXTRACTION", "GENERATE_DESIGN_VERSIONS_FOR_IMAGES"]
# (los demás tipos de automatización no son admitidos a nivel de campaña PMax en v25)

for h in HEADLINES: assert len(h) <= 30, h
for h in LONG_HEADLINES: assert len(h) <= 90, h
for d in DESCRIPTIONS: assert len(d) <= 90, d
assert len(DESCRIPTIONS[0]) <= 60


def token():
    data = urllib.parse.urlencode({
        "client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
        "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data)) as r:
        return json.load(r)["access_token"]


HDRS = {"Authorization": f"Bearer {token()}", "developer-token": CREDS["developer_token"],
        "Content-Type": "application/json"}


def mutate(ops):
    body = {"mutateOperations": ops, "validateOnly": VALIDATE, "partialFailure": False}
    req = urllib.request.Request(f"{API}/googleAds:mutate", data=json.dumps(body).encode(), headers=HDRS)
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print("ERROR", e.read().decode()[:4000]); raise SystemExit(1)


tmp = iter(range(-1, -10000, -1))
def t(kind): return f"customers/{CID}/{kind}/{next(tmp)}"

BUDGET, CAMP, AG = t("campaignBudgets"), t("campaigns"), t("assetGroups")
ops = [
    {"campaignBudgetOperation": {"create": {"resourceName": BUDGET, "name": "OT26_PMax_Test_Budget",
        "amountMicros": str(BUDGET_MICROS), "deliveryMethod": "STANDARD", "explicitlyShared": False}}},
    {"campaignOperation": {"create": {
        "resourceName": CAMP, "name": "OT26_PMax_Test", "status": "ENABLED",
        "advertisingChannelType": "PERFORMANCE_MAX", "campaignBudget": BUDGET,
        "maximizeConversions": {},
        "startDateTime": START, "endDateTime": END,
        "containsEuPoliticalAdvertising": "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
        "geoTargetTypeSetting": {"positiveGeoTargetType": "PRESENCE"},
        "assetAutomationSettings": [{"assetAutomationType": k, "assetAutomationStatus": "OPTED_OUT"} for k in OPT_OUT],
    }}},
    {"campaignCriterionOperation": {"create": {"campaign": CAMP, "location": {"geoTargetConstant": "geoTargetConstants/20282"}}}},
    {"campaignCriterionOperation": {"create": {"campaign": CAMP, "language": {"languageConstant": "languageConstants/1003"}}}},
]
ops += [{"campaignCriterionOperation": {"create": {"campaign": CAMP, "negative": True,
         "keyword": {"text": k, "matchType": "PHRASE"}}}} for k in NEGATIVES]

ops.append({"assetGroupOperation": {"create": {"resourceName": AG, "campaign": CAMP, "name": "OT26_AG_AIAct",
            "finalUrls": [FINAL_URL], "path1": "ai-act", "path2": "madrid", "status": "ENABLED"}}})

def text_assets(texts, field):
    for txt in texts:
        rn = t("assets")
        ops.append({"assetOperation": {"create": {"resourceName": rn, "textAsset": {"text": txt}}}})
        ops.append({"assetGroupAssetOperation": {"create": {"assetGroup": AG, "asset": rn, "fieldType": field}}})

# Titulares y descripciones deben existir ANTES del mutate principal: la API valida el
# grupo de recursos de forma incremental y no acepta assets temporales para estos dos tipos.
def create_text_assets(texts):
    body = {"operations": [{"create": {"textAsset": {"text": x}}} for x in texts]}
    req = urllib.request.Request(f"{API}/assets:mutate", data=json.dumps(body).encode(), headers=HDRS)
    try:
        with urllib.request.urlopen(req) as r:
            return [x["resourceName"] for x in json.load(r)["results"]]
    except urllib.error.HTTPError as e:
        print("ERROR assets", e.read().decode()[:2000]); raise SystemExit(1)

pre = create_text_assets(HEADLINES + DESCRIPTIONS)
H_RN, D_RN = pre[:len(HEADLINES)], pre[len(HEADLINES):]
print(f"assets de texto creados: {len(pre)}")
for rn in H_RN:
    ops.append({"assetGroupAssetOperation": {"create": {"assetGroup": AG, "asset": rn, "fieldType": "HEADLINE"}}})
for rn in D_RN:
    ops.append({"assetGroupAssetOperation": {"create": {"assetGroup": AG, "asset": rn, "fieldType": "DESCRIPTION"}}})
text_assets(LONG_HEADLINES, "LONG_HEADLINE")
BN = t("assets")
ops.append({"assetOperation": {"create": {"resourceName": BN, "textAsset": {"text": BUSINESS_NAME}}}})
ops.append({"campaignAssetOperation": {"create": {"campaign": CAMP, "asset": BN, "fieldType": "BUSINESS_NAME"}}})
ops.append({"campaignAssetOperation": {"create": {"campaign": CAMP, "asset": LOGO, "fieldType": "LOGO"}}})
for field, ids in IMAGES.items():
    for i in ids:
        ops.append({"assetGroupAssetOperation": {"create": {"assetGroup": AG, "asset": A + i, "fieldType": field}}})

ops.append({"assetGroupSignalOperation": {"create": {"assetGroup": AG, "audience": {"audience": AUDIENCE_SIGNAL}}}})
ops += [{"assetGroupSignalOperation": {"create": {"assetGroup": AG, "searchTheme": {"text": s}}}} for s in SEARCH_THEMES]

print(f"{len(ops)} operaciones · validateOnly={VALIDATE}")
res = mutate(ops)
if VALIDATE:
    print("VALIDACIÓN OK"); raise SystemExit(0)
out = {}
for r in res.get("mutateOperationResponses", []):
    for k, v in r.items():
        out.setdefault(k, []).append(v.get("resourceName"))
for k, v in out.items():
    print(k, v[:3], "..." if len(v) > 3 else "", f"({len(v)})")
Path(os.environ.get("PMAX_OUT", "pmax_result.json")).write_text(json.dumps(out, indent=1))
