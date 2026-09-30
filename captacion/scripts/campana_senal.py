#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Crea una campana por senal (un CRM, una plataforma de anuncios...) con la misma
# arquitectura que el motor V3: los tres pasos son variables por lead, asi que el
# copy viaja con el lead y la secuencia no se toca nunca mas.
#
# Por que una campana por senal y no una sola: para poder leer por separado si
# Salesforce responde mejor que Pipedrive o que Google Ads. Con todo junto esa
# lectura no existe.
#
# Regla de oro de agosto: el POST de secuencia SOLO se hace sobre una campana
# recien creada y vacia. Nunca sobre una que ya tiene leads dentro.
#
# Uso: python3 campana_senal.py <API_KEY> <nombre> <leads.json> <tope_diario>
import json, sys, time, urllib.request, urllib.error

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
BASE = "https://server.smartlead.ai/api/v1"

PASOS = [
    (1, 0, "{{subject1}}", "{{body1}}{{signature}}"),
    (2, 3, "",             "{{body2}}{{signature}}"),
    (3, 7, "",             "{{body3}}{{signature}}"),
]
BAJA = "Si no quieres recibir mas correos mios, responde BAJA y te saco al momento."


def api(metodo, ruta, key, cuerpo=None):
    url = f"{BASE}{ruta}{'&' if '?' in ruta else '?'}api_key={key}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, headers=UA, method=metodo)
    for intento in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                txt = r.read().decode()
                try:
                    return json.loads(txt)
                except ValueError:
                    return {"raw": txt}          # algunos endpoints devuelven texto plano
        except urllib.error.HTTPError as e:
            cuerpo_err = e.read().decode()[:300]
            if e.code < 500 or intento == 3:
                raise SystemExit(f"{metodo} {ruta} -> {e.code} {cuerpo_err}")
        except Exception:
            if intento == 3:
                raise
        time.sleep(2 * (intento + 1))


def main():
    key, nombre, fichero, tope = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
    leads = json.load(open(fichero, encoding="utf-8"))

    cuentas = [c["id"] for c in api("GET", "/email-accounts/?offset=0&limit=100", key)]

    cid = api("POST", "/campaigns/create", key, {"name": nombre})["id"]
    print(f"campana creada: {cid} · {nombre}")

    api("POST", f"/campaigns/{cid}/sequences", key, {"sequences": [
        {"seq_number": n, "seq_delay_details": {"delayInDays": d},
         "seq_variants": [{"subject": s, "email_body": b, "variant_label": "A"}]}
        for n, d, s, b in PASOS]})
    print("  secuencia cargada (tres pasos por variables)")

    api("POST", f"/campaigns/{cid}/email-accounts", key,
        {"email_account_ids": cuentas})
    print(f"  {len(cuentas)} buzones enganchados")

    api("POST", f"/campaigns/{cid}/schedule", key, {
        "timezone": "Europe/Madrid", "days_of_the_week": [1, 2, 3, 4, 5],
        "start_hour": "09:00", "end_hour": "17:00",
        "min_time_btw_emails": 12, "max_new_leads_per_day": tope,
        "schedule_start_time": None})

    api("POST", f"/campaigns/{cid}/settings", key, {
        "track_settings": ["DONT_EMAIL_OPEN"], "send_as_plain_text": True,
        "stop_lead_settings": "REPLY_TO_AN_EMAIL", "follow_up_percentage": 100,
        "unsubscribe_text": BAJA})
    print(f"  horario 9-17 L-V, tope {tope}/dia, sin pixel de apertura")

    for i in range(0, len(leads), 100):
        lote = leads[i:i + 100]
        api("POST", f"/campaigns/{cid}/leads", key,
            {"lead_list": lote,
             "settings": {"ignore_global_block_list": False,
                          "ignore_unsubscribe_list": False,
                          "ignore_duplicate_leads_in_other_campaign": False}})
        print(f"  lote {i // 100 + 1}: {len(lote)} leads")

    api("POST", f"/campaigns/{cid}/status", key, {"status": "START"})
    print(f"  ACTIVA con {len(leads)} leads")
    print(cid)


if __name__ == "__main__":
    main()
