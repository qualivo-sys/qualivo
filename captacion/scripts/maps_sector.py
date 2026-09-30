# -*- coding: utf-8 -*-
# Saca empresas de Google Maps para las campanas de sector.
#
# Por que Maps y no Apollo: el 18-sep comprobe que el pozo de Apollo para las
# puertas de CRM esta casi seco (285 empresas espanolas con Zoho, 287 con
# Pipedrive, y ya habiamos consumido buena parte). Maps no tiene ese techo y
# sale a unos 40 centimos por cada 80 fichas. Obra salio de ahi.
#
# Lo que NO hace: no inventa correos. Maps da web y telefono; el correo se saca
# despues de la web con correos_web.py. Si no hay web, el lead no sirve para
# correo y se queda para la lista de llamadas.
import json, os, sys, time, urllib.request

S = os.path.dirname(os.path.abspath(__file__))
TOKEN = open(os.path.join(S, ".apify_key")).read().strip()
ACTOR = "compass~crawler-google-places"

# Cada busqueda es un termino + una ciudad. Se separan a proposito: mezclarlas
# en una sola llamada hace que el actor reparta mal el cupo y una ciudad se
# coma a la otra.
BUSQUEDAS = {
    "clinicas": ["clínica dental", "clínica estética", "clínica fisioterapia"],
    "asesorias": ["asesoría fiscal y laboral", "gestoría empresas"],
}
CIUDADES = ["Barcelona, Spain", "Madrid, Spain"]
POR_BUSQUEDA = 40


def corre(termino, ciudad, maximo):
    cuerpo = {
        "searchStringsArray": [termino],
        "locationQuery": ciudad,
        "maxCrawledPlacesPerSearch": maximo,
        "language": "es",
        "skipClosedPlaces": True,
        "scrapePlaceDetailPage": False,
    }
    url = (f"https://api.apify.com/v2/acts/{ACTOR}/run-sync-get-dataset-items"
           f"?token={TOKEN}")
    req = urllib.request.Request(url, data=json.dumps(cuerpo).encode(),
                                 headers={"Content-Type": "application/json"},
                                 method="POST")
    with urllib.request.urlopen(req, timeout=900) as f:
        return json.loads(f.read().decode())


if __name__ == "__main__":
    solo = sys.argv[1] if len(sys.argv) > 1 else None
    todo = []
    for sector, terminos in BUSQUEDAS.items():
        if solo and sector != solo:
            continue
        for ciudad in CIUDADES:
            for t in terminos:
                try:
                    r = corre(t, ciudad, POR_BUSQUEDA)
                except Exception as e:
                    print(f"  [FALLO] {sector} · {t} · {ciudad}: {e}")
                    continue
                for x in r:
                    x["_sector"] = sector
                    x["_ciudad"] = ciudad.split(",")[0]
                    x["_termino"] = t
                todo.extend(r)
                print(f"  {sector:10} {ciudad.split(',')[0]:10} {t:28} {len(r):4}")
                time.sleep(2)
    destino = os.path.join(S, f"maps_sector_{solo or 'todo'}.json")
    json.dump(todo, open(destino, "w"), ensure_ascii=False)
    print(f"\n{len(todo)} fichas -> {destino}")
