# -*- coding: utf-8 -*-
# Extraccion de Google Maps para el piloto de Kubysoft: empresas de instalacion
# y reparacion de aire acondicionado en Espana.
#
# Por que Maps y no Apollo, aunque Kubysoft sea software: lo que Kubysoft vende
# es software, pero a quien se lo vende no lo es. Instaladores de clima es oficio
# y negocio local, y ahi Apollo devuelve portales y mayoristas mezclados. Maps da
# empresas reales. Ademas los creditos de Apollo son la bolsa de Qualivo.
#
# Mismo actor y misma forma de llamar que captacion/scripts/maps_sector.py: cada
# busqueda es un termino + una ciudad por separado, porque juntandolas el actor
# reparta mal el cupo y una ciudad se come a la otra.
#
# Los datos salen a clientes/kubysoft/datos/, NO a captacion/scripts/. Los
# scripts se comparten entre clientes, los datos no.
import json, os, sys, time, urllib.request

S = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(os.path.dirname(S), "datos")

# La clave vive en el scratchpad de la sesion, nunca en el repositorio.
# Se puede pasar por APIFY_KEY o por fichero con la ruta en APIFY_KEY_FILE.
def token():
    t = os.environ.get("APIFY_KEY", "").strip()
    if t:
        return t
    p = os.environ.get("APIFY_KEY_FILE", "")
    if p and os.path.exists(p):
        return open(p).read().strip()
    sys.exit("Falta la clave de Apify. Exporta APIFY_KEY o APIFY_KEY_FILE "
             "apuntando al fichero del scratchpad.")

ACTOR = "compass~crawler-google-places"

# Cinco maneras de nombrar lo mismo. "servicio tecnico" y "mantenimiento" son las
# que mas acercan al ICP de Kubysoft, porque implican parque instalado y avisos
# recurrentes, que es justo el dolor que resuelve su ERP. "instalacion" sola trae
# mas obra nueva y mas autonomo.
TERMINOS = [
    "servicio tecnico aire acondicionado",
    "mantenimiento aire acondicionado",
    "reparacion aire acondicionado",
    "instalacion aire acondicionado",
    "empresa climatizacion",
]

# Espana, repartido. No solo Madrid y Barcelona: en clima el negocio esta muy
# vivo en el arco mediterraneo y en el sur, donde la temporada es mas larga.
CIUDADES = [
    "Madrid, Spain",
    "Barcelona, Spain",
    "Valencia, Spain",
    "Sevilla, Spain",
    "Malaga, Spain",
    "Murcia, Spain",
    "Zaragoza, Spain",
    "Alicante, Spain",
]

POR_BUSQUEDA = 40


def corre(termino, ciudad, maximo, tk):
    cuerpo = {
        "searchStringsArray": [termino],
        "locationQuery": ciudad,
        "maxCrawledPlacesPerSearch": maximo,
        "language": "es",
        "skipClosedPlaces": True,
        "scrapePlaceDetailPage": False,
    }
    url = (f"https://api.apify.com/v2/acts/{ACTOR}/run-sync-get-dataset-items"
           f"?token={tk}")
    req = urllib.request.Request(url, data=json.dumps(cuerpo).encode(),
                                 headers={"Content-Type": "application/json"},
                                 method="POST")
    with urllib.request.urlopen(req, timeout=900) as f:
        return json.loads(f.read().decode())


if __name__ == "__main__":
    tk = token()
    os.makedirs(DATOS, exist_ok=True)
    todo = []
    for ciudad in CIUDADES:
        for t in TERMINOS:
            try:
                r = corre(t, ciudad, POR_BUSQUEDA, tk)
            except Exception as e:
                print(f"  [FALLO] {t} · {ciudad}: {e}")
                continue
            for x in r:
                x["_sector"] = "aire_acondicionado"
                x["_ciudad"] = ciudad.split(",")[0]
                x["_termino"] = t
            todo.extend(r)
            print(f"  {ciudad.split(',')[0]:12} {t:36} {len(r):4}")
            time.sleep(2)
    destino = os.path.join(DATOS, "maps_aire_crudo.json")
    json.dump(todo, open(destino, "w"), ensure_ascii=False)
    print(f"\n{len(todo)} fichas -> {destino}")
