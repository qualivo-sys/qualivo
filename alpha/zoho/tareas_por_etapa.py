#!/usr/bin/env python3
"""Crea en el Zoho de PRUEBAS las tareas de cada etapa (flujo v2 de Alpha).

Una acción «Tarea» por cada tarea de etapas_v2.json y una sola regla de flujo,
«Qualivo · tareas por etapa», que salta cuando cambia la Fase y crea las tareas
de la etapa nueva. Las tareas se asignan al propietario del trato.

Por defecto solo enseña el plan. Con --aplicar lo crea. Si la regla ya existe, no hace nada.
Se niega a trabajar contra un dominio que no sea de sandbox.

  export ZOHO_API_BASE=https://sandbox.zohoapis.eu ZOHO_TOKEN=...
  python3 alpha/zoho/tareas_por_etapa.py [--aplicar]
"""
import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from aplicar_etapas_v2 import api  # noqa: E402

NOMBRE_REGLA = "Qualivo · tareas por etapa"
CONFIG = Path(__file__).with_name("etapas_v2.json")
# tareas que vencen en la fecha de un campo del trato, no en la del cambio de fase
CAMPO_FECHA = {"Fecha de recontacto": "Fecha_Recontacto", "Fecha de Inicio de Campaña": "Fecha_de_Inicio_de_Campa_a"}


def mapeos(asunto, dias, campo_fecha, f_tarea):
    disparo = f"${{!Deals.{campo_fecha}}}" if campo_fecha else "${CURRENTTIME}"
    return [
        {"field": {"api_name": "Subject", "id": f_tarea["Subject"]}, "type": "static", "value": asunto},
        {"field": {"api_name": "Due_Date", "id": f_tarea["Due_Date"]}, "type": "execution_time",
         "value": {"period": "days", "unit": str(dias), "trigger_field": disparo, "sign": "plus"}},
        {"field": {"api_name": "Status", "id": f_tarea["Status"]}, "type": "static", "value": "Not Started"},
        {"field": {"api_name": "Priority", "id": f_tarea["Priority"]}, "type": "static", "value": "High"},
    ]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--aplicar", action="store_true")
    args = p.parse_args()
    base = os.environ.get("ZOHO_API_BASE", "").rstrip("/")
    token = os.environ.get("ZOHO_TOKEN", "")
    if "sandbox" not in base or not token:
        sys.exit("Hace falta ZOHO_API_BASE de sandbox y ZOHO_TOKEN. No se toca el Zoho real.")

    cfg = json.loads(CONFIG.read_text())
    reglas = api(base, token, "GET", "/settings/automation/workflow_rules?module=Deals").get("workflow_rules", [])
    if any(r["name"] == NOMBRE_REGLA for r in reglas):
        print(f"La regla «{NOMBRE_REGLA}» ya existe. No se hace nada.")
        return

    campos = api(base, token, "GET", "/settings/fields?module=Deals")["fields"]
    stage_id = next(f["id"] for f in campos if f["api_name"] == "Stage")
    modulo_id = next(m["id"] for m in api(base, token, "GET", "/settings/modules")["modules"] if m["api_name"] == "Deals")
    f_tarea = {f["api_name"]: f["id"] for f in api(base, token, "GET", "/settings/fields?module=Tasks")["fields"]}

    plan = []
    for etapa in cfg["tareas_por_etapa"]:
        for t in etapa["tareas"]:
            campo = CAMPO_FECHA.get(t.get("vence_en"))
            plan.append((etapa["al_entrar_en"], t["asunto"], t.get("vence_en_dias", 0), campo))
    for e, a, d, c in plan:
        print(f"{e:28} → {a} (vence {'en ' + c if c else f'+{d} días'})")
    if not args.aplicar:
        print("\nSolo plan. Repite con --aplicar para crear.")
        return

    existentes = {f"Qualivo · {t['name']}"[:50]: t["id"] for t in api(base, token, "GET", "/settings/automation/tasks?module=Deals").get("tasks", [])}
    acciones_por_etapa = {}
    for e, a, d, c in plan:
        nombre = f"Qualivo · {a}"[:50]
        if nombre in existentes:
            acciones_por_etapa.setdefault(e, []).append({"id": existentes[nombre], "type": "tasks"})
            print(f"acción ya existía: {a}")
            continue
        r = api(base, token, "POST", "/settings/automation/tasks",
                {"tasks": [{"name": f"Qualivo · {a}"[:50], "module": {"api_name": "Deals", "id": modulo_id}, "notify": False,
                            "field_mappings": mapeos(a, d, c, f_tarea)}]}, fatal=False)
        res = (r.get("tasks") or [{}])[0]
        if res.get("status") != "success":
            sys.exit(f"tarea «{a}»: {r.get('_error') or res}")
        acciones_por_etapa.setdefault(e, []).append({"id": res["details"]["id"], "type": "tasks"})
        print(f"acción creada: {a}")

    condiciones = [
        {"sequence_number": i, "instant_actions": {"actions": acc},
         "criteria_details": {"criteria": {"comparator": "equal", "field": {"api_name": "Stage", "id": stage_id},
                                           "type": "value", "value": e}}}
        for i, (e, acc) in enumerate(acciones_por_etapa.items(), start=1)
    ]
    regla = {"name": NOMBRE_REGLA, "module": {"api_name": "Deals", "id": modulo_id},
             "description": "Flujo comercial v2 (Sergi, 26-oct). Montado por Qualivo en pruebas.",
             "execute_when": {"type": "field_update", "details": {
                 "criteria": {"comparator": "${ANYVALUE}", "field": {"api_name": "Stage", "id": stage_id}, "value": "${ANYVALUE}"},
                 "repeat": True, "match_all": False}},
             "conditions": condiciones}
    r = api(base, token, "POST", "/settings/automation/workflow_rules", {"workflow_rules": [regla]}, fatal=False)
    print(json.dumps(r, ensure_ascii=False)[:600])


if __name__ == "__main__":
    main()
