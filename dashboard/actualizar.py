#!/usr/bin/env python3
"""
Cuadro de mando de Qualivo. Lee Meta Ads, Smartlead y GoHighLevel y escribe
una fila por día en el Google Sheet financiero.

    export META_TOKEN=... META_AD_ACCOUNT=act_...
    export SMARTLEAD_KEY=... GHL_TOKEN=pit-... GHL_LOCATION=...
    export GOOGLE_SA_JSON=/ruta/service_account.json SHEET_ID=...
    python3 dashboard/actualizar.py [AAAA-MM-DD]

Sin fecha usa ayer, que es el último día cerrado. Es idempotente: si la fila
del día ya existe, la reescribe en vez de duplicarla.

Smartlead y GoHighLevel están detrás de Cloudflare y rechazan clientes sin
User-Agent de navegador (error 1010). Por eso UA va en todas las llamadas.
"""
import os, sys, json, time, base64, ssl, urllib.request, urllib.parse, urllib.error
from datetime import date, timedelta

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/129.0 Safari/537.36")
CTX = ssl.create_default_context()

def GET(url, headers=None, tries=4):
    h = {"User-Agent": UA, "Accept": "application/json"}
    h.update(headers or {})
    for n in range(tries):
        try:
            return json.load(urllib.request.urlopen(
                urllib.request.Request(url, headers=h), timeout=40, context=CTX))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and n < tries - 1:
                time.sleep(2 ** n); continue
            raise
    raise RuntimeError("sin reintentos")

# ---------------------------------------------------------------- Google ----
def sa_token():
    sa = json.load(open(os.environ["GOOGLE_SA_JSON"]))
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding
    def b64(x): return base64.urlsafe_b64encode(x).rstrip(b"=")
    now = int(time.time())
    claim = {"iss": sa["client_email"], "scope": "https://www.googleapis.com/auth/spreadsheets",
             "aud": "https://oauth2.googleapis.com/token", "iat": now, "exp": now + 3500}
    msg = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()) + b"." + b64(json.dumps(claim).encode())
    key = serialization.load_pem_private_key(sa["private_key"].encode(), None)
    jwt = msg + b"." + b64(key.sign(msg, padding.PKCS1v15(), hashes.SHA256()))
    body = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt.decode()}).encode()
    return json.load(urllib.request.urlopen(
        urllib.request.Request("https://oauth2.googleapis.com/token", data=body), context=CTX))["access_token"]

def sheets(method, path, tok, payload=None):
    url = "https://sheets.googleapis.com/v4/spreadsheets/" + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method,
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, context=CTX))

def asegurar_pestanas(sid, tok, tabs):
    hay = {s["properties"]["title"] for s in sheets("GET", sid, tok)["sheets"]}
    faltan = [{"addSheet": {"properties": {"title": t}}} for t in tabs if t not in hay]
    if faltan:
        sheets("POST", sid + ":batchUpdate", tok, {"requests": faltan})

def upsert(sid, tok, tab, cabecera, filas, clave=0):
    """Escribe cabecera si falta y añade filas, reemplazando las de misma clave."""
    rng = urllib.parse.quote(tab + "!A1:Z10000")
    try:
        # UNFORMATTED_VALUE: si se leen formateados, al reescribirlos vuelven como
        # texto y SUM deja de contarlos. Es el fallo clasico de este patron.
        prev = sheets("GET", sid + "/values/" + rng + "?valueRenderOption=UNFORMATTED_VALUE",
                      tok).get("values", [])
    except urllib.error.HTTPError:
        prev = []
    nuevas = {tuple(str(f[clave]) for _ in [0]) for f in filas}
    cuerpo = [r for r in prev[1:] if r and (str(r[clave]),) not in nuevas]
    # OJO: los numeros se escriben como numeros. Si van como texto, una hoja con
    # locale espanol lee "17.08" como la fecha 17 de agosto y el total se dispara.
    datos = [cabecera] + cuerpo + [list(f) for f in filas]
    sheets("POST", sid + "/values/" + rng + ":clear", tok, {})
    # RAW y no USER_ENTERED: con locale espanol, USER_ENTERED convierte "19.01"
    # en la fecha 19 de enero. Estas pestanas son datos puros, sin formulas.
    sheets("PUT", sid + "/values/" + urllib.parse.quote(tab + "!A1") + "?valueInputOption=RAW",
           tok, {"values": datos})
    return len(datos) - 1

# ------------------------------------------------------------------ Meta ----
def meta_dia(fecha):
    tok, act = os.environ.get("META_TOKEN"), os.environ.get("META_AD_ACCOUNT")
    if not tok or not act: return []
    q = urllib.parse.urlencode({
        "level": "campaign", "time_range": json.dumps({"since": fecha, "until": fecha}),
        "fields": "campaign_name,spend,impressions,inline_link_clicks,inline_link_click_ctr,cpc,actions",
        "limit": "100", "access_token": tok})
    out = []
    for x in GET(f"https://graph.facebook.com/v21.0/{act}/insights?{q}").get("data", []):
        a = {i["action_type"]: int(i["value"]) for i in x.get("actions", [])}
        gasto = float(x.get("spend", 0) or 0); leads = a.get("lead", 0)
        out.append([fecha, x.get("campaign_name", ""), round(gasto, 2),
                    int(x.get("impressions", 0) or 0), int(x.get("inline_link_clicks", 0) or 0),
                    round(float(x.get("inline_link_click_ctr", 0) or 0), 2),
                    round(float(x.get("cpc", 0) or 0), 2), leads,
                    round(gasto / leads, 2) if leads else ""])
    return out

# ------------------------------------------------------------- Smartlead ----
def smartlead(fecha):
    key = os.environ.get("SMARTLEAD_KEY")
    if not key: return [], None
    base = "https://server.smartlead.ai/api/v1"
    camps = [c for c in GET(f"{base}/campaigns?api_key={key}") if c["status"] in ("ACTIVE", "PAUSED")]
    filas, tot = [], dict(env=0, resp=0, reb=0, camp=0)
    for c in camps:
        try:
            a = GET(f"{base}/campaigns/{c['id']}/analytics?api_key={key}")
        except Exception:
            continue
        env = int(a.get("sent_count") or 0); resp = int(a.get("reply_count") or 0)
        reb = int(a.get("bounce_count") or 0)
        if env == 0: continue
        filas.append([fecha, c["name"], c["status"], env, resp,
                      round(resp * 100 / env, 2) if env else 0, reb])
        tot["env"] += env; tot["resp"] += resp; tot["reb"] += reb; tot["camp"] += 1
    resumen = [fecha, tot["camp"], tot["env"], tot["resp"],
               round(tot["resp"] * 100 / tot["env"], 2) if tot["env"] else 0, tot["reb"]]
    return filas, resumen

# ------------------------------------------------------------------- GHL ----
# Cada etiqueta del cuadro de mando de Maikel, y las etapas de GHL que la alimentan.
EMBUDO = [
    ("Prospectos",        ["Respondió", "Conversación abierta"]),
    ("Leads nuevos",      ["Nuevo Lead"]),
    ("Reuniones agendadas", ["Call agendada", "Call Agendada", "Reunión agendada"]),
    ("Reuniones hechas",  ["Call realizada", "Call Realizada"]),
    ("Seguimiento",       ["Seguimiento", "Tibio", "Más adelante"]),
    ("Propuestas",        ["Propuesta enviada", "Propuesta Enviada", "Oferta enviada"]),
    ("Clientes",          ["Cliente Activo", "Cliente"]),
]

def ghl(fecha):
    tokn, loc = os.environ.get("GHL_TOKEN"), os.environ.get("GHL_LOCATION")
    if not tokn or not loc: return None, []
    h = {"Authorization": "Bearer " + tokn, "Version": "2021-07-28"}
    base = "https://services.leadconnectorhq.com"
    pipes = GET(f"{base}/opportunities/pipelines?locationId={loc}", h)["pipelines"]
    etapa_nombre = {}
    for p in pipes:
        for s in p["stages"]:
            etapa_nombre[s["id"]] = s["name"]
    cuenta, detalle = {}, []
    for p in pipes:
        page, vistos = 1, 0
        while page <= 20:
            q = urllib.parse.urlencode({"location_id": loc, "pipeline_id": p["id"],
                                        "limit": 100, "page": page})
            d = GET(f"{base}/opportunities/search?{q}", h)
            lote = d.get("opportunities", [])
            for o in lote:
                n = etapa_nombre.get(o.get("pipelineStageId"), "?")
                cuenta[n] = cuenta.get(n, 0) + 1
            vistos += len(lote)
            if len(lote) < 100: break
            page += 1
        detalle.append([fecha, p["name"], vistos])
    fila = [fecha] + [sum(cuenta.get(e, 0) for e in etapas) for _, etapas in EMBUDO]
    return fila, detalle

# ------------------------------------------------------------------ main ----
def main():
    fecha = sys.argv[1] if len(sys.argv) > 1 else str(date.today() - timedelta(days=1))
    sid, tok = os.environ["SHEET_ID"], sa_token()
    tabs = ["Paid diario", "Outbound campañas", "Outbound diario", "CRM diario"]
    asegurar_pestanas(sid, tok, tabs)

    paid = meta_dia(fecha)
    upsert(sid, tok, "Paid diario",
           ["Fecha", "Campaña", "Gasto €", "Impresiones", "Clics", "CTR %", "CPC €", "Leads", "CPL €"], paid)

    sl_filas, sl_res = smartlead(fecha)
    upsert(sid, tok, "Outbound campañas",
           ["Fecha", "Campaña", "Estado", "Enviados", "Respuestas", "% respuesta", "Rebotes"], sl_filas)
    if sl_res:
        upsert(sid, tok, "Outbound diario",
               ["Fecha", "Campañas activas", "Enviados", "Respuestas", "% respuesta", "Rebotes"], [sl_res])

    crm, _ = ghl(fecha)
    if crm:
        upsert(sid, tok, "CRM diario", ["Fecha"] + [n for n, _ in EMBUDO], [crm])

    print(f"{fecha} · paid {len(paid)} campañas · outbound {len(sl_filas)} campañas · crm {'ok' if crm else 'sin datos'}")
    if paid:
        g = sum(r[2] for r in paid); l = sum(r[7] for r in paid)
        print(f"  gasto {g:.2f} € · leads {l} · CPL {g/l if l else 0:.2f} €")
    if sl_res:
        print(f"  outbound: {sl_res[2]} enviados · {sl_res[3]} respuestas · {sl_res[4]} %")
    if crm:
        print("  CRM: " + " · ".join(f"{n} {v}" for (n, _), v in zip(EMBUDO, crm[1:])))

if __name__ == "__main__":
    main()
