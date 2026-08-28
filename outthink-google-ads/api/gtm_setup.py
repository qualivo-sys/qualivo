#!/usr/bin/env python3
"""Prepara la medición de OutThink 2026 en el contenedor de espacio.adigital.org.

Crea un workspace aparte (NO publica nada) con:
  - Activador "Envío de formulario — Registro OutThink" filtrado a la URL del evento
  - Etiqueta de conversión de Google Ads AW-18413667658 / JmwmCPumtekcEMqKqcxE
  - Etiqueta "Vinculador de conversiones" con vinculación entre dominios

Revisión y publicación quedan del lado de Adigital.
"""
import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path(__file__).parent
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CONT = "accounts/318940788/containers/204427292"
API = "https://tagmanager.googleapis.com/tagmanager/v2"
WS_NAME = "OutThink 2026 — Qualivo (pendiente de revisión)"

CONVERSION_ID = "18413667658"
CONVERSION_LABEL = "JmwmCPumtekcEMqKqcxE"
DOMAINS = "rai.outthink.es, espacio.adigital.org, outthink.es"
URL_MATCH = "outthink-2026"

TRIGGER_ALL_PAGES = "2147479553"
TRIGGER_INITIALIZATION = "2147479573"


def token():
    data = urllib.parse.urlencode({
        "client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
        "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(
        urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    ) as r:
        return json.load(r)["access_token"]


TOK = token()


def call(method, url, payload=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={"Authorization": f"Bearer {TOK}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print(f"ERROR {method} {url}\n{e.read().decode()[:1500]}")
        raise SystemExit(1)


# --- 1. Workspace propio (no toca el Default Workspace donde trabaja Adigital) ---
existing = call("GET", f"{API}/{CONT}/workspaces").get("workspace", [])
ws = next((w for w in existing if w["name"] == WS_NAME), None)
if ws:
    print("Workspace ya existente, lo reutilizo:", ws["path"])
else:
    ws = call("POST", f"{API}/{CONT}/workspaces",
              {"name": WS_NAME,
               "description": "Medicion de registros OutThink 2026 (Google Ads). "
                              "Preparado por Qualivo para revision y publicacion por Adigital."})
    print("Workspace creado:", ws["path"])
WS = ws["path"]

# --- 2. Activador de envío de formulario, acotado a la página del evento ---
triggers = call("GET", f"{API}/{WS}/triggers").get("trigger", [])
TRG_NAME = "Envío de formulario — Registro OutThink"
trg = next((t for t in triggers if t["name"] == TRG_NAME), None)
if not trg:
    trg = call("POST", f"{API}/{WS}/triggers", {
        "name": TRG_NAME,
        "type": "formSubmission",
        "waitForTags": {"type": "boolean", "key": "waitForTags", "value": "false"},
        "checkValidation": {"type": "boolean", "key": "checkValidation", "value": "false"},
        "filter": [{
            "type": "contains",
            "parameter": [
                {"type": "template", "key": "arg0", "value": "{{Page URL}}"},
                {"type": "template", "key": "arg1", "value": URL_MATCH},
            ],
        }],
    })
    print("Activador creado:", trg["name"], "id", trg["triggerId"])
else:
    print("Activador ya existente:", trg["triggerId"])

# --- 3. Etiqueta de conversión de Google Ads ---
tags = call("GET", f"{API}/{WS}/tags").get("tag", [])
TAG_CONV = "Google Ads — Conversión Registro OutThink 2026"
if not any(t["name"] == TAG_CONV for t in tags):
    t = call("POST", f"{API}/{WS}/tags", {
        "name": TAG_CONV,
        "type": "awct",
        "firingTriggerId": [trg["triggerId"]],
        "parameter": [
            {"type": "template", "key": "conversionId", "value": CONVERSION_ID},
            {"type": "template", "key": "conversionLabel", "value": CONVERSION_LABEL},
            {"type": "boolean", "key": "enableConversionLinker", "value": "true"},
            {"type": "template", "key": "conversionCookiePrefix", "value": "_gcl"},
        ],
    })
    print("Etiqueta de conversión creada:", t["tagId"])
else:
    print("Etiqueta de conversión ya existente")

# --- 4. Vinculador de conversiones (falta en el contenedor) ---
TAG_LINKER = "Vinculador de conversiones — dominios OutThink"
if not any(t["name"] == TAG_LINKER for t in tags):
    t = call("POST", f"{API}/{WS}/tags", {
        "name": TAG_LINKER,
        "type": "gclidw",
        "firingTriggerId": [TRIGGER_INITIALIZATION],
        "parameter": [
            {"type": "boolean", "key": "enableCrossDomain", "value": "true"},
            {"type": "template", "key": "linkerDomains", "value": DOMAINS},
            {"type": "boolean", "key": "enableUrlPassthrough", "value": "true"},
        ],
    })
    print("Vinculador creado:", t["tagId"])
else:
    print("Vinculador ya existente")

# --- 5. Verificación ---
print("\n=== CONTENIDO DEL WORKSPACE ===")
for t in call("GET", f"{API}/{WS}/tags").get("tag", []):
    p = {x["key"]: x.get("value") for x in t.get("parameter", []) if "value" in x}
    print(f"  TAG {t['name']} · type={t['type']} · triggers={t.get('firingTriggerId')}")
    for k in ("conversionId", "conversionLabel", "linkerDomains", "enableCrossDomain"):
        if k in p:
            print(f"        {k} = {p[k]}")
for t in call("GET", f"{API}/{WS}/triggers").get("trigger", []):
    print(f"  TRIGGER [{t['triggerId']}] {t['name']} · {t['type']}")
    for f in t.get("filter", []) or []:
        vals = [x.get("value") for x in f.get("parameter", [])]
        print(f"        filtro {f['type']}: {vals}")

st = call("GET", f"{API}/{WS}/status")
print("\nCambios pendientes de publicar en este workspace:",
      len(st.get("workspaceChange", [])))
print("SIN PUBLICAR — la publicación queda del lado de Adigital.")
