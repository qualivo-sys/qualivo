# Quien ha recibido DE VERDAD un correo nuestro alguna vez, en cualquier campana.
# Sale de /statistics, que es lo unico que trae sent_time. contactados.json no
# sirve para esto: lista lo CARGADO, no lo ENVIADO, asi que un lead que nunca
# recibio nada aparece ahi igual.
import sys, json, urllib.request, urllib.error
API = "https://server.smartlead.ai/api/v1"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/129.0 Safari/537.36")
key = sys.argv[1]
def get(u):
    try:
        r = urllib.request.Request(u, headers={"User-Agent": UA})
        with urllib.request.urlopen(r, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code in (401, 403): raise SystemExit(f"CLAVE RECHAZADA (HTTP {e.code}).")
        return None
    except Exception:
        return None

camps = get(f"{API}/campaigns?api_key={key}") or []
if not camps: raise SystemExit("sin campanas, no sigo")
env = set(); doms = set()
for c in camps:
    off = 0
    while off <= 30000:
        st = get(f"{API}/campaigns/{c['id']}/statistics?api_key={key}&offset={off}&limit=1000")
        filas = (st or {}).get("data") or []
        if not filas: break
        for f in filas:
            if f.get("sent_time"):
                e = str(f.get("lead_email") or "").strip().lower()
                if "@" in e:
                    env.add(e); doms.add(e.split("@")[1])
        off += 1000
json.dump({"correos": sorted(env), "dominios": sorted(doms)},
          open("enviados_reales.json","w"))
print("correos que han recibido algo:", len(env))
print("dominios que han recibido algo:", len(doms))
