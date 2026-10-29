#!/usr/bin/env python3
"""Monta las etapas v2 de Alpha en el Zoho CRM de PRUEBAS.

Por defecto solo lee y enseña el plan (qué etapas y campos faltan).
Con --aplicar crea los campos y añade las etapas que faltan.
Las reglas de validación y las reglas de flujo (tareas) se montan a mano:
los pasos están en alpha/2026-10-29-etapas-v2-zoho-pruebas.md.

Se niega a trabajar contra un dominio que no sea de sandbox.

Uso:
  export ZOHO_API_BASE=https://sandbox.zohoapis.eu   # sandbox de la cuenta EU
  export ZOHO_TOKEN=<access token del usuario de API de pruebas>
  python3 alpha/zoho/aplicar_etapas_v2.py            # plan
  python3 alpha/zoho/aplicar_etapas_v2.py --aplicar  # crea campos y etapas
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

CONFIG = Path(__file__).with_name("etapas_v2.json")

TIPOS_ZOHO = {
    "text": "text",
    "textarea": "textarea",
    "date": "date",
    "currency": "currency",
    "integer": "integer",
    "boolean": "boolean",
    "picklist": "picklist",
    "fileupload": "fileupload",
    "imageupload": "imageupload",
}


def api(base, token, method, path, body=None, fatal=True):
    req = urllib.request.Request(
        f"{base}/crm/v8{path}",
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Zoho-oauthtoken {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="replace")
        if "INACTIVE" in detalle.upper() or "inactive" in detalle:
            sys.exit("El usuario de API de pruebas sigue inactivo. Lo tiene que reactivar Alpha.")
        if fatal:
            sys.exit(f"{method} {path} -> {e.code}: {detalle[:500]}")
        return {"_error": f"{e.code}: {detalle[:300]}"}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--aplicar", action="store_true", help="crear campos y etapas (si no, solo plan)")
    args = p.parse_args()

    base = os.environ.get("ZOHO_API_BASE", "").rstrip("/")
    token = os.environ.get("ZOHO_TOKEN", "")
    if "sandbox" not in base:
        sys.exit("ZOHO_API_BASE tiene que ser un dominio de sandbox (p. ej. https://sandbox.zohoapis.eu). No se toca el Zoho real.")
    if not token:
        sys.exit("Falta ZOHO_TOKEN.")

    cfg = json.loads(CONFIG.read_text())
    modulo = cfg["modulo"]

    campos = api(base, token, "GET", f"/settings/fields?module={modulo}")["fields"]
    por_etiqueta = {f["field_label"].strip().lower(): f for f in campos}

    stage = next(f for f in campos if f["api_name"] == "Stage")
    etapas_actuales = {v["display_value"].strip().lower() for v in stage.get("pick_list_values", [])}

    faltan_etapas = [e for e in cfg["etapas"] + cfg["estados_de_salida"] if e["nombre"].lower() not in etapas_actuales]
    faltan_campos = [c for c in cfg["campos"] if c["etiqueta"].lower() not in por_etiqueta]

    print(f"Etapas actuales en Zoho de pruebas: {sorted(etapas_actuales)}")
    print(f"Etapas que faltan ({len(faltan_etapas)}): {[e['nombre'] for e in faltan_etapas]}")
    print(f"Campos que faltan ({len(faltan_campos)}): {[c['etiqueta'] for c in faltan_campos]}")
    for ya in cfg["_campos_que_ya_existen_en_pruebas"]:
        base_label = ya.lower()
        print(f"  comprobación «{ya}»: {'está' if base_label in por_etiqueta else 'NO ESTÁ'}")

    if not args.aplicar:
        print("\nSolo plan. Repite con --aplicar para crear.")
        return

    for c in faltan_campos:
        campo = {"field_label": c["etiqueta"], "data_type": TIPOS_ZOHO[c["tipo"]]}
        if c["tipo"] == "picklist":
            campo["pick_list_values"] = [{"display_value": v, "actual_value": v} for v in c["valores"]]
        if c["tipo"] == "currency":
            campo["currency"] = {"rounding_option": "normal", "precision": 2}
        if c["tipo"] in ("text",):
            campo["length"] = 255
        if c["tipo"] == "textarea":
            campo["textarea"] = {"type": "small"}  # las reglas de validación no admiten "large"
        r = api(base, token, "POST", f"/settings/fields?module={modulo}", {"fields": [campo]}, fatal=False)
        print(f"campo «{c['etiqueta']}»: {r.get('_error') or r.get('fields', [{}])[0].get('status', r)}")

    if faltan_etapas:
        # Zoho pide la categoría de cada etapa: se copia de una etapa existente del mismo tipo
        modelo = {}
        for v in stage.get("pick_list_values", []):
            modelo.setdefault(v.get("forecast_type"), v)
        ultimo = max(v.get("sequence_number", 0) for v in stage.get("pick_list_values", []))
        valores = stage.get("pick_list_values", []) + [
            {"display_value": e["nombre"], "actual_value": e["nombre"], "probability": e["probabilidad"],
             "forecast_type": e["tipo"], "deal_category": modelo[e["tipo"]]["deal_category"],
             "forecast_category": {"id": modelo[e["tipo"]]["forecast_category"]["id"]},
             "sequence_number": ultimo + i}
            for i, e in enumerate(faltan_etapas, start=1)
        ]
        r = api(base, token, "PATCH", f"/settings/fields/{stage['id']}?module={modulo}",
                {"fields": [{"pick_list_values": valores}]})
        print(f"etapas: {r}")

    print("\nHecho. Falta: orden de etapas en el pipeline, reglas de validación y reglas de flujo (a mano, ver el .md).")


if __name__ == "__main__":
    main()
