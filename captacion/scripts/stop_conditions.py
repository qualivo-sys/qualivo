#!/usr/bin/env python3
"""Stop Conditions V1 · detecta contactos que NO deberian estar recibiendo prospeccion.

El requisito es el del rol del Orchestrator: que dos agentes no puedan contactar al
mismo prospecto ignorando lo que paso en otro canal. Hoy no hay bus de eventos, asi
que esto deriva el estado por sondeo: cruza el estado comercial de GoHighLevel con
los leads vivos de Smartlead y saca las infracciones.

Reglas, de mas grave a menos:
  BLOQUEO_GLOBAL   baja o peticion RGPD        -> no puede recibir nada, por ningun canal
  CLIENTE          trato ganado                -> bloqueo comercial completo
  NEGOCIACION      oportunidad abierta avanzada-> parar adquisicion, pasar a comercial
  REUNION          cita agendada o celebrada   -> parar email, LinkedIn y llamada de prospeccion
  POSITIVA         respondio con interes       -> parar secuencia automatica

Solo lee y reporta. Pausar es una accion aparte y deliberada: ver --pausar.

Uso:
    python3 stop_conditions.py <smartlead_key> <ghl_key> <ghl_loc> [--pausar]
"""
import json
import subprocess
import sys
import time

UA = "Mozilla/5.0"
SL = "https://server.smartlead.ai/api/v1"
GHL = "https://services.leadconnectorhq.com"

# Etiquetas de GHL que disparan cada regla. Orden = gravedad.
REGLAS = [
    ("BLOQUEO_GLOBAL", {"act-baja", "baja", "rgpd", "no-contactar", "unsubscribe"}),
    ("CLIENTE",        {"cliente", "ganado", "won"}),
    ("NEGOCIACION",    {"propuesta-enviada", "segunda-reunion", "oferta-1000",
                        "oferta-800", "oferta-octubre"}),
    ("REUNION",        {"reunion-reservada.", "reunion-reservada", "act-agendado",
                        "act-cita-confirmada", "reunion-celebrada", "reunion"}),
    ("POSITIVA",       {"respondio", "act-respondio", "pidio-llamada", "pidio-precio",
                        "merece-respuesta", "respuesta-real"}),
]
# Estados de Smartlead en los que un lead TODAVIA puede recibir correo.
VIVOS = {"STARTED", "INPROGRESS"}


def curl(args):
    r = subprocess.run(["curl", "-s"] + args, capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return None


def gh(k):
    return ["-H", f"Authorization: Bearer {k}", "-H", "Version: 2021-07-28",
            "-H", "Accept: application/json"]


def contactos_ghl(k, loc):
    """Todos los contactos, con sus etiquetas normalizadas."""
    out, page = [], 1
    while page <= 20:
        d = curl(gh(k) + [f"{GHL}/contacts/?locationId={loc}&limit=100&page={page}"])
        cs = (d or {}).get("contacts") or []
        if not cs:
            break
        out += cs
        page += 1
        time.sleep(0.15)
    return out


def regla_de(tags):
    for nombre, disparo in REGLAS:
        if tags & disparo:
            return nombre
    return None


def leads_vivos_smartlead(k):
    """Devuelve {email: [(campaign_id, campaign_name, status, lead_id)]} de campanas ACTIVAS."""
    camps = curl(["-A", UA, f"{SL}/campaigns?api_key={k}"])
    camps = camps if isinstance(camps, list) else (camps or {}).get("data", [])
    activas = [c for c in camps if c.get("status") == "ACTIVE"]
    vivos = {}
    for c in activas:
        off = 0
        while True:
            L = curl(["-A", UA, f"{SL}/campaigns/{c['id']}/leads?api_key={k}&offset={off}&limit=100"])
            filas = (L or {}).get("data") or []
            if not filas:
                break
            for x in filas:
                ld = x.get("lead") or {}
                e = (ld.get("email") or "").lower().strip()
                if e and x.get("status") in VIVOS:
                    vivos.setdefault(e, []).append(
                        (c["id"], c.get("name", ""), x.get("status"), ld.get("id")))
            off += 100
            if off > 2000:
                break
        time.sleep(0.1)
    return vivos, len(activas)


def pausar(k, cid, lid):
    r = subprocess.run(["curl", "-s", "-X", "POST", "-A", UA,
                        f"{SL}/campaigns/{cid}/leads/{lid}/pause?api_key={k}",
                        "-H", "Content-Type: application/json", "-d", "{}"],
                       capture_output=True, text=True)
    return '"ok":true' in r.stdout


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        return 2
    sk, gk, loc = sys.argv[1], sys.argv[2], sys.argv[3]
    hacer = "--pausar" in sys.argv

    cs = contactos_ghl(gk, loc)
    print(f"contactos en GHL: {len(cs)}", file=sys.stderr)
    estado = {}
    for c in cs:
        e = (c.get("email") or "").lower().strip()
        if not e:
            continue
        tags = {str(t).lower().strip() for t in (c.get("tags") or [])}
        r = regla_de(tags)
        if r:
            estado[e] = (r, c.get("firstName", ""), c.get("companyName", ""))
    print(f"contactos con estado que exige parar: {len(estado)}", file=sys.stderr)

    vivos, n_act = leads_vivos_smartlead(sk)
    print(f"campanas activas: {n_act} | leads vivos en ellas: {len(vivos)}", file=sys.stderr)

    infracciones = []
    for e, (regla, nombre, empresa) in estado.items():
        for cid, cnom, st, lid in vivos.get(e, []):
            infracciones.append((regla, e, nombre, empresa, cnom, st, cid, lid))

    orden = {n: i for i, (n, _) in enumerate(REGLAS)}
    infracciones.sort(key=lambda x: orden[x[0]])

    print()
    if not infracciones:
        print("SIN INFRACCIONES: ningun contacto con estado comercial esta recibiendo prospeccion.")
        return 0

    print(f"INFRACCIONES: {len(infracciones)}")
    print(f"{'regla':16} {'quien':38} {'campana activa':34} {'estado':11}")
    print("-" * 104)
    for regla, e, nombre, empresa, cnom, st, cid, lid in infracciones:
        quien = f"{nombre} {empresa}".strip()[:36] or e[:36]
        print(f"{regla:16} {quien:38} {cnom[:33]:34} {st:11}")
        print(f"{'':16} {e[:60]}")

    if hacer:
        print("\n--- PAUSANDO ---")
        ok = 0
        for regla, e, nombre, empresa, cnom, st, cid, lid in infracciones:
            if lid and pausar(sk, cid, lid):
                ok += 1
                print(f"  pausado: {e} en {cnom[:40]}")
            else:
                print(f"  FALLO:   {e} en {cnom[:40]}")
            time.sleep(0.15)
        print(f"\npausados {ok} de {len(infracciones)}")
    else:
        print("\nEn seco. Para pausarlos de verdad: --pausar")
    return 1


if __name__ == "__main__":
    sys.exit(main())
