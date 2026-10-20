#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Carga en HeyReach los perfiles de LinkedIn de gente que ya estamos tocando
# por email, para el segundo toque.
#
# TRAMPA IMPORTANTE: HeyReach DESCARTA EN SILENCIO los leads cuyo profileUrl no
# empiece por https. Devuelve {"addedLeadsCount":0,"failedLeadsCount":0}, o sea
# ni anadidos ni fallidos, y la lista se queda vacia. Apollo devuelve las URLs
# como "http://www.linkedin.com/in/...", asi que sin normalizar se pierde el
# lote entero sin un solo error. Por eso aqui se fuerza https y al final se
# relee el contador de la lista en vez de fiarse de la respuesta.
#
# Orden de carga: primero quien YA recibio email y no contesto. Ahi LinkedIn es
# un segundo toque sobre alguien que ya vio nuestro nombre, que es donde el
# multicanal rinde. Los que aun estan en cola van despues.
#
# Uso: python3 heyreach_carga.py <lista_id> <candidatos.json> [--carga]
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error

S = ("/tmp/claude-0/-home-user-qualivo/"
     "382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad")
K = open(os.path.join(S, ".heyreach_key")).read().strip()
B = "https://api.heyreach.io/api/public"


def api(metodo, ruta, cuerpo=None):
    r = urllib.request.Request(f"{B}{ruta}",
                               data=json.dumps(cuerpo).encode() if cuerpo is not None else None,
                               headers={"X-API-KEY": K, "Content-Type": "application/json"},
                               method=metodo)
    for i in range(3):
        try:
            with urllib.request.urlopen(r, timeout=90) as f:
                t = f.read().decode()
                return json.loads(t) if t.strip().startswith(("{", "[")) else {"raw": t}
        except urllib.error.HTTPError as e:
            return {"err": f"{e.code} {e.read().decode()[:200]}"}
        except Exception as e:
            if i == 2:
                return {"err": str(e)}
            time.sleep(3)


def limpia_url(u):
    """https obligatorio y sin parametros. Ver la nota de arriba: con http el
    lead desaparece sin dar error."""
    u = (u or "").split("?")[0].rstrip("/")
    u = re.sub(r"^http://", "https://", u)
    if u.startswith("www."):
        u = "https://" + u
    return u if u.startswith("https://") and "linkedin.com/in/" in u else None


def main():
    lista = int(sys.argv[1])
    d = json.load(open(sys.argv[2], encoding="utf-8"))
    carga = "--carga" in sys.argv

    leads, sin_url = [], 0
    vistos = set()
    for x in d:
        u = limpia_url(x.get("linkedin"))
        if not u or u in vistos:
            sin_url += 1
            continue
        vistos.add(u)
        leads.append({"firstName": (x.get("nombre") or "").strip(),
                      "lastName": (x.get("apellido") or "").strip(),
                      "profileUrl": u,
                      "companyName": (x.get("empresa") or "").strip(),
                      "position": (x.get("titulo") or "").strip()[:100],
                      "emailAddress": x.get("email") or ""})
    print(f"{len(leads)} perfiles validos · {sin_url} descartados (url mala o repetida)")
    if not carga:
        print("[seco] no se ha cargado nada")
        return

    antes = (api("GET", f"/list/GetById?listId={lista}") or {}).get("totalItemsCount", 0)
    ok = 0
    for i in range(0, len(leads), 100):
        lote = leads[i:i + 100]
        r = api("POST", "/list/AddLeadsToListV2", {"listId": lista, "leads": lote})
        if r.get("err"):
            print(f"  lote {i//100+1}: FALLO {r['err']}")
            continue
        ok += r.get("addedLeadsCount", 0) + r.get("updatedLeadsCount", 0)
        print(f"  lote {i//100+1}: +{r.get('addedLeadsCount')} nuevos, "
              f"{r.get('updatedLeadsCount')} actualizados, {r.get('failedLeadsCount')} fallidos")
        time.sleep(1)

    # No basta con lo que diga la respuesta: se relee el contador real.
    despues = (api("GET", f"/list/GetById?listId={lista}") or {}).get("totalItemsCount", 0)
    print(f"\nlista {lista}: {antes} -> {despues} ({despues - antes} nuevos de verdad)")
    if despues - antes < ok * 0.9:
        print("AVISO: la lista ha crecido menos de lo que dice la API. Revisar las URLs.")


if __name__ == "__main__":
    main()
