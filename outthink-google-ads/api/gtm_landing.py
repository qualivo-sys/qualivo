#!/usr/bin/env python3
"""Monta en el contenedor de la landing (rai.outthink.es, GTM-WC7PTQTB):
   - Vinculador de conversiones con vinculación entre dominios
   - Etiqueta de remarketing de Google Ads (alimenta las listas propias)
Ambas replican el gating de consentimiento que ya usa su etiqueta de GA4.
Trabaja en un workspace aparte y NO publica.
"""
import json, urllib.error, urllib.parse, urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CONT = (BASE/"landing_container.txt").read_text().strip()
API = "https://tagmanager.googleapis.com/tagmanager/v2"
WS_NAME = "OutThink 2026 — Qualivo"
DOMAINS = "rai.outthink.es, espacio.adigital.org, outthink.es"
CONVERSION_ID = "18413667658"
TRIGGER_CONSENT = "10"   # "Cookie Consent Update", el mismo que usa su GA4

d = urllib.parse.urlencode({"client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
    "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=d)) as r:
    TOK = json.load(r)["access_token"]

def call(method, url, payload=None):
    req = urllib.request.Request(url,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={"Authorization": f"Bearer {TOK}", "Content-Type": "application/json"}, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print(f"ERROR {method}\n{e.read().decode()[:1200]}"); raise SystemExit(1)

ws = next((w for w in call("GET", f"{API}/{CONT}/workspaces").get("workspace", [])
           if w["name"] == WS_NAME), None)
if not ws:
    ws = call("POST", f"{API}/{CONT}/workspaces", {"name": WS_NAME,
        "description": "Vinculacion entre dominios y remarketing para OutThink 2026 (Qualivo)."})
WS = ws["path"]
print("Workspace:", WS)

tags = {t["name"] for t in call("GET", f"{API}/{WS}/tags").get("tag", [])}

if "Vinculador de conversiones — dominios OutThink" not in tags:
    t = call("POST", f"{API}/{WS}/tags", {
        "name": "Vinculador de conversiones — dominios OutThink",
        "type": "gclidw",
        "firingTriggerId": [TRIGGER_CONSENT],
        "parameter": [
            {"type": "boolean", "key": "enableCrossDomain", "value": "true"},
            {"type": "template", "key": "linkerDomains", "value": DOMAINS},
            {"type": "boolean", "key": "enableUrlPassthrough", "value": "true"},
        ]})
    print("Vinculador creado:", t["tagId"])

if "Google Ads — Remarketing OutThink" not in tags:
    t = call("POST", f"{API}/{WS}/tags", {
        "name": "Google Ads — Remarketing OutThink",
        "type": "sp",
        "firingTriggerId": [TRIGGER_CONSENT],
        "parameter": [
            {"type": "template", "key": "conversionId", "value": CONVERSION_ID},
            {"type": "boolean", "key": "enableConversionLinker", "value": "true"},
            {"type": "template", "key": "customParamsFormat", "value": "NONE"},
            {"type": "template", "key": "conversionCookiePrefix", "value": "_gcl"},
        ]})
    print("Remarketing creado:", t["tagId"])

print("\n=== WORKSPACE ===")
for t in call("GET", f"{API}/{WS}/tags").get("tag", []):
    p = {x["key"]: x.get("value") for x in t.get("parameter", []) if "value" in x}
    print(f"  · {t['name']} [{t['type']}] triggers={t.get('firingTriggerId')}")
    for k in ("linkerDomains", "enableCrossDomain", "conversionId", "tagId"):
        if k in p: print(f"       {k} = {p[k]}")
qp = call("POST", f"{API}/{WS}:quick_preview", {})
print("\ncompilerError:", qp.get("compilerError", False))
print("cambios pendientes:", len(call("GET", f"{API}/{WS}/status").get("workspaceChange", [])))
