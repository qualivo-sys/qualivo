#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Limpia la firma que Smartlead guarda en cada buzon.
#
# Que pasaba: los pasos de la secuencia son "{{body1}}{{signature}}", y
# {{signature}} no es nuestra firma de texto: es la que esta configurada en el
# BUZON. La que habia arrastraba dos cosas de una marca anterior:
#
#   1. "Fundador de Qualivo" en verde #1F9E94, cuando la firma acordada dice
#      CEO y el verde de marca es #0E7C74.
#   2. Un enlace "Reserva 15 min conmigo" al calendario
#      api.leadconnectorhq.com/widget/bookings/llamada-hackthelead, que es de
#      HackTheLead, OTRA empresa. Comprobado: el widget carga con su nombre.
#
# O sea, todo correo frio de Qualivo terminaba invitando a reservar en el
# calendario de otra marca. Quien se interesaba pulsaba y aterrizaba en una
# pagina que no era la del remitente, que es exactamente el patron que la gente
# lee como estafa. Con 127 respuestas y 1 reunion, esto no es un detalle.
#
# La firma se deja VACIA a proposito, no se sustituye por otra: el cuerpo que
# genera carga_v3.py ya termina con la firma de texto correcta y con el enlace
# a qualivo.io/llamada. Poner otra aqui duplicaria la firma en cada envio.
#
# Uso: python3 firma_buzones.py <API_KEY> [--aplica]
import json
import sys
import time
import urllib.request
import urllib.error

K = sys.argv[1]
APLICA = "--aplica" in sys.argv
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126",
      "Content-Type": "application/json"}
B = "https://server.smartlead.ai/api/v1"


def api(m, ruta, cuerpo=None):
    url = f"{B}{ruta}{'&' if '?' in ruta else '?'}api_key={K}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, headers=UA, method=m)
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                t = r.read().decode()
                return json.loads(t) if t.strip().startswith(("{", "[")) else {"raw": t}
        except urllib.error.HTTPError as e:
            return {"err": f"{e.code} {e.read().decode()[:200]}"}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(2)


cuentas = api("GET", "/email-accounts/?offset=0&limit=100") or []
tocados = limpios = fallos = 0
for c in cuentas:
    firma = c.get("signature") or ""
    em = c.get("from_email")
    if not firma.strip():
        print(f"  [ya limpio] {em}")
        limpios += 1
        continue
    pistas = [p for p in ("hackthelead", "Fundador", "1F9E94") if p.lower() in firma.lower()]
    print(f"  [{'limpiar' if APLICA else 'seco'}] {em:42} arrastra: {', '.join(pistas) or 'firma propia'}")
    if not APLICA:
        tocados += 1
        continue
    r = api("POST", f"/email-accounts/{c['id']}", {"signature": ""})
    if r.get("err"):
        print(f"      FALLO: {r['err']}")
        fallos += 1
    else:
        tocados += 1

print(f"\n{'[seco] ' if not APLICA else ''}con firma: {tocados} · ya limpios: {limpios} "
      f"· fallos: {fallos}")
if APLICA:
    # No basta con que la API diga ok: se relee y se comprueba.
    mal = [c.get("from_email") for c in (api("GET", "/email-accounts/?offset=0&limit=100") or [])
           if (c.get("signature") or "").strip()]
    print("verificacion: " + ("todos vacios" if not mal else f"SIGUEN CON FIRMA: {mal}"))
    print("\nOJO: esto comprueba el campo GUARDADO, no lo que sale en el correo.\n"
          "El 16-sep las quince firmas salian vacias al releerlas y el siguiente\n"
          "envio seguia llevando el bloque HTML, porque Smartlead compone el\n"
          "cuerpo antes de enviarlo. La comprobacion buena es abrir el\n"
          "message-history de un envio POSTERIOR al cambio y mirar el final del\n"
          "cuerpo SENT:\n"
          "  GET /campaigns/{cid}/leads/{lead_id}/message-history\n"
          "y confirmar que no aparecen ni 'Fundador de' ni '1F9E94'.")
