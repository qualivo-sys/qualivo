# -*- coding: utf-8 -*-
# Mueve los leads dormidos de su campana pausada a la campana viva que les toca,
# con copy V3 nuevo construido sobre su senal verificada.
#
# Hay que SACARLOS primero de la campana de origen: Smartlead rechaza un lead
# que ya esta en otra campana y devuelve skipped_in_other_campaign_count, aunque
# se le pase ignore_duplicate_leads_in_other_campaign a true (comprobado hoy:
# upload_count 221 y total_leads 0, o sea, nada).
#
# Sacarlos ademas es lo correcto: si alguien despausa manana la campana vieja,
# el lead recibiria el correo dos veces. Los datos estan a salvo en
# dormidos_virgenes.json antes de borrar nada.
import json, sys, time, urllib.request, urllib.error, importlib.util

key = sys.argv[1]
API = "https://server.smartlead.ai/api/v1"
CAB = {"User-Agent": "Mozilla/5.0 (Macintosh) Chrome/129", "Content-Type": "application/json"}

src = open("carga_dormidos.py").read().replace('if __name__ == "__main__":\n    main()', "")
M = type(sys)("cd"); exec(compile(src, "carga_dormidos.py", "exec"), M.__dict__)

virgenes = json.load(open("dormidos_virgenes.json"))
sondeo = {r["email"]: r for r in json.load(open("sondeo_dormidos.json"))}
ids = json.load(open("ids_dormidos.json"))
DE_ORIGEN = {"meta": ["meta"], "salesforce": ["salesforce"], "mailchimp": ["mailchimp"],
             "odoo": ["odoo"], "brevo": ["brevo"], "google-ads": ["google-ads"]}
YA_HECHO = {"manuel.ruiz@nubica.com"}   # el de la prueba, ya movido

plan = {}
for l in virgenes:
    if l["email"] in YA_HECHO: continue
    dom = l["email"].split("@")[-1].lower().replace("www.", "")
    senales = DE_ORIGEN.get(l["senal"]) or (sondeo.get(l["email"]) or {}).get("sondeo") or []
    if not senales: continue
    lead = dict(l); lead["empresa"] = M.nombre_empresa(l, dom); lead["dominio"] = dom
    v = M.vertical_de(l, dom)
    fila = M.monta(lead, senales, v)
    if not fila: continue
    fila.pop("_pal"); fila.pop("_puerta")
    plan.setdefault(M.DESTINO[v], []).append((l["email"], fila))

print(f"a mover: {sum(len(v) for v in plan.values())} leads")

def borra(email):
    d = ids.get(email)
    if not d: return "sin id"
    req = urllib.request.Request(
        f"{API}/campaigns/{d['cid']}/leads/{d['lead_id']}?api_key={key}",
        headers=CAB, method="DELETE")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return "ok" if r.status == 200 else f"HTTP {r.status}"
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code}"

fallos_borrado = []
for cid, pares in sorted(plan.items()):
    for email, _ in pares:
        r = borra(email)
        if r != "ok": fallos_borrado.append((email, r))
    print(f"  campana destino {cid}: sacados {len(pares)-len([f for f in fallos_borrado])} de origen", flush=True)
print(f"fallos al sacar de origen: {len(fallos_borrado)}")
for e, r in fallos_borrado[:10]: print("   ", e, r)

sin_borrar = {e for e, _ in fallos_borrado}
for cid, pares in sorted(plan.items()):
    filas = [f for e, f in pares if e not in sin_borrar]
    for i in range(0, len(filas), 100):
        lote = filas[i:i+100]
        cuerpo = json.dumps({"lead_list": lote, "settings": {
            "ignore_global_block_list": False, "ignore_unsubscribe_list": False,
            "ignore_duplicate_leads_in_other_campaign": True}}).encode()
        req = urllib.request.Request(f"{API}/campaigns/{cid}/leads?api_key={key}",
                                     data=cuerpo, headers=CAB, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                d = json.loads(r.read().decode())
                print(f"campana {cid} lote {i//100+1}: entran {d.get('total_leads')} · "
                      f"saltados {d.get('skipped_in_other_campaign_count')} · "
                      f"bloqueados {d.get('block_count')} · "
                      f"invalidos {d.get('invalid_email_count')}", flush=True)
        except urllib.error.HTTPError as e:
            print(f"campana {cid} lote {i//100+1}: HTTP {e.code} {e.read().decode()[:200]}")
        time.sleep(3)
