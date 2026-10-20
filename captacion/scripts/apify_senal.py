#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Convierte un negocio de Google Maps en un lead con señal.
#
# Por que: las cuatro campanas que salieron de Google Maps son las cuatro
# peores que tenemos (Clinicas 0,61%, Solar 0,83%, Inmobiliarias 0,85%,
# Construccion 1,07%), todas por debajo de la media de 1,53%. Las de senal van
# entre 2% y 7,5%. La diferencia no es el copy: Maps te da el nombre del negocio
# y un info@, y con eso el email solo puede empezar en "hola". No hay senal.
#
# Lo que hace esto: Maps encuentra el negocio, y despues se mira su web para
# detectar QUE tiene montado (pixel de Meta, Google Ads, que CRM, cuantos
# formularios). Eso convierte un lead de Maps en uno de senal, que es la unica
# variable que hemos visto mover la tasa de respuesta.
#
# Coste: la cuenta es gratuita y estaba en 2,14 $ de 5,00 $. Por eso el script
# pide el numero de sitios por delante y avisa del gasto estimado antes de
# lanzar nada. Con menos de tres dolares no se hacen barridos de miles.
#
# Uso:
#   python3 apify_senal.py buscar "clinica dental" "Barcelona, Spain" 40
#   python3 apify_senal.py senal sitios.json
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error

S = "/tmp/claude-0/-home-user-qualivo/382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad"
RUTA_KEY = os.path.expanduser("~/.outbound/apify_key")
API = "https://api.apify.com/v2"

# Lo que se busca en el HTML de cada web. Cada acierto es una puerta de
# carga_v3.py: asi el lead sale de aqui ya sabiendo que email le toca.
SENALES = [
    ("meta_ads",     r"connect\.facebook\.net|fbq\(\s*['\"]init|facebook\.com/tr\?"),
    ("google_ads",   r"googleads\.g\.doubleclick\.net|gtag/js\?id=AW-|googleadservices"),
    ("linkedin_ads", r"snap\.licdn\.com|_linkedin_partner_id"),
    ("crm:HubSpot",  r"js\.hs-scripts\.com|hs-analytics\.net|hubspot"),
    ("crm:Salesforce", r"salesforce\.com|pardot\.com|force\.com"),
    ("crm:Zoho",     r"zoho\.com|zohopublic"),
    ("crm:Odoo",     r"odoo\.com|/web/static/"),
    ("lista:Brevo",  r"sibautomation\.com|sendinblue"),
    ("lista:Mailchimp", r"list-manage\.com|mailchimp"),
    ("lista:ActiveCampaign", r"prism\.app-us1\.com|activehosted\.com"),
]


def key():
    if not os.path.exists(RUTA_KEY):
        raise SystemExit(
            f"falta el token de Apify en {RUTA_KEY}.\n"
            "El contenedor se recrea en cada sesion, asi que hay que volver a "
            "escribirlo:\n"
            "  mkdir -p ~/.outbound && printf '%s' 'TOKEN' > ~/.outbound/apify_key "
            "&& chmod 600 ~/.outbound/apify_key")
    return open(RUTA_KEY).read().strip()


def pide(metodo, ruta, cuerpo=None, timeout=900):
    url = f"{API}{ruta}{'&' if '?' in ruta else '?'}token={key()}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, method=metodo, headers={
        "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{metodo} {ruta} -> {e.code} {e.read().decode()[:300]}")


def saldo():
    u = pide("GET", "/users/me")
    d = (u or {}).get("data") or {}
    return d.get("plan", {}).get("maxMonthlyUsageUsd"), d.get("username")


def buscar(termino, lugar, tope):
    # ~0,004 $ por sitio en compass/crawler-google-places. Con el presupuesto
    # que queda, cuarenta sitios cuestan centimos y mil no caben.
    print(f"estimado: ~{tope * 0.004:.2f} $ por {tope} sitios")
    r = pide("POST", "/acts/compass~crawler-google-places/run-sync-get-dataset-items",
             {"searchStringsArray": [termino], "locationQuery": lugar,
              "maxCrawledPlacesPerSearch": tope, "language": "es",
              "skipClosedPlaces": True})
    sitios = [{"nombre": x.get("title"), "web": x.get("website"),
               "tel": x.get("phoneUnformatted"), "ciudad": x.get("city"),
               "categoria": x.get("categoryName"),
               "resenas": x.get("reviewsCount"), "nota": x.get("totalScore")}
              for x in (r or []) if x.get("website")]
    d = os.path.join(S, "maps_sitios.json")
    json.dump(sitios, open(d, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(sitios)} sitios con web (de {len(r or [])}) -> {d}")


def senal(fichero):
    """Lee la web de cada sitio y dice que lleva montado.

    Se usa el Web Fetch de Apify y no un curl nuestro porque muchas webs
    devuelven el HTML por JavaScript y bloquean lo que huela a bot."""
    sitios = json.load(open(fichero, encoding="utf-8"))
    print(f"estimado: ~{len(sitios) * 0.002:.2f} $ por {len(sitios)} webs")
    salida = []
    for i, s in enumerate(sitios, 1):
        try:
            r = pide("POST", "/acts/apify~web-fetch/run-sync-get-dataset-items",
                     {"url": s["web"], "outputFormat": "html"}, timeout=180)
        except SystemExit as e:
            print(f"  [{i}] {s['nombre'][:30]}: {e}")
            continue
        html = json.dumps(r)[:400000]
        halladas = [n for n, rx in SENALES if re.search(rx, html, re.I)]
        formularios = len(re.findall(r"<form\b", html, re.I))
        if halladas:
            # la primera senal manda: es la que define la puerta del email
            cual = halladas[0]
            puerta = cual.split(":")[0]
            v = {}
            if ":" in cual:
                v = {"crm" if puerta == "crm" else "herramienta": cual.split(":")[1]}
            salida.append({**s, "senales": halladas, "formularios": formularios,
                           "puerta": puerta, "v": v})
        print(f"  [{i}/{len(sitios)}] {(s['nombre'] or '')[:34]:34} "
              f"{','.join(halladas) or '(ninguna)'}")
        time.sleep(0.3)
    d = os.path.join(S, "maps_con_senal.json")
    json.dump(salida, open(d, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{len(salida)} de {len(sitios)} con señal detectada -> {d}")
    print("Falta el correo: ninguna de las dos pasadas lo da. Ese es el paso "
          "siguiente (contact-info-scraper) y conviene verificarlo antes de cargar.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__ or "ver cabecera")
    if sys.argv[1] == "buscar":
        print("cuenta:", saldo())
        buscar(sys.argv[2], sys.argv[3], int(sys.argv[4]))
    elif sys.argv[1] == "senal":
        senal(sys.argv[2])
    else:
        raise SystemExit("subcomandos: buscar | senal")
