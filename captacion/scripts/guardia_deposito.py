# -*- coding: utf-8 -*-
# Guardian del deposito: comprueba que los envios no se van a parar.
#
# Existe por la regla de Maikel del 14-oct, "nunca se pueden pausar los envios".
# El 23-sep se pausaron ocho campanas por rendimiento sin reponer nada y tres
# semanas despues el outbound enviaba 1 correo al dia, sin que ningun aviso
# saltara: el informe contaba el deposito solo de las activas, asi que mientras
# se vaciaban decia "0" y eso no disparaba nada.
#
# Sale con codigo 1 si el deposito de las campanas activas baja de SUELO_DIAS
# dias de envio, para que la rutina que lo llama no lo pueda ignorar.
#
# Uso: python3 guardia_deposito.py <clave_smartlead> [--suelo 3]
import sys, json, urllib.request, urllib.error

API = "https://server.smartlead.ai/api/v1"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/129.0 Safari/537.36")
# Campanas de cliente: su deposito no es nuestro y no cuenta para esta alarma.
DE_CLIENTE = ("DKR ", "Kubysoft")


def get(key, ruta):
    r = urllib.request.Request(f"{API}{ruta}&api_key={key}", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(r, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        # Un 401 no es "cero leads": es que no he podido mirar. Parar y decirlo.
        if e.code in (401, 403):
            raise SystemExit(f"CLAVE RECHAZADA (HTTP {e.code}). No puedo comprobar "
                             f"el deposito, y un cero aqui seria mentira.")
        return None
    except Exception:
        return None


def main():
    key = sys.argv[1]
    suelo = 3
    if "--suelo" in sys.argv:
        suelo = int(sys.argv[sys.argv.index("--suelo") + 1])

    camps = get(key, "/campaigns?")
    if not camps:
        raise SystemExit("no puedo leer las campanas; no doy ningun numero")

    filas, capacidad = [], 0
    for c in camps:
        if c.get("status") != "ACTIVE":
            continue
        nombre = c.get("name") or "?"
        if any(nombre.startswith(p) or p in nombre for p in DE_CLIENTE):
            continue
        tope = c.get("max_leads_per_day") or 0
        dep, off = 0, 0
        while off <= 20000:
            pl = get(key, f"/campaigns/{c['id']}/leads?offset={off}&limit=100")
            rows = (pl or {}).get("data") or []
            if not rows:
                break
            dep += sum(1 for x in rows if (x.get("status") or "").upper() == "STARTED")
            off += 100
        filas.append({"campana": nombre, "deposito": dep, "tope_dia": tope,
                      "dias": round(dep / tope, 1) if tope else None})
        capacidad += tope

    total = sum(f["deposito"] for f in filas)
    dias = round(total / capacidad, 1) if capacidad else 0

    print(f"{'campana':44} {'deposito':>9} {'tope/dia':>9} {'dias':>6}")
    for f in sorted(filas, key=lambda x: x["deposito"]):
        d = f["dias"] if f["dias"] is not None else "sin tope"
        print(f"{f['campana'][:44]:44} {f['deposito']:9} {f['tope_dia']:9} {str(d):>6}")
    print(f"\ndeposito de Qualivo: {total} leads · capacidad {capacidad}/dia · "
          f"{dias} dias de envio")

    if not filas:
        print("\nALARMA: no hay NINGUNA campana activa de Qualivo. Los envios estan a cero.")
        sys.exit(1)
    if dias < suelo:
        faltan = int(capacidad * suelo - total)
        print(f"\nALARMA: por debajo del suelo de {suelo} dias. Faltan ~{faltan} leads "
              f"para volver a estar cubiertos.\nCargar HOY, antes que cualquier analisis. "
              f"No se despausa ninguna campana vieja para taparlo: reanudar una campana "
              f"con leads a medias reenvia a quien ya recibio.")
        sys.exit(1)
    print(f"\nCubierto: {dias} dias por encima del suelo de {suelo}.")


if __name__ == "__main__":
    main()
