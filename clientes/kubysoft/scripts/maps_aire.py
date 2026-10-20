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
#
# Dos fases porque el presupuesto de Apify es compartido con Qualivo y se paga
# por ficha: la fase 1 corrio el 21-sep y dejo 139 leads con correo, que en dos
# tandas se quedaban en 60 y 79. La fase 2 amplia sin repetir lo ya pagado.
FASES = {
    "fase1": [
        "Madrid, Spain",
        "Barcelona, Spain",
        "Valencia, Spain",
        "Sevilla, Spain",
        "Malaga, Spain",
        "Murcia, Spain",
        "Zaragoza, Spain",
        "Alicante, Spain",
    ],
    # Norte, islas, noroeste y Andalucia interior: lo que faltaba del mapa.
    "fase2": [
        "Bilbao, Spain",
        "Palma, Spain",
        "Las Palmas de Gran Canaria, Spain",
        "Vigo, Spain",
        "Granada, Spain",
        "Cordoba, Spain",
    ],
}

# 30 y no 40 por presupuesto. El 2-oct la bolsa iba por 19,93 de 30 y Qualivo
# tira de ella a diario, asi que la fase 2 son 6 ciudades y no 8: unos 3,5
# dolares en vez de 4,7, y le queda margen a nuestra propia captacion.
POR_BUSQUEDA = 30


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


def guarda(todo, destino):
    """Escribe por fichero temporal y renombra, para no dejar medio JSON si
    nos matan justo al escribir."""
    tmp = destino + ".tmp"
    json.dump(todo, open(tmp, "w"), ensure_ascii=False)
    os.replace(tmp, destino)


if __name__ == "__main__":
    fase = sys.argv[1] if len(sys.argv) > 1 else "fase1"
    if fase not in FASES:
        sys.exit(f"Fase desconocida: {fase}. Son {list(FASES)}")
    tk = token()
    os.makedirs(DATOS, exist_ok=True)

    # Un fichero por fase. prepara_aire.py los junta, asi que relanzar una fase
    # no pisa lo que ya se pago en la otra.
    destino = os.path.join(DATOS, f"maps_aire_crudo_{fase}.json")

    # SE GUARDA DESPUES DE CADA BUSQUEDA, y se reanuda saltando las que ya
    # estan. El 2-oct la fase 2 se corto a las 23 busquedas de 30 por un limite
    # de tiempo y, como solo se guardaba al final, en disco no quedo nada
    # mientras Apify ya habia cobrado. Se recuperaron de los datasets, pero el
    # fallo era este: no volver a juntar en memoria media hora de trabajo
    # pagado sin tocar el disco.
    todo = json.load(open(destino)) if os.path.exists(destino) else []
    hechas = {(x.get("_ciudad"), x.get("_termino")) for x in todo}
    if hechas:
        print(f"reanudando: {len(todo)} fichas y {len(hechas)} busquedas ya en disco")

    for ciudad in FASES[fase]:
        for t in TERMINOS:
            if (ciudad.split(",")[0], t) in hechas:
                print(f"  {ciudad.split(',')[0]:14} {t:36}  (ya estaba)")
                continue
            try:
                r = corre(t, ciudad, POR_BUSQUEDA, tk)
            except Exception as e:
                print(f"  [FALLO] {t} · {ciudad}: {e}")
                continue
            for x in r:
                x["_sector"] = "aire_acondicionado"
                x["_ciudad"] = ciudad.split(",")[0]
                x["_termino"] = t
                x["_fase"] = fase
            todo.extend(r)
            guarda(todo, destino)
            print(f"  {ciudad.split(',')[0]:14} {t:36} {len(r):4}")
            time.sleep(2)

    print(f"\n{len(todo)} fichas -> {destino}")
