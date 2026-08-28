#!/usr/bin/env python3
"""Prueba de acceso (SOLO LECTURA) a la cuenta de OutThink vía Google Ads API.

Lista las campañas de la cuenta del cliente. Si responde, el acceso está OK
y podemos crear las campañas por API.

Variables de entorno necesarias:
  GADS_DEVELOPER_TOKEN   token del Centro de API del MCC (nivel Básico+)
  GADS_CLIENT_ID         OAuth client id
  GADS_CLIENT_SECRET     OAuth client secret
  GADS_REFRESH_TOKEN     el generado con get_refresh_token.py
  GADS_LOGIN_CUSTOMER_ID (opcional) ID del MCC SIN guiones — solo si el
                         acceso es vía vínculo MCC; si es invitación directa
                         a info@, dejar sin definir.

Uso:  python3 test_access.py
"""
import json
import os
import sys
import urllib.parse
import urllib.request

API_VERSION = "v21"  # si devuelve 404, probar con la versión estable actual
CUSTOMER_ID = "9188115388"  # OutThink / Adigital (918-811-5388)


def get_access_token() -> str:
    data = urllib.parse.urlencode(
        {
            "client_id": os.environ["GADS_CLIENT_ID"],
            "client_secret": os.environ["GADS_CLIENT_SECRET"],
            "refresh_token": os.environ["GADS_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        }
    ).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)["access_token"]


def main() -> None:
    headers = {
        "Authorization": f"Bearer {get_access_token()}",
        "developer-token": os.environ["GADS_DEVELOPER_TOKEN"],
        "Content-Type": "application/json",
    }
    login_cid = os.environ.get("GADS_LOGIN_CUSTOMER_ID")
    if login_cid:
        headers["login-customer-id"] = login_cid

    query = (
        "SELECT campaign.id, campaign.name, campaign.status, "
        "campaign_budget.amount_micros FROM campaign ORDER BY campaign.id"
    )
    url = (
        f"https://googleads.googleapis.com/{API_VERSION}/"
        f"customers/{CUSTOMER_ID}/googleAds:search"
    )
    req = urllib.request.Request(
        url, data=json.dumps({"query": query}).encode(), headers=headers
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as e:
        print(f"ERROR {e.code}: {e.read().decode()}")
        sys.exit(1)

    results = body.get("results", [])
    print(f"Acceso OK a la cuenta {CUSTOMER_ID}. Campañas: {len(results)}")
    for r in results:
        c = r["campaign"]
        budget = int(r.get("campaignBudget", {}).get("amountMicros", 0)) / 1_000_000
        print(f"  [{c['id']}] {c['name']} · {c['status']} · {budget:.2f} €/día")


if __name__ == "__main__":
    main()
