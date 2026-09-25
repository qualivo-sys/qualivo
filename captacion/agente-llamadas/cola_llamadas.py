#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Genera la cola diaria de llamadas del agente de voz.
# Selecciona leads del SEGUNDO escalon (3-5 aperturas o clic, sin respuesta),
# saca el telefono de su web, monta el briefing y lo manda al webhook de n8n.
# Uso: python3 cola_llamadas.py <smartlead_api_key> [n8n_webhook_url]
#   Sin webhook: imprime la cola y la guarda en cola-<fecha>.json (dry run).
import sys, json, csv, re, os, subprocess, datetime, urllib.request

KEY = sys.argv[1]
WEBHOOK = sys.argv[2] if len(sys.argv) > 2 else ""
HOY = datetime.date.today().isoformat()
BASE = os.path.dirname(os.path.abspath(__file__))
PROBE = os.path.join(BASE, "..", "datos", "probe-dataset.csv")
HIST = os.path.join(BASE, "historial_llamadas.json")  # leads ya llamados/encolados
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"}

CAMPS = {3772173: "inmo", 3767479: "solar", 3885638: "re-enganche",
         3887259: "gestorias", 3784421: "senales", 3885628: "sdr"}
MIN_OPENS, MAX_OPENS, MAX_COLA = 3, 5, 8  # segundo escalon; 6+ es de Maikel

def get(p):
    r = urllib.request.Request("https://server.smartlead.ai/api/v1/" + p +
                               ("&" if "?" in p else "?") + "api_key=" + KEY, headers=UA)
    return json.loads(urllib.request.urlopen(r).read())

def telefono(dom):
    """Solo telefonos publicados en la web de la empresa (regla legal B2B)."""
    for path in ("", "contacto/", "contacto", "contact"):
        try:
            r = subprocess.run(["curl", "-sL", "--max-time", "10", "-A", UA["User-Agent"],
                                "https://%s/%s" % (dom, path)], capture_output=True, timeout=15)
            s = r.stdout.decode("utf-8", "ignore")
            m = re.findall(r"tel:\+?([0-9 .\-()]{9,15})", s) or \
                re.findall(r"(\+34[ .\-]?[6789][0-9]{2}[ .\-]?[0-9]{2,3}[ .\-]?[0-9]{2,3}[ .\-]?[0-9]{0,2})", s)
            for cand in m:
                num = re.sub(r"[^0-9+]", "", cand)
                if num.startswith("+") and not num.startswith("+34"):
                    continue  # piloto solo España: el agente habla castellano
                num = "+34" + num.lstrip("+").lstrip("34") if not num.startswith("+34") else num
                if len(num) == 12 and num[3] in "6789":
                    return num
        except Exception:
            pass
    return ""

def dato_probe(dom):
    if not os.path.exists(PROBE):
        return ""
    for row in csv.DictReader(open(PROBE)):
        if row["dominio"] != dom or row["estado"] != "OK":
            continue
        if row["gtm"] == "0" and row["ga4"] == "0":
            if row["formularios"] == "0":
                return "vuestra web no tiene ni formulario de contacto: todo el que entra se va sin dejar rastro"
            return "vuestra web recibe visitas pero no mide nada: ni Analytics ni etiquetas, no se sabe de donde sale cada contacto"
        if row["meta_pixel"] == "1" and row["formularios"] == "0":
            return "teneis pixel de anuncios en la web pero ningun formulario que capture al que llega"
    return ""

hist = json.load(open(HIST)) if os.path.exists(HIST) else {}
cola = []
for cid, vert in CAMPS.items():
    off = 0
    while True:
        d = get("campaigns/%d/statistics?limit=100&offset=%d" % (cid, off))
        rows = d.get("data", [])
        for r in rows:
            em = (r.get("lead_email") or "").lower()
            opens = r.get("open_count") or 0
            clicks = r.get("click_count") or 0
            if r.get("reply_time") or em in hist or any(l["email"] == em for l in cola):
                continue
            if not (clicks >= 1 or MIN_OPENS <= opens <= MAX_OPENS):
                continue
            nombre = (r.get("lead_name") or "").strip()
            if not nombre or em.split("@")[0] in ("info", "hola", "contacto", "admin"):
                continue  # sin nombre real no hay llamada creible
            dom = em.split("@")[1]
            cola.append({"email": em, "nombre": nombre.split()[0], "nombre_completo": nombre,
                         "empresa": dom.split(".")[0].title(), "dominio": dom,
                         "vertical": vert, "campana_id": cid,
                         "email_que_abrio": r.get("email_subject") or "",
                         "n_aperturas": opens, "clicks": clicks})
        if len(rows) < 100:
            break
        off += 100

cola.sort(key=lambda x: (-x["clicks"], -x["n_aperturas"]))
final = []
for lead in cola:
    if len(final) >= MAX_COLA:
        break
    tel = telefono(lead["dominio"])
    if not tel:
        continue
    lead["telefono"] = tel
    d = dato_probe(lead["dominio"])
    lead["dato_concreto"] = d or ("Maikel estuvo mirando vuestra web y se quedo con una duda sobre como os entran los clientes")
    lead["dato_corto"] = "lo que vio en vuestra web" if d else "una duda sobre vuestra captacion"
    lead["objetivo"] = "agendar llamada de 15 minutos con Maikel"
    final.append(lead)
    hist[lead["email"]] = HOY

out = os.path.join(BASE, "cola-%s.json" % HOY)
json.dump(final, open(out, "w"), ensure_ascii=False, indent=1)
json.dump(hist, open(HIST, "w"))
print("cola de hoy: %d leads -> %s" % (len(final), out))
for l in final:
    print("-", l["nombre_completo"], "|", l["empresa"], "|", l["telefono"],
          "| %da/%dc |" % (l["n_aperturas"], l["clicks"]), l["dato_concreto"][:60])

if WEBHOOK and final:
    req = urllib.request.Request(WEBHOOK, data=json.dumps({"fecha": HOY, "leads": final}).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    print("webhook n8n:", urllib.request.urlopen(req).status)
