# Por campana: enviados hoy, enviados 7 dias, aperturas, respuestas, rebotes,
# deposito (leads STARTED) y buzones conectados. Es lo que Maikel pide ver sin
# tener que preguntar: cuantos correos salen por campana y que esta parado.
#
# De donde sale cada numero:
#  - enviados/aperturas/respuestas/rebotes: /statistics, que trae sent_time,
#    open_count, reply_time, is_bounced por fila. /analytics agrega mal.
#  - deposito: contando status == STARTED en /leads. /analytics.notStarted
#    SIEMPRE devuelve 0, comprobado el 13-oct.
import sys, json, datetime, urllib.request, urllib.error
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
        if e.code in (401, 403):
            raise SystemExit(f"CLAVE RECHAZADA (HTTP {e.code}). Informe abortado.")
        return {"_error": f"HTTP {e.code}"}
    except Exception as e:
        return {"_error": str(e)}

hoy = datetime.date(2026, 10, 14)
hace7 = hoy - datetime.timedelta(days=7)
camps = get(f"{API}/campaigns?api_key={key}")
if isinstance(camps, dict):
    print("no puedo leer las campanas:", camps.get("_error")); sys.exit(1)

filas = []
for c in sorted(camps, key=lambda x: x.get("name") or ""):
    if c.get("status") == "DRAFTED":
        continue
    cid, nombre, estado = c["id"], c.get("name") or "?", c.get("status")
    hoy_env = hoy_ap = hoy_resp = hoy_reb = 0
    s7_env = s7_resp = s7_reb = 0
    off = 0
    while off <= 30000:
        st = get(f"{API}/campaigns/{cid}/statistics?api_key={key}&offset={off}&limit=1000")
        if isinstance(st, dict) and st.get("_error"): break
        datos = (st or {}).get("data") or []
        if not datos: break
        for f in datos:
            sent = f.get("sent_time")
            if not sent: continue
            d = datetime.datetime.fromisoformat(sent.replace("Z", "+00:00")).date()
            reb = 1 if f.get("is_bounced") else 0
            resp = 1 if f.get("reply_time") else 0
            if d == hoy:
                hoy_env += 1
                hoy_ap += 1 if (f.get("open_count") or 0) > 0 else 0
                hoy_resp += resp; hoy_reb += reb
            if d >= hace7:
                s7_env += 1; s7_resp += resp; s7_reb += reb
        off += 1000
    # Deposito: leads cargados que todavia no han empezado.
    dep = 0; tot = 0; off = 0
    while off <= 20000:
        pl = get(f"{API}/campaigns/{cid}/leads?api_key={key}&offset={off}&limit=100")
        if isinstance(pl, dict) and pl.get("_error"): break
        rows = (pl or {}).get("data") or []
        if not rows: break
        tot += len(rows)
        dep += sum(1 for x in rows if (x.get("status") or "").upper() == "STARTED")
        off += 100
    ea = get(f"{API}/campaigns/{cid}/email-accounts?api_key={key}")
    buzones = len(ea) if isinstance(ea, list) else 0
    filas.append({"nombre": nombre, "estado": estado, "hoy": hoy_env, "ap_hoy": hoy_ap,
                  "resp_hoy": hoy_resp, "reb_hoy": hoy_reb, "sem": s7_env,
                  "resp_sem": s7_resp, "reb_sem": s7_reb, "deposito": dep,
                  "leads": tot, "buzones": buzones})

print(f"{'campana':46} {'estado':8} {'hoy':>4} {'7d':>5} {'resp7':>5} {'reb7':>4} {'depo':>5} {'leads':>6} {'buz':>4}")
for f in filas:
    print(f"{f['nombre'][:46]:46} {f['estado'][:8]:8} {f['hoy']:4} {f['sem']:5} "
          f"{f['resp_sem']:5} {f['reb_sem']:4} {f['deposito']:5} {f['leads']:6} {f['buzones']:4}")
print()
print("TOTAL hoy:", sum(f["hoy"] for f in filas), "| 7 dias:", sum(f["sem"] for f in filas),
      "| deposito:", sum(f["deposito"] for f in filas))
json.dump(filas, open("reporte_campanas_14oct.json", "w"), ensure_ascii=False, indent=1)
