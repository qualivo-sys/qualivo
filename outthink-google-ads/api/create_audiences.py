#!/usr/bin/env python3
"""Crea segmentos personalizados (custom audiences) y listas de remarketing.
Recursos inertes: no gastan ni sirven anuncios hasta asociarse a una campaña activa."""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
API = "v25"


def tok():
    data = urllib.parse.urlencode({
        "client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
        "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data)) as r:
        return json.load(r)["access_token"]


def call(service, payload):
    req = urllib.request.Request(
        f"https://googleads.googleapis.com/{API}/customers/{CID}/{service}:mutate",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {TOKEN}", "developer-token": CREDS["developer_token"],
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        print(f"ERROR en {service}:", e.code, e.read().decode()[:3000])
        sys.exit(1)


TOKEN = tok()
out = {}

# --- Segmentos personalizados (tipo búsqueda) ---
CA = {
    "OT26_CA_ComplianceLegal": [
        "ai act", "ai act empresas", "compliance ia",
        "rgpd inteligencia artificial", "regulación ia", "dpo"],
    "OT26_CA_DireccionInnovacion": [
        "transformación digital", "estrategia ia", "adopción ia empresas"],
}
ops = [{"create": {
    "name": name,
    "type": "SEARCH",
    "status": "ENABLED",
    "members": [{"memberType": "KEYWORD", "keyword": kw} for kw in kws],
}} for name, kws in CA.items()]
res = call("customAudiences", {"operations": ops})
for name, r in zip(CA, res["results"]):
    out[name] = r["resourceName"]
    print(name, "->", r["resourceName"])

# --- Listas de remarketing por URL (se poblarán cuando el tag esté activo) ---
def url_list(name, desc, url_contains):
    return {"create": {
        "name": name,
        "description": desc,
        "membershipLifeSpan": "90",
        "ruleBasedUserList": {
            "prepopulationStatus": "REQUESTED",
            "flexibleRuleUserList": {
                "inclusiveRuleOperator": "AND",
                "inclusiveOperands": [{
                    "rule": {"ruleItemGroups": [{"ruleItems": [{
                        "name": "url__",
                        "stringRuleItem": {"operator": "CONTAINS", "value": url_contains},
                    }]}]},
                }],
                "exclusiveOperands": [],
            },
        },
    }}


ops = [
    url_list("OT26_RL_Visitantes_Web", "Visitantes de rai.outthink.es", "rai.outthink.es"),
    url_list("OT26_RL_Registro_Iniciado", "Llegaron al registro en espacio.adigital.org",
             "espacio.adigital.org/evento/outthink-2026"),
]
res = call("userLists", {"operations": ops})
for name, r in zip(["OT26_RL_Visitantes_Web", "OT26_RL_Registro_Iniciado"], res["results"]):
    out[name] = r["resourceName"]
    print(name, "->", r["resourceName"])

(BASE / "audience_map.json").write_text(json.dumps(out, indent=2))
print("\nGuardado en audience_map.json")
