#!/usr/bin/env python3
"""Ajustes del día 3 (02-09), aprobados por Maikel:
  1. Search: ajuste de puja −40 % en móvil.
  2. Search: programación de anuncios con −50 % de 22:00 a 07:00 (todos los días).
     Al añadir programación hay que cubrir las 24 h o la campaña deja de servir fuera
     de las franjas: 07–22 h al 100 %, 22–24 h y 00–07 h al 50 %.
  3. Presupuestos: DG Prospecting 41,67 → 31,67 €/día · Search 25 → 35 €/día.
  4. DG Prospecting: URL final de los anuncios directa al formulario de registro
     (espacio.adigital.org/evento/outthink-2026/) para eliminar el doble salto en móvil.
Uso: GADS_CREDS_FILE=... python3 ajuste_dia3.py [--validate]
"""
import json, os, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

VALIDATE = "--validate" in sys.argv
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
API = f"https://googleads.googleapis.com/v25/customers/{CID}"
SEARCH = f"customers/{CID}/campaigns/24182552133"
DG = "24188461112"
SEARCH_BUDGET = f"customers/{CID}/campaignBudgets/15834387511"
REGISTRO = "https://espacio.adigital.org/evento/outthink-2026/"


def token():
    data = urllib.parse.urlencode({"client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
                                   "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data)) as r:
        return json.load(r)["access_token"]


HDRS = {"Authorization": f"Bearer {token()}", "developer-token": CREDS["developer_token"], "Content-Type": "application/json"}


def call(path, body):
    req = urllib.request.Request(f"{API}/{path}", data=json.dumps(body).encode(), headers=HDRS)
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print("ERROR", path, e.read().decode()[:3000]); raise SystemExit(1)


def search(q):
    return call("googleAds:search", {"query": q}).get("results", [])


ops = []
# 1. Móvil −40 % (el criterio de dispositivo ya existe en la campaña)
ops.append({"campaignCriterionOperation": {"update": {"resourceName": f"{SEARCH.replace('campaigns', 'campaignCriteria')}~30001",
            "bidModifier": 0.6}, "updateMask": "bidModifier"}})
# 2. Programación: 24 h cubiertas, noche al 50 %
for day in ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]:
    for (h0, h1, mod) in [(0, 7, 0.5), (7, 22, 1.0), (22, 24, 0.5)]:
        ops.append({"campaignCriterionOperation": {"create": {"campaign": SEARCH, "bidModifier": mod,
                    "adSchedule": {"dayOfWeek": day, "startHour": h0, "startMinute": "ZERO", "endHour": h1, "endMinute": "ZERO"}}}})
# 3. Presupuestos
dg_budget = search(f"SELECT campaign_budget.resource_name, campaign_budget.amount_micros FROM campaign WHERE campaign.id = {DG}")[0]["campaignBudget"]
print("DG budget actual:", dg_budget)
ops.append({"campaignBudgetOperation": {"update": {"resourceName": dg_budget["resourceName"], "amountMicros": "31670000"}, "updateMask": "amountMicros"}})
ops.append({"campaignBudgetOperation": {"update": {"resourceName": SEARCH_BUDGET, "amountMicros": "35000000"}, "updateMask": "amountMicros"}})
# 4. URLs finales de DG al formulario
ads = search(f"SELECT ad_group_ad.ad.resource_name, ad_group_ad.ad.final_urls, ad_group.name FROM ad_group_ad WHERE campaign.id = {DG} AND ad_group_ad.status != 'REMOVED'")
for a in ads:
    old = a["adGroupAd"]["ad"]["finalUrls"][0]
    qs = old.split("?", 1)[1] if "?" in old else ""
    new = f"{REGISTRO}?{qs}" if qs else REGISTRO
    print(f"  {a['adGroup']['name']}: {old}\n     -> {new}")
    ops.append({"adOperation": {"update": {"resourceName": a["adGroupAd"]["ad"]["resourceName"], "finalUrls": [new]}, "updateMask": "finalUrls"}})

print(f"{len(ops)} operaciones · validateOnly={VALIDATE}")
res = call("googleAds:mutate", {"mutateOperations": ops, "validateOnly": VALIDATE})
print("OK" if VALIDATE else f"aplicadas {len(res.get('mutateOperationResponses', []))}")
