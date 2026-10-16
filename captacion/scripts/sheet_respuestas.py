#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Escribe y da formato a la hoja "Qualivo · Leads y respuestas" en Google Sheets
# usando la cuenta de servicio apiclaude@kinetic-dream-377917. Sin base64 ni CSV.
# Pestañas: Resumen · Leads nuevos · Leads antiguos · Todas las respuestas.
# Uso: python3 sheet_respuestas.py <SMARTLEAD_API_KEY>
import json, sys, os, re, urllib.request, collections, datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build

SP = os.environ.get("SP", "/tmp/claude-0/-home-user-qualivo/382cb24d-db51-5d09-9b74-283a016bf8e6/scratchpad")
HOJA = "1ZeDb6ojYd0AO9NFtJJyOz5fN--mS96iM5ousplzol6M"
K = sys.argv[1]
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126"}
req = lambda u: json.loads(urllib.request.urlopen(urllib.request.Request(u, headers=UA)).read())

NAVY={"red":0.12,"green":0.22,"blue":0.34}; BLANCO={"red":1,"green":1,"blue":1}
GRIS={"red":0.97,"green":0.97,"blue":0.98}; ROJOF={"red":0.99,"green":0.93,"blue":0.93}
VERDEF={"red":0.92,"green":0.97,"blue":0.94}
ROJO={"red":0.70,"green":0.15,"blue":0.12}; AMBAR={"red":0.70,"green":0.42,"blue":0.0}
VERDE={"red":0.12,"green":0.48,"blue":0.27}; GRISTX={"red":0.45,"green":0.48,"blue":0.52}

def limpia(t, n=300):
    t = str(t or "")
    t = re.sub(r"[a-z]\\?:\*\s*\{[^}]*\}", " ", t, flags=re.I)
    t = re.sub(r"[.#@]?[\w\-\\:*]+\s*\{[^}]*\}", " ", t)
    t = re.sub(r"@(import|media|font-face)[^;{]*[;{][^}]*\}?", " ", t, flags=re.I)
    t = re.sub(r"(mso|behavior|font-family|margin|padding)\s*[:\-][^;]{0,80};", " ", t, flags=re.I)
    return re.sub(r"\s+", " ", t).strip()[:n]

def puntuar(t):
    b = (t or "").lower()
    if re.search(r"lopd|rgpd|ilegal|denunc|bórre|borrar|no me escrib|no quiero que me escriban|elimin|baja del email|^baja", b): return 0, "Bloqueado"
    if re.search(r"no me interesa|no estamos interesad|no nos interesa|no necesito|ya lo tenemos|todo ya organizado|"
                 r"lo tenemos todo|ya lo hacemos|no encaja|prefiero no seguir|declinamos|no vendemos|no tenemos problem|"
                 r"tenemos todas las necesidades|no estoy interesad", b): return 0, "No interesado"
    if re.search(r"vacaci|vacances|ferias|fuera de la oficina|out of office|estaré fuera|estare fuera|tancat|tancad|"
                 r"romandr|de baja|cerrados por|cerrado por|estoy fuera|estic fora|absent|ausente|"
                 r"no me encuentro disponible|ooo", b): return 20, "Ausencia"
    if re.search(r"ha cambiado|nueva direcci[oó]n|dejar[aá] de estar activa|ha sido modificado|changing our e-mails", b): return 20, "Cambio de email"
    if re.search(r"pongo en contacto|te pido que contactes|por favor contactar con|contacta con|responsable de marketing|"
                 r"persona adecuada|traslado el email|he derivado|derivado a|project manager|no soy decisor|"
                 r"contactar con [a-z.]+@", b): return 80, "Derivación"
    if re.search(r"cu[aá]nto|precio|cobras|coste|c[oó]mo crees que|m[aá]s info|envianos|env[ií]anos|quiero saber|"
                 r"me gustar[ií]a saber|reuni[oó]n|llamada|agenda|hueco|\?", b): return 100, "Pidió conversación"
    if re.search(r"m[aá]s adelante|ahora no|no es prioridad|reducir la inversi[oó]n|en el futuro|no es el momento", b): return 40, "Timing"
    return 60, "Revisar"

# --- datos -------------------------------------------------------------------
email = json.load(open(SP + "/respuestas_clasificadas.json"))
est = {e["email"]: e for e in json.load(open(SP + "/hilos_estado.json"))}
li = json.load(open(SP + "/linkedin_respuestas.json"))
nuevos = {}
for f in ("leads_v3_11sep.json", "leads_v3_14sep.json", "leads_v3_14sep_b.json",
          "leads_v3_15sep.json", "leads_v3_15sep_b.json"):
    for l in json.load(open(SP + "/" + f)): nuevos[l["email"]] = l

todas = []
for o in email:
    t = limpia(o.get("txt")); sc, cl = puntuar(t)
    c = est.get(o["email"], {}).get("contestado") or ""
    todas.append([sc, o.get("fecha"), "Email", o.get("nombre") or "", o.get("email"),
                  (o.get("camp") or "")[:26], cl, t, ("sí " + c) if c else "no"])
for o in li:
    t = limpia(o.get("texto")); sc, cl = puntuar(t)
    todas.append([sc, o.get("fecha"), "LinkedIn", o.get("nombre") or "",
                  limpia(o.get("headline"), 40), "LinkedIn", cl, t, "no"])
todas.sort(key=lambda r: (r[1] or ""), reverse=True)

# respuestas del motor V3
motor = []
d = req(f"https://server.smartlead.ai/api/v1/campaigns/3940264/statistics?api_key={K}&email_status=replied&offset=0&limit=100")
idx = {}
for off in (0, 100, 200):
    for x in (req(f"https://server.smartlead.ai/api/v1/campaigns/3940264/leads?api_key={K}&offset={off}&limit=100").get("data") or []):
        idx[(x["lead"]["email"] or "").lower()] = x["lead"]["id"]
import html as H
for r in d.get("data") or []:
    em = (r.get("lead_email") or "").lower(); lid = idx.get(em); txt = ""
    if lid:
        m = req(f"https://server.smartlead.ai/api/v1/campaigns/3940264/leads/{lid}/message-history?api_key={K}")
        for h in m.get("history") or []:
            if h.get("type") == "REPLY":
                t = H.unescape(re.sub(r"<[^>]+>", " ", h.get("email_body") or ""))
                txt = limpia(re.split(r"El .{0,40}escribi|De:\s|From:\s|wrote:|-----", t)[0]); break
    l = nuevos.get(em, {}); sc, cl = puntuar(txt)
    motor.append([sc, (r.get("reply_time") or "")[:10], l.get("first_name") or "",
                  l.get("company_name") or "", em, cl, txt])
motor.sort(key=lambda r: -r[0])

# metricas
camps = req(f"https://server.smartlead.ai/api/v1/campaigns?api_key={K}")
tot = collections.Counter()
for c in camps:
    off = 0
    while True:
        s = req(f"https://server.smartlead.ai/api/v1/campaigns/{c['id']}/statistics?api_key={K}&offset={off}&limit=500")
        rows = s.get("data") or []
        for r in rows:
            if r.get("sent_time"): tot["env"] += 1
            if (r.get("open_count") or 0) > 0: tot["ap"] += 1
            if r.get("reply_time"): tot["resp"] += 1
            if r.get("is_bounced"): tot["reb"] += 1
        if len(rows) < 500: break
        off += 500
g = collections.Counter(r[6] for r in todas)
pc = lambda a, b: f"{100*a/max(b,1):.1f}%"

# --- API ---------------------------------------------------------------------
cred = service_account.Credentials.from_service_account_file(
    SP + "/.gcp_sa.json",
    scopes=["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"])
sh = build("sheets", "v4", credentials=cred, cache_discovery=False)

meta = sh.spreadsheets().get(spreadsheetId=HOJA).execute()
existentes = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
QUIERO = ["Resumen", "Leads nuevos", "Leads antiguos", "Todas las respuestas"]
peticiones = []
for t in QUIERO:
    if t not in existentes:
        peticiones.append({"addSheet": {"properties": {"title": t}}})
if peticiones:
    r = sh.spreadsheets().batchUpdate(spreadsheetId=HOJA, body={"requests": peticiones}).execute()
    for rep in r.get("replies", []):
        p = rep.get("addSheet", {}).get("properties")
        if p: existentes[p["title"]] = p["sheetId"]
# borrar pestañas sobrantes
sobra = [ (t,i) for t,i in existentes.items() if t not in QUIERO ]
if sobra and len(existentes) > len(sobra):
    sh.spreadsheets().batchUpdate(spreadsheetId=HOJA,
        body={"requests": [{"deleteSheet": {"sheetId": i}} for _, i in sobra]}).execute()
    for t, _ in sobra: existentes.pop(t, None)

VAL = []
def hoja(nombre, filas):
    VAL.append({"range": f"'{nombre}'!A1", "values": filas})

hoja("Resumen", [
 ["EMBUDO QUALIVO", "", ""],
 [f"Actualizado {datetime.date.today().isoformat()} · lo que manda es la última fila", "", ""],
 ["", "", ""],
 ["Métrica", "Número", "Lectura"],
 ["Envíos acumulados", tot["env"], "desde el 8 de julio"],
 ["Aperturas", tot["ap"], pc(tot["ap"], tot["env"])],
 ["Rebotes", tot["reb"], pc(tot["reb"], tot["env"]) + " · el límite es 3%"],
 ["Respuestas por email", tot["resp"], pc(tot["resp"], tot["env"])],
 ["Respuestas por LinkedIn", len(li), "8,1% · cinco veces mejor con veinte veces menos volumen"],
 ["Leads en el motor V3", len(nuevos), "desde el 11 de septiembre"],
 ["Respuestas del motor V3", len(motor), ""],
 ["LEADS · pidieron conversación", len([r for r in todas if r[0] == 100]) , "lo único que cuenta antes de la reunión"],
 ["REUNIONES AGENDADAS", 0, "la métrica que manda"],
 ["", "", ""],
 ["Cómo se reparten las 132 respuestas", "", ""],
 ["Clasificación", "Cuántas", "Qué significa"],
] + [[k, v, {"Ausencia": "Fuera de la oficina. Reintentar a la vuelta.",
             "Revisar": "No encaja en ningún cajón. Hay que leerla.",
             "No interesado": "Rechazo claro. No se vuelve a escribir.",
             "Bloqueado": "Pidió no ser contactado. Dominio en lista negra.",
             "Derivación": "Nos manda a otra persona con nombre.",
             "Pidió conversación": "Preguntó algo o pidió llamada.",
             "Timing": "No es que no, es que ahora no.",
             "Cambio de email": "Avisan de dirección nueva. Recontactar allí."}.get(k, "")]
    for k, v in g.most_common()])

hoja("Leads nuevos", [["LEADS NUEVOS · motor V3", "", "", "", "", "", ""],
 ["Los que han respondido al mensaje nuevo desde el 11 de septiembre", "", "", "", "", "", ""],
 ["", "", "", "", "", "", ""],
 ["Score", "Fecha", "Quién", "Empresa", "Contacto", "Clasificación", "Qué dijo"]] + motor)

ANT = [["LEADS ANTIGUOS QUE SIGUEN VIVOS", "", "", "", "", ""],
 ["Respuestas de julio y agosto con algo que rascar", "", "", "", "", ""],
 ["", "", "", "", "", ""],
 ["Score", "Quién", "Empresa", "Canal", "Qué pasó", "¿Contestado?"],
 [100, "Óscar Martínez", "socio-gerente", "LinkedIn", "Pide referencias en su sector y da por hecha la reunión. Lleva 25 días esperando.", "NO"],
 [100, "Andrea Gobantes", "Ucademy", "LinkedIn", "Preguntó cómo podemos ayudarles. Lleva 56 días.", "NO"],
 [80, "Raquel Rebelo", "Abilways", "LinkedIn", "Deriva a Remi Román, responsable de marketing, a partir de septiembre. La fecha ya llegó.", "NO"],
 [80, "Eduard Estrella", "CODESPACE", "LinkedIn", "Ya no trabaja allí. Deriva a Loli Murillo, Project Manager.", "NO"],
 [40, "Mónica", "Mawah Assessors", "Email", "Le interesa pero tienen que reducir inversión. No es un no, es cuestión de momento.", "NO"],
 [100, "Jelen Colak", "My Language Coach", "Email", "Preguntó precio el 8-ago. Se le contestó sin dar cifra y se calló 35 días. Móvil: 650926098.", "sí 14-sep"],
 [100, "Lara", "", "Email", "Preguntó de dónde salió su email. 27 días sin contestar.", "sí 14-sep"],
 [100, "Hermanas", "Carvajalinos", "Email", "Pidieron más información y se cortó la conversación.", "sí 14-sep"],
 [60, "Antonio Calviño", "Academia Kaizen / Dojo Ikigai", "Email", "Nos dio sus dos webs y nadie le mandó nada. Si dice que sí hay que hacer la radiografía de verdad.", "sí 14-sep"],
 [80, "José Juan Martín", "OpenHR", "Email", "Nos pasa a su equipo de marketing. Pedido el contacto directo.", "sí 14-sep"]]
hoja("Leads antiguos", ANT)

hoja("Todas las respuestas", [["TODAS LAS RESPUESTAS DESDE EL 8 DE JULIO", "", "", "", "", "", "", "", ""],
 [f"{len(todas)} respuestas · ordenadas de la más reciente a la más antigua", "", "", "", "", "", "", "", ""],
 ["", "", "", "", "", "", "", "", ""],
 ["Score", "Fecha", "Canal", "Quién", "Contacto o cargo", "Campaña", "Clasificación", "Qué dijo", "¿Contestado?"]] + todas)

sh.spreadsheets().values().batchUpdate(spreadsheetId=HOJA,
    body={"valueInputOption": "RAW", "data": VAL}).execute()

# --- formato -----------------------------------------------------------------
def fmt(nombre, ncols, filacab, anchos, wrapcol=None):
    sid = existentes[nombre]; R = []
    R.append({"updateSheetProperties": {"properties": {"sheetId": sid,
        "gridProperties": {"frozenRowCount": filacab}}, "fields": "gridProperties.frozenRowCount"}})
    R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 0, "endRowIndex": 1},
        "cell": {"userEnteredFormat": {"textFormat": {"bold": True, "fontSize": 15,
            "foregroundColor": NAVY}, "verticalAlignment": "MIDDLE"}},
        "fields": "userEnteredFormat(textFormat,verticalAlignment)"}})
    R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 1, "endRowIndex": 2},
        "cell": {"userEnteredFormat": {"textFormat": {"fontSize": 10, "foregroundColor": GRISTX}}},
        "fields": "userEnteredFormat.textFormat"}})
    R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": filacab-1, "endRowIndex": filacab,
        "startColumnIndex": 0, "endColumnIndex": ncols},
        "cell": {"userEnteredFormat": {"backgroundColor": NAVY, "textFormat": {"bold": True,
            "foregroundColor": BLANCO, "fontSize": 10}, "horizontalAlignment": "CENTER",
            "verticalAlignment": "MIDDLE"}},
        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"}})
    for i, a in enumerate(anchos):
        R.append({"updateDimensionProperties": {"range": {"sheetId": sid, "dimension": "COLUMNS",
            "startIndex": i, "endIndex": i+1}, "properties": {"pixelSize": a}, "fields": "pixelSize"}})
    R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": filacab,
        "startColumnIndex": 0, "endColumnIndex": ncols},
        "cell": {"userEnteredFormat": {"textFormat": {"fontSize": 10},
            "verticalAlignment": "TOP", "wrapStrategy": "WRAP" if wrapcol is not None else "CLIP"}},
        "fields": "userEnteredFormat(textFormat,verticalAlignment,wrapStrategy)"}})
    return R, sid

R = []
r, sid = fmt("Resumen", 3, 4, [300, 110, 420]); R += r
R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 11, "endRowIndex": 13,
    "startColumnIndex": 0, "endColumnIndex": 3},
    "cell": {"userEnteredFormat": {"textFormat": {"bold": True, "fontSize": 11}}},
    "fields": "userEnteredFormat.textFormat"}})
R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 12, "endRowIndex": 13,
    "startColumnIndex": 1, "endColumnIndex": 2},
    "cell": {"userEnteredFormat": {"textFormat": {"bold": True, "fontSize": 12, "foregroundColor": ROJO}}},
    "fields": "userEnteredFormat.textFormat"}})
R.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 15, "endRowIndex": 16,
    "startColumnIndex": 0, "endColumnIndex": 3},
    "cell": {"userEnteredFormat": {"backgroundColor": NAVY, "textFormat": {"bold": True,
        "foregroundColor": BLANCO, "fontSize": 10}, "horizontalAlignment": "CENTER"}},
    "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"}})

r, sid_n = fmt("Leads nuevos", 7, 4, [60, 90, 110, 170, 250, 150, 560], 6); R += r
r, sid_a = fmt("Leads antiguos", 6, 4, [60, 160, 200, 90, 620, 110], 4); R += r
r, sid_t = fmt("Todas las respuestas", 9, 4, [60, 90, 85, 190, 250, 190, 140, 560, 100], 7); R += r

for sid, n in ((sid_n, 7), (sid_a, 6), (sid_t, 9)):
    R.append({"addConditionalFormatRule": {"rule": {
        "ranges": [{"sheetId": sid, "startRowIndex": 4, "startColumnIndex": 0, "endColumnIndex": n}],
        "booleanRule": {"condition": {"type": "CUSTOM_FORMULA",
            "values": [{"userEnteredValue": "=$A5=100"}]},
            "format": {"backgroundColor": ROJOF}}}, "index": 0}})
    R.append({"addConditionalFormatRule": {"rule": {
        "ranges": [{"sheetId": sid, "startRowIndex": 4, "startColumnIndex": 0, "endColumnIndex": 1}],
        "booleanRule": {"condition": {"type": "NUMBER_EQ", "values": [{"userEnteredValue": "0"}]},
            "format": {"textFormat": {"foregroundColor": GRISTX}}}}, "index": 1}})
    R.append({"setBasicFilter": {"filter": {"range": {"sheetId": sid, "startRowIndex": 3,
        "startColumnIndex": 0, "endColumnIndex": n}}}})

sh.spreadsheets().batchUpdate(spreadsheetId=HOJA, body={"requests": R}).execute()
print("hoja actualizada con", len(todas), "respuestas y", len(motor), "del motor")
print("https://docs.google.com/spreadsheets/d/" + HOJA + "/edit")
