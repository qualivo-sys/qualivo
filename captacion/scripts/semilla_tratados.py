#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Siembra el estado del triaje tras un reinicio del contenedor.

EL PROBLEMA QUE RESUELVE
El barrido de respuestas decide que algo es "nuevo" porque no aparece en
tratados.json ni en hilos_clasificados.json. Esos dos ficheros viven en el
scratchpad, que es de la sesion: cuando el contenedor se reinicia, desaparecen.
El 7-oct-2026 pasó: el scratchpad se vació con 156 correos ya tratados dentro.
Sin sembrar el estado, el siguiente barrido los reporta todos como nuevos y
sepulta los que de verdad lo son.

QUE HACE
Marca como ya tratada toda respuesta cuyo reply_time sea ANTERIOR a hoy, y deja
sin marcar las de hoy, que son las que hay que mirar de verdad. Es deliberado
que el corte sea por fecha y no por contenido: una respuesta de ayer o antes ya
pasó por un barrido, y si no pasó, está en el informe del dia correspondiente.

NO sustituye al estado perdido: lo aproxima por el lado seguro. Puede marcar
como tratada alguna de ayer que quedara sin tratar. Por eso imprime cuantas
marca y de que fechas, para que se pueda revisar el ultimo informe diario.

USO
    python3 semilla_tratados.py <smartlead_key> <dir_scratchpad> [--aplicar]

Sin --aplicar solo cuenta y muestra. Con --aplicar escribe tratados.json.
"""
import datetime
import json
import os
import subprocess
import sys

API = "https://server.smartlead.ai/api/v1"
UA = ["-H", "User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]


def get(key, path):
    sep = "&" if "?" in path else "?"
    r = subprocess.run(["curl", "-s", *UA, f"{API}{path}{sep}api_key={key}"],
                       capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return None


def respuestas(key):
    """Todas las respuestas de todas las campanas, con su fecha."""
    out = []
    camps = get(key, "/campaigns") or []
    if not isinstance(camps, list):
        print("no pude leer las campanas; revisa la clave", file=sys.stderr)
        return out
    for c in camps:
        off = 0
        while off <= 3000:
            st = get(key, f"/campaigns/{c['id']}/statistics?offset={off}&limit=500") or {}
            filas = st.get("data") or []
            if not filas:
                break
            for f in filas:
                if f.get("reply_time") and f.get("lead_email"):
                    out.append((f["lead_email"], str(f["reply_time"])[:10], c.get("name", "")))
            off += 500
    return out


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    key, sp = sys.argv[1], sys.argv[2]
    aplicar = "--aplicar" in sys.argv
    hoy = datetime.date.today().isoformat()

    todas = respuestas(key)
    if not todas:
        print("cero respuestas leidas: o no hay, o la clave no vale. No siembro nada.")
        return 1

    previas = sorted({e for e, f, _ in todas if f < hoy})
    de_hoy = sorted({e for e, f, _ in todas if f == hoy})
    fechas = sorted({f for _, f, _ in todas if f < hoy})

    print(f"respuestas totales leidas: {len(todas)}")
    print(f"correos distintos con respuesta anterior a hoy: {len(previas)}")
    print(f"correos con respuesta de HOY (se dejan SIN marcar): {len(de_hoy)}")
    if fechas:
        print(f"rango de las previas: {fechas[0]} a {fechas[-1]}")
    for e in de_hoy:
        print(f"   de hoy, a revisar: {e}")

    destino = os.path.join(sp, "tratados.json")
    if not aplicar:
        print(f"\nen seco. Con --aplicar escribiria {len(previas)} correos en {destino}")
        return 0

    ya = []
    if os.path.exists(destino):
        try:
            ya = json.load(open(destino))
            if not isinstance(ya, list):
                ya = []
        except Exception:
            ya = []
    antes = len(ya)
    for e in previas:
        if e not in ya:
            ya.append(e)
    os.makedirs(sp, exist_ok=True)
    json.dump(ya, open(destino, "w"), ensure_ascii=False, indent=1)
    print(f"\n{destino}: {antes} -> {len(ya)}")
    print("las de hoy quedan sin marcar a proposito: son las que el barrido debe sacar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
