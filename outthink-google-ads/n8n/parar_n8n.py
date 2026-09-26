"""Desactiva el flujo del informe diario en n8n. Requiere N8N_KEY en el entorno.

    N8N_KEY='...' python3 parar_n8n.py            # muestra el estado
    N8N_KEY='...' python3 parar_n8n.py --apply    # lo desactiva
"""
import json, os, sys, urllib.error, urllib.request

BASE = "https://qualivo.app.n8n.cloud/api/v1"
WF = "t6g8nV3pQXqYLpuN"  # Reporte diario · OutThink
KEY = os.environ.get("N8N_KEY")
if not KEY:
    sys.exit("Falta N8N_KEY. La clave no se guarda en el repositorio ni en disco.")

def call(method, path):
    req = urllib.request.Request(
        BASE + path,
        headers={"X-N8N-API-KEY": KEY, "accept": "application/json"},
        method=method)
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read().decode()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        return {"_err": e.code, "_body": e.read().decode()[:400]}

wf = call("GET", f"/workflows/{WF}")
if "_err" in wf:
    sys.exit(f"No se pudo leer el flujo: {wf['_err']} · {wf['_body']}")
print(f"Flujo: {wf.get('name')} · activo: {wf.get('active')}")

if "--apply" not in sys.argv:
    print("Ejecuta con --apply para desactivarlo.")
    sys.exit()

res = call("POST", f"/workflows/{WF}/deactivate")
if "_err" in res:
    sys.exit(f"No se pudo desactivar: {res['_err']} · {res['_body']}")
print(f"Desactivado. Estado ahora: activo = {call('GET', f'/workflows/{WF}').get('active')}")
