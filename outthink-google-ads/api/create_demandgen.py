#!/usr/bin/env python3
"""Crea las campañas Demand Gen de OutThink 2026 EN PAUSA (mutate atómico).

- OT26_DemandGen_Prospecting (1.000 € / 24 días): ad groups A (Compliance/Legal)
  y B (Dirección/Innovación) con segmentos personalizados y anuncios por concepto.
- OT26_DemandGen_Remarketing (400 € / 24 días): listas de visitantes/registro iniciado.

Fuera de alcance (decisión 28-ago): ad group C "Similar a registrados" (sin customer
match ni creatividades P4*), carrusel (2/5 tarjetas), conceptos C1/C3/R4.

Uso: python3 create_demandgen.py [--real]
"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
ASSETS = json.loads((BASE / "asset_map.json").read_text())
AUD = json.loads((BASE / "audience_map.json").read_text())
CID = "9188115388"
API = "v25"
LANDING = "https://rai.outthink.es/"
VALIDATE_ONLY = "--real" not in sys.argv


def tok():
    data = urllib.parse.urlencode({
        "client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
        "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data)) as r:
        return json.load(r)["access_token"]


def rn(kind, i):
    return f"customers/{CID}/{kind}/{i}"


H_A = [
    "¿Está tu empresa lista para el AI Act?",
    "Comprende el AI Act en 1 día",
    "Multas de hasta el 7%: ¿te afecta?",
    "Pregunta cara a cara a la AEPD y la OCDE",
    "Cumple la normativa de IA",
]
H_B = [
    "El foro de quienes regulan la IA",
    "IA, ciberseguridad, cuántica",
    "Evento de IA para empresas",
    "OutThink 2026 · Madrid",
    "Agenda de primer nivel",
]
H_RMK = [
    "OutThink 2026 · Madrid",
    "24 Sept · Casa del Lector",
    "Regístrate: plazas limitadas",
    "Foro de IA y Regulación",
    "Con AEPD, OCDE y ONU",
]
D_A = [
    "Qué sistemas usas, cuáles regula el AI Act y qué te exige. Resuélvelo el 24 sept.",
    "Entiende el AI Act y sal con un mapa claro de obligaciones. Plazas limitadas.",
    "Foro presencial con AEPD, OCDE, ONU y Gobierno de España. 24 de septiembre, Madrid.",
]
D_B = [
    "Criterios y casos reales de las empresas que van por delante. Foro presencial, Madrid.",
    "Ponencias, talleres y networking sobre IA, ciberseguridad y cuántica. Regístrate.",
    "González Veracruz, Cotino y García Robles en el mismo foro. Un solo día, Madrid.",
]
D_RMK = [
    "Un solo día para resolver lo que ningún informe resuelve. Casa del Lector, Madrid.",
    "Foro presencial con AEPD, OCDE, ONU y Gobierno de España. 24 de septiembre, Madrid.",
    "Entiende el AI Act y sal con un mapa claro de obligaciones. Plazas limitadas.",
]
for h in H_A + H_B + H_RMK:
    assert len(h) <= 40, f"Titular >40: {h!r} ({len(h)})"
for d in D_A + D_B + D_RMK:
    assert len(d) <= 90, f"Descripción >90: {d!r} ({len(d)})"


def dg_ad(adgroup_rn, concept, utm_campaign, headlines, descriptions, ratios=("HZ", "SQ", "VT")):
    ad = {
        "name": f"OT26_{concept}",
        "finalUrls": [f"{LANDING}?utm_source=google&utm_medium=cpc&utm_campaign={utm_campaign}&utm_content=OT26_{concept}"],
        "demandGenMultiAssetAd": {
            "businessName": "OutThink",
            "logoImages": [{"asset": ASSETS["OT26_Logo"]}],
            "headlines": [{"text": h} for h in headlines],
            "descriptions": [{"text": d} for d in descriptions],
        },
    }
    maa = ad["demandGenMultiAssetAd"]
    if "HZ" in ratios:
        maa["marketingImages"] = [{"asset": ASSETS[f"OT26_{concept}_HZ"]}]
    if "SQ" in ratios:
        maa["squareMarketingImages"] = [{"asset": ASSETS[f"OT26_{concept}_SQ"]}]
    if "VT" in ratios:
        maa["portraitMarketingImages"] = [{"asset": ASSETS[f"OT26_{concept}_VT"]}]
    return {"adGroupAdOperation": {"create": {"adGroup": adgroup_rn, "status": "ENABLED", "ad": ad}}}


def adgroup_targeting(adgroup_rn, audience_rn):
    return [
        {"adGroupCriterionOperation": {"create": {
            "adGroup": adgroup_rn, "location": {"geoTargetConstant": "geoTargetConstants/20282"}}}},
        {"adGroupCriterionOperation": {"create": {
            "adGroup": adgroup_rn, "language": {"languageConstant": "languageConstants/1003"}}}},
        {"adGroupCriterionOperation": {"create": {
            "adGroup": adgroup_rn, "status": "ENABLED",
            "audience": {"audience": audience_rn}}}},
    ]


ops = []

# ---------- Campaña 2: Demand Gen Prospecting ----------
ops.append({"campaignBudgetOperation": {"create": {
    "resourceName": rn("campaignBudgets", -1), "name": "OT26_DG_Prospecting_Budget",
    "amountMicros": "41670000", "deliveryMethod": "STANDARD", "explicitlyShared": False}}})
ops.append({"campaignOperation": {"create": {
    "resourceName": rn("campaigns", -3),
    "name": "OT26_DemandGen_Prospecting",
    "status": "PAUSED",
    "advertisingChannelType": "DEMAND_GEN",
    "campaignBudget": rn("campaignBudgets", -1),
    "targetSpend": {},
    "startDateTime": "2026-08-31 00:00:00",
    "endDateTime": "2026-09-24 23:59:59",
    "containsEuPoliticalAdvertising": "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
}}})

# Ad group A — Compliance y Legal (ICP 3)
ops.append({"adGroupOperation": {"create": {
    "resourceName": rn("adGroups", -5), "name": "OT26_DG_A_ComplianceLegal",
    "campaign": rn("campaigns", -3), "status": "ENABLED"}}})
ops += adgroup_targeting(rn("adGroups", -5), AUD["OT26_AUD_ComplianceLegal"])
for concept in ["P1", "P2", "R3", "R5"]:
    ops.append(dg_ad(rn("adGroups", -5), concept, "OT26_DG_Prospecting", H_A, D_A))

# Ad group B — Dirección e Innovación (ICP 1–2)
ops.append({"adGroupOperation": {"create": {
    "resourceName": rn("adGroups", -6), "name": "OT26_DG_B_DireccionInnovacion",
    "campaign": rn("campaigns", -3), "status": "ENABLED"}}})
ops += adgroup_targeting(rn("adGroups", -6), AUD["OT26_AUD_DireccionInnovacion"])
for concept in ["P3", "P5", "R7"]:
    ops.append(dg_ad(rn("adGroups", -6), concept, "OT26_DG_Prospecting", H_B, D_B))

# ---------- Campaña 3: Demand Gen Remarketing ----------
ops.append({"campaignBudgetOperation": {"create": {
    "resourceName": rn("campaignBudgets", -2), "name": "OT26_DG_Remarketing_Budget",
    "amountMicros": "16670000", "deliveryMethod": "STANDARD", "explicitlyShared": False}}})
ops.append({"campaignOperation": {"create": {
    "resourceName": rn("campaigns", -4),
    "name": "OT26_DemandGen_Remarketing",
    "status": "PAUSED",
    "advertisingChannelType": "DEMAND_GEN",
    "campaignBudget": rn("campaignBudgets", -2),
    "targetSpend": {},
    "startDateTime": "2026-08-31 00:00:00",
    "endDateTime": "2026-09-24 23:59:59",
    "containsEuPoliticalAdvertising": "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
}}})

ops.append({"adGroupOperation": {"create": {
    "resourceName": rn("adGroups", -7), "name": "OT26_DG_RMK_Interesados",
    "campaign": rn("campaigns", -4), "status": "ENABLED"}}})
ops += adgroup_targeting(rn("adGroups", -7), AUD["OT26_AUD_Interesados_RMK"])
for concept, ratios in [("R1", ("HZ", "SQ", "VT")), ("R6", ("HZ", "SQ", "VT")),
                        ("C4", ("SQ",)), ("C5", ("SQ", "VT"))]:
    ops.append(dg_ad(rn("adGroups", -7), concept, "OT26_DG_Remarketing", H_RMK, D_RMK, ratios))

payload = {"mutateOperations": ops, "validateOnly": VALIDATE_ONLY}
req = urllib.request.Request(
    f"https://googleads.googleapis.com/{API}/customers/{CID}/googleAds:mutate",
    data=json.dumps(payload).encode(),
    headers={"Authorization": f"Bearer {tok()}", "developer-token": CREDS["developer_token"],
             "Content-Type": "application/json"})
mode = "VALIDATE_ONLY" if VALIDATE_ONLY else "REAL"
print(f"Enviando {len(ops)} operaciones ({mode})...")
try:
    with urllib.request.urlopen(req) as resp:
        body = json.load(resp)
except urllib.error.HTTPError as e:
    print("ERROR", e.code)
    print(e.read().decode()[:6000])
    raise SystemExit(1)

if VALIDATE_ONLY:
    print("VALIDACIÓN OK — sin errores. Ejecuta con --real para crear.")
else:
    results = body.get("mutateOperationResponses", [])
    print(f"CREADO OK — {len(results)} recursos:")
    for r in results:
        for v in r.values():
            print("  ", v.get("resourceName"))
