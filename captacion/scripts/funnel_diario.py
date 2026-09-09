#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Embudo diario multicanal de Qualivo: junta Smartlead (email frio), GHL
# (WhatsApp, pipeline, reuniones), Vapi (voz) y HeyReach (LinkedIn) en un CSV
# acumulado + snapshot del pipeline, y imprime el reporte limpio con vistas
# DIARIA / SEMANA / MES para el email automatico y el Sheet.
# Uso: SP=<scratchpad> python3 funnel_diario.py [YYYY-MM-DD]
# Claves que lee del scratchpad: .smartlead_key .ghl_key .ghl_loc .vapi_key
# (.heyreach_key opcional). Escribe: captacion/datos/funnel-diario.csv y
# captacion/datos/embudo-ghl.csv (relativos a la raiz del repo).
import json, sys, os, csv, subprocess, urllib.request, datetime, zoneinfo, collections

SP = os.environ.get("SP", "")
TZ = zoneinfo.ZoneInfo("Europe/Madrid")
HOY = sys.argv[1] if len(sys.argv) > 1 else datetime.datetime.now(TZ).date().isoformat()
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
CSV_FUNNEL = os.path.join(RAIZ, "captacion", "datos", "funnel-diario.csv")
CSV_EMBUDO = os.path.join(RAIZ, "captacion", "datos", "embudo-ghl.csv")
CSV_CAMPS = os.path.join(RAIZ, "captacion", "datos", "campanas-diario.csv")
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126"}
COLS = ["fecha", "canal", "volumen", "aperturas", "clics", "respuestas",
        "conversaciones", "reuniones", "notas"]

def clave(f):
    p = os.path.join(SP, f)
    return open(p).read().strip() if os.path.exists(p) else ""

def req(u, headers=None, method="GET", body=None):
    h = dict(UA); h.update(headers or {})
    r = urllib.request.Request(u, headers=h, method=method,
                               data=json.dumps(body).encode() if body else None)
    return json.loads(urllib.request.urlopen(r, timeout=60).read())

def curl(u, headers):
    cmd = ["curl", "-s", "--max-time", "60", "-A", UA["User-Agent"], u]
    for k, v in headers.items(): cmd += ["-H", f"{k}: {v}"]
    return json.loads(subprocess.run(cmd, capture_output=True).stdout)

# --- 1. EMAIL FRIO (Smartlead) ------------------------------------------------
def email_frio():
    KEY = clave(".smartlead_key")
    n = collections.Counter(); deposito = 0; por_camp = []
    camps = req(f"https://server.smartlead.ai/api/v1/campaigns?api_key={KEY}")
    for c in camps:
        if c["status"] != "ACTIVE" and HOY != datetime.datetime.now(TZ).date().isoformat():
            continue
        off = 0; k = collections.Counter()
        while True:
            d = req(f"https://server.smartlead.ai/api/v1/campaigns/{c['id']}/statistics?api_key={KEY}&offset={off}&limit=500")
            rows = d.get("data") or []
            for r in rows:
                if (r.get("sent_time") or "")[:10] == HOY:
                    k["env"] += 1
                    if r.get("is_bounced"): k["reb"] += 1
                if (r.get("open_time") or "")[:10] == HOY and (r.get("open_count") or 0): k["ap"] += 1
                if (r.get("click_time") or "")[:10] == HOY and (r.get("click_count") or 0): k["clic"] += 1
                if (r.get("reply_time") or "")[:10] == HOY: k["resp"] += 1
            if len(rows) < 500: break
            off += 500
        n.update(k)
        dep = ""
        if c["status"] == "ACTIVE":
            a = req(f"https://server.smartlead.ai/api/v1/campaigns/{c['id']}/analytics?api_key={KEY}")
            dep = int((a.get("campaign_lead_stats") or {}).get("notStarted") or 0)
            deposito += dep
        if sum(k.values()) or c["status"] == "ACTIVE":
            por_camp.append([HOY, c["name"][:45], c["status"], k["env"], k["ap"], k["clic"],
                             k["resp"], k["reb"], dep])
    hist = []
    if os.path.exists(CSV_CAMPS):
        hist = [r for r in csv.reader(open(CSV_CAMPS)) if r and r[0] not in ("fecha", HOY)]
    with open(CSV_CAMPS, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["fecha", "campana", "estado", "enviados", "aperturas", "clics",
                    "respuestas", "rebotes", "deposito_sin_empezar"])
        for r in hist + por_camp: w.writerow(r)
    print("== CAMPAÑAS HOY (env/ap/clic/resp/reb | deposito) ==")
    for r in sorted(por_camp, key=lambda x: -x[3]):
        print(f"{r[1]:46} {r[2]:9} {r[3]:>4} {r[4]:>4} {r[5]:>4} {r[6]:>4} {r[7]:>4} | {r[8]}")
    return dict(canal="email-frio", volumen=n["env"], aperturas=n["ap"], clics=n["clic"],
                respuestas=n["resp"], conversaciones="", reuniones="",
                notas=f"deposito sin empezar: {deposito}")

# --- 2. WHATSAPP (GHL) --------------------------------------------------------
def whatsapp():
    GK, LOC = clave(".ghl_key"), clave(".ghl_loc")
    H = {"Authorization": "Bearer " + GK, "Version": "2021-07-28"}
    enviados = recibidos = convs = 0
    d = curl(f"https://services.leadconnectorhq.com/conversations/search?locationId={LOC}&limit=100", H)
    for c in d.get("conversations", []):
        ts = c.get("lastMessageDate")
        fecha = datetime.datetime.fromtimestamp(ts / 1000, TZ).date().isoformat() if ts else ""
        if c.get("lastMessageType") != "TYPE_WHATSAPP" or fecha != HOY:
            continue
        convs += 1
        m = curl(f"https://services.leadconnectorhq.com/conversations/{c['id']}/messages", H)
        msgs = m.get("messages", {})
        msgs = msgs.get("messages") if isinstance(msgs, dict) else msgs
        for x in msgs or []:
            if x.get("messageType") != "TYPE_WHATSAPP": continue
            f = (x.get("dateAdded") or "")[:10]
            if f != HOY: continue
            if x.get("direction") == "inbound": recibidos += 1
            elif x.get("status") not in ("failed",): enviados += 1
    return dict(canal="whatsapp", volumen=enviados, aperturas="", clics="",
                respuestas=recibidos, conversaciones=convs, reuniones="", notas="")

# --- 3. VOZ (Vapi) ------------------------------------------------------------
def voz():
    VK = clave(".vapi_key")
    llamadas = contestadas = agendadas = 0
    d = curl("https://api.vapi.ai/call?limit=100", {"Authorization": "Bearer " + VK})
    for c in d if isinstance(d, list) else []:
        if (c.get("createdAt") or "")[:10] != HOY: continue
        if (c.get("assistantOverrides") or {}).get("metadata", {}).get("prueba"): continue
        llamadas += 1
        if c.get("endedReason") == "customer-ended-call" or (c.get("startedAt") and c.get("endedAt")):
            contestadas += 1
        if "agendar" in json.dumps(c.get("messages") or []):
            agendadas += 1
    return dict(canal="voz", volumen=llamadas, aperturas="", clics="", respuestas="",
                conversaciones=contestadas, reuniones=agendadas, notas="sin contar pruebas")

# --- 4. LINKEDIN (HeyReach) ---------------------------------------------------
def linkedin():
    HK = clave(".heyreach_key")
    try:
        d = req("https://api.heyreach.io/api/public/stats/GetOverallStats",
                headers={"X-API-KEY": HK, "Content-Type": "application/json"},
                method="POST", body={"accountIds": [], "campaignIds": [],
                                     "startDate": HOY + "T00:00:00Z", "endDate": HOY + "T23:59:59Z"})
        t = d.get("byDayStats") or {}
        tot = collections.Counter()
        for v in t.values():
            for k in ("connectionsSent", "messagesSent", "messageReplies", "inMailReplies"):
                tot[k] += v.get(k) or 0
        return dict(canal="linkedin", volumen=tot["connectionsSent"] + tot["messagesSent"],
                    aperturas="", clics="", respuestas=tot["messageReplies"] + tot["inMailReplies"],
                    conversaciones="", reuniones="", notas="")
    except Exception as e:
        return dict(canal="linkedin", volumen="", aperturas="", clics="", respuestas="",
                    conversaciones="", reuniones="", notas=f"sin datos ({type(e).__name__})")

# --- 5. RADIOGRAFIAS (GHL tags, las monta Landing) ----------------------------
def radiografias():
    GK, LOC = clave(".ghl_key"), clave(".ghl_loc")
    try:
        d = req("https://services.leadconnectorhq.com/contacts/search",
                headers={"Authorization": "Bearer " + GK, "Version": "2021-07-28",
                         "Content-Type": "application/json"}, method="POST",
                body={"locationId": LOC, "pageLimit": 1,
                      "filters": [{"field": "tags", "operator": "contains", "value": "diagnostico-completo"},
                                  {"field": "dateAdded", "operator": "range",
                                   "value": {"gte": HOY + "T00:00:00Z", "lte": HOY + "T23:59:59Z"}}]})
        n = d.get("total") or 0
    except Exception:
        n = ""
    return dict(canal="radiografia", volumen=n, aperturas="", clics="", respuestas="",
                conversaciones="", reuniones="", notas="tag diagnostico-completo (Landing)")

# --- 5b. WEB/BLOG (lo publica Landing en su rama: captacion/datos/web-diario.csv
#         con columnas fecha,visitas,visitas_blog,leads,radiografias,fuente_top) --
def web_blog():
    try:
        subprocess.run(["git", "fetch", "origin", "claude/qualivo-landing-vercel-nubk1i"],
                       capture_output=True, timeout=60, cwd=RAIZ)
        raw = subprocess.run(["git", "show",
                              "origin/claude/qualivo-landing-vercel-nubk1i:captacion/datos/web-diario.csv"],
                             capture_output=True, timeout=30, cwd=RAIZ).stdout.decode()
        for r in csv.DictReader(raw.splitlines()):
            if r.get("fecha") == HOY:
                return dict(canal="web-blog", volumen=r.get("visitas") or "",
                            aperturas=r.get("visitas_blog") or "", clics="",
                            respuestas=r.get("leads") or "",
                            conversaciones=r.get("radiografias") or "", reuniones="",
                            notas=f"fuente top: {r.get('fuente_top','')} (datos de Landing)")
    except Exception:
        pass
    return dict(canal="web-blog", volumen="", aperturas="", clics="", respuestas="",
                conversaciones="", reuniones="", notas="pendiente de que Landing publique web-diario.csv")

# --- 6. REUNIONES (calendario GHL) --------------------------------------------
def reuniones_hoy():
    GK, LOC, CAL = clave(".ghl_key"), clave(".ghl_loc"), clave(".ghl_calendar")
    ini = int(datetime.datetime.fromisoformat(HOY + "T00:00:00").replace(tzinfo=TZ).timestamp() * 1000)
    fin = ini + 86400000
    try:
        d = curl(f"https://services.leadconnectorhq.com/calendars/events?locationId={LOC}&calendarId={CAL}&startTime={ini}&endTime={fin}",
                 {"Authorization": "Bearer " + clave(".ghl_key"), "Version": "2021-07-28"})
        return len(d.get("events") or [])
    except Exception:
        return ""

# --- 7. EMBUDO GHL (snapshot de etapas) ---------------------------------------
def embudo():
    GK, LOC = clave(".ghl_key"), clave(".ghl_loc")
    H = {"Authorization": "Bearer " + GK, "Version": "2021-07-28"}
    pipes = curl(f"https://services.leadconnectorhq.com/opportunities/pipelines?locationId={LOC}", H)
    nombres = {}
    for p in pipes.get("pipelines", []):
        for s in p.get("stages", []):
            nombres[s["id"]] = (p["name"], s["name"])
    ops, cuenta, valor = [], collections.Counter(), collections.Counter()
    url = f"https://services.leadconnectorhq.com/opportunities/search?location_id={LOC}&limit=100"
    d = curl(url, H)
    for o in d.get("opportunities", []):
        pipa, etapa = nombres.get(o.get("pipelineStageId"), ("?", "?"))
        if o.get("status") in ("won", "lost", "abandoned"): etapa += f" ({o['status']})"
        cuenta[(pipa, etapa)] += 1
        valor[(pipa, etapa)] += o.get("monetaryValue") or 0
    return cuenta, valor

# --- CSV + agregados ----------------------------------------------------------
def guardar(filas):
    hist = []
    if os.path.exists(CSV_FUNNEL):
        hist = [r for r in csv.DictReader(open(CSV_FUNNEL)) if r["fecha"] != HOY]
    with open(CSV_FUNNEL, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        for r in hist + filas: w.writerow(r)
    return hist + filas

def agrega(todas, desde):
    tot = collections.defaultdict(collections.Counter)
    for r in todas:
        if r["fecha"] < desde or r["fecha"] > HOY: continue
        for k in ("volumen", "aperturas", "clics", "respuestas", "conversaciones", "reuniones"):
            v = r.get(k) or ""
            if str(v).isdigit(): tot[r["canal"]][k] += int(v)
    return tot

def tabla(tot, titulo):
    out = [f"\n== {titulo} =="]
    out.append(f"{'canal':12} {'vol':>5} {'aper':>5} {'clic':>5} {'resp':>5} {'conv':>5} {'reun':>5}")
    for canal in ("email-frio", "whatsapp", "voz", "linkedin", "radiografia", "web-blog"):
        n = tot.get(canal, {})
        out.append(f"{canal:12} {n.get('volumen',0):>5} {n.get('aperturas',0):>5} {n.get('clics',0):>5} "
                   f"{n.get('respuestas',0):>5} {n.get('conversaciones',0):>5} {n.get('reuniones',0):>5}")
    return "\n".join(out)

if __name__ == "__main__":
    filas = []
    for fn in (email_frio, whatsapp, voz, linkedin, radiografias, web_blog):
        try:
            r = fn(); r["fecha"] = HOY; filas.append(r)
        except Exception as e:
            filas.append(dict(fecha=HOY, canal=fn.__name__, volumen="", aperturas="", clics="",
                              respuestas="", conversaciones="", reuniones="", notas=f"ERROR {e}"))
    todas = guardar(filas)

    cuenta, valor = embudo()
    hist_e = []
    if os.path.exists(CSV_EMBUDO):
        hist_e = [r for r in csv.reader(open(CSV_EMBUDO)) if r and r[0] not in ("fecha", HOY)]
    with open(CSV_EMBUDO, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["fecha", "pipeline", "etapa", "oportunidades", "valor_eur"])
        for r in hist_e: w.writerow(r)
        for (p, e), n in sorted(cuenta.items()):
            w.writerow([HOY, p, e, n, valor[(p, e)]])

    lunes = (datetime.date.fromisoformat(HOY) - datetime.timedelta(days=datetime.date.fromisoformat(HOY).weekday())).isoformat()
    mes = HOY[:8] + "01"
    print(f"EMBUDO QUALIVO · {HOY}")
    print(tabla(agrega(todas, HOY), "DIARIA (hoy)"))
    print(tabla(agrega(todas, lunes), f"SEMANA (desde {lunes})"))
    print(tabla(agrega(todas, mes), f"MES (desde {mes})"))
    print("\n== PIPELINE GHL (foto de hoy) ==")
    for (p, e), n in sorted(cuenta.items()):
        v = f" · {valor[(p,e)]:.0f}€" if valor[(p, e)] else ""
        print(f"{p:18} | {e:28} | {n:>3}{v}")
    r = reuniones_hoy()
    print(f"\nReuniones en calendario hoy: {r}")
    for f_ in filas:
        if f_.get("notas"): print(f"nota {f_['canal']}: {f_['notas']}")
