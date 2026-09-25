#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Rescata al pipeline activo de GHL los leads del funnel de Meta de febrero.
#
# De donde salen: un export de GHL de la location 430AQyWaTdtG7aRRGfYj, que es
# UNA SUBCUENTA DISTINTA de la que usamos hoy (bHGMuZEGUESZmVoNv9HT). El token
# actual no la alcanza: "The token does not have access to this location". Por
# eso se quedaron parados, no por olvido. Vivian donde nadie los miraba.
#
# Que hace: crea el contacto en la location viva, le abre oportunidad en
# Prospeccion y le deja una TAREA CON FECHA, porque una oportunidad sin fecha
# se vuelve a quedar parada exactamente igual que estos.
#
# La etapa no se copia tal cual. Alguien que estaba en NEGOCIACION en febrero
# no sigue en negociacion siete meses despues: hoy es un contacto frio al que
# hay que volver a abrir. Se mete en "Conversacion abierta" y la nota guarda
# donde se quedo, que es lo que hace util la llamada.
#
# Uso: python3 rescate_funnel.py <funnel.json> [--crea]
import json
import os
import sys
import time
import urllib.request
import urllib.error
import datetime

S = os.path.expanduser(
    "/tmp/claude-0/-home-user-qualivo/382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad")
K = open(os.path.join(S, ".ghl_key")).read().strip()
LOC = open(os.path.join(S, ".ghl_loc")).read().strip()
B = "https://services.leadconnectorhq.com"

PIPELINE = "JaB4LIwUqFn96LLFEhSm"            # Prospeccion
ETAPA = "2f7569b8-d95b-4bfe-8120-0a4d206907ce"  # Conversacion abierta

# Prioridad por lo que decia la nota, no por la etapa que tenian. Un ticket de
# 13.000 a 30.000 con un "no les importa pagar" pesa mas que una etiqueta.
CALIENTES = {"f.sardinero@vortexrenovables.es", "info@peaceofmindvalencia.es",
             "contacto@mujeresencia.es", "jose.alvez@kriontek.com",
             "jestrems@bigpoma.com", "gabrielhernalsteens@hotmail.com"}


def api(metodo, ruta, cuerpo=None, version="2021-07-28"):
    url = f"{B}{ruta}"
    datos = json.dumps(cuerpo).encode() if cuerpo is not None else None
    req = urllib.request.Request(url, data=datos, method=metodo, headers={
        "Authorization": f"Bearer {K}", "Version": version,
        "Content-Type": "application/json", "Accept": "application/json",
        # Cloudflare devuelve 403 al User-Agent por defecto de urllib
        # (Python-urllib/3.11). Con uno de navegador pasa.
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126"})
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            return {"err": f"{e.code} {e.read().decode()[:200]}"}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(2)


def busca(email):
    """Devuelve el id si ya existe, None si no, y levanta si no se pudo mirar.

    La distincion importa: una busqueda que falla devolvia lo mismo que una que
    no encuentra nada, y con eso el script habria creado duplicados de todo el
    funnel sin enterarse."""
    r = api("POST", "/contacts/search", {
        "locationId": LOC, "pageLimit": 5,
        "filters": [{"field": "email", "operator": "eq", "value": email}]})
    if not isinstance(r, dict) or r.get("err"):
        raise SystemExit(f"no se pudo comprobar si {email} ya existe: "
                         f"{(r or {}).get('err')}. Se para para no duplicar.")
    c = r.get("contacts") or []
    return c[0]["id"] if c else None


def main():
    leads = json.load(open(sys.argv[1], encoding="utf-8"))
    crea = "--crea" in sys.argv
    # Las llamadas se reparten: seis calientes hoy, el resto a lo largo de la
    # semana. Veintisiete tareas para el mismo dia no se hacen y lo sabemos.
    hoy = datetime.date.today()
    n_cal = n_frio = 0
    hechos = saltados = fallos = 0

    for l in sorted(leads, key=lambda x: x["email"] not in CALIENTES):
        cal = l["email"] in CALIENTES
        if cal:
            dia = hoy
            n_cal += 1
        else:
            n_frio += 1
            dia = hoy + datetime.timedelta(days=1 + n_frio // 6)
            while dia.weekday() >= 5:              # ni sabado ni domingo
                dia += datetime.timedelta(days=1)

        ya = busca(l["email"])
        if ya:
            print(f"  [ya estaba] {l['email']}")
            saltados += 1
            continue
        if not crea:
            print(f"  [seco] {'CALIENTE ' if cal else '         '}"
                  f"{l['email']:46} llamar {dia}")
            continue

        c = api("POST", "/contacts/", {
            "locationId": LOC, "firstName": l["nombre"], "lastName": l["apellido"],
            "email": l["email"], "phone": l["tel"],
            "companyName": l["empresa"],
            "source": "Funnel Qualivo · Meta ads (feb 2026, rescatado)",
            "tags": ["rescate-funnel-feb"] + (["lead-caliente"] if cal else [])})
        cid = (c.get("contact") or {}).get("id")
        if not cid:
            print(f"  [FALLO contacto] {l['email']}: {str(c)[:110]}")
            fallos += 1
            continue

        nombre_op = (l["empresa"] or f"{l['nombre']} {l['apellido']}").strip()
        api("POST", "/opportunities/", {
            "pipelineId": PIPELINE, "pipelineStageId": ETAPA, "locationId": LOC,
            "contactId": cid, "status": "open",
            "name": f"{nombre_op} · rescate funnel feb"})

        cuerpo = (f"Venia del funnel de Meta, etapa {l['etapa']} en febrero de 2026, "
                  f"en una subcuenta de GHL que ya no miramos.\n\n"
                  f"{l['nota'] or 'Sin notas en el export.'}\n\n"
                  "No es un lead frio: ya hablo contigo. Abrir por donde se quedo.")
        api("POST", f"/contacts/{cid}/notes", {"body": cuerpo, "userId": None})
        api("POST", f"/contacts/{cid}/tasks", {
            "title": ("Llamar (lead caliente del funnel de feb)" if cal
                      else "Retomar lead del funnel de feb"),
            "body": cuerpo[:900],
            "dueDate": f"{dia}T09:00:00Z", "completed": False})
        print(f"  [creado] {'CALIENTE ' if cal else '         '}"
              f"{l['email']:46} llamar {dia}")
        hechos += 1
        time.sleep(0.4)

    if not crea:
        print(f"\n[seco] {len(leads)} leads · {n_cal} calientes hoy · nada creado")
    else:
        print(f"\ncreados {hechos} · ya estaban {saltados} · fallos {fallos}")


if __name__ == "__main__":
    main()
