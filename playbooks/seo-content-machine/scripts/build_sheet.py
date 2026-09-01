#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Crea y rellena el Google Sheet de mando de la máquina SEO.

Pestañas: "Keywords & Contenido" (maestro), "GSC en vivo", "Oportunidades", "Visibilidad IA (LLM)".
Lee los artículos publicados en PUBLIC_DIR, los cruza con Search Console (últimos 90d) y escribe todo.

Entorno requerido: SHEET_ID, PUBLIC_DIR, BASE_URL, SITE_DOMAIN, GOOGLE_SA_JSON.
"""
import gauth, glob, os, re, datetime, urllib.parse

SHEET = os.environ["SHEET_ID"]
PUB = os.environ.get("PUBLIC_DIR", "./public")
BASE = os.environ.get("BASE_URL", "").rstrip("/")
DOMAIN = os.environ["SITE_DOMAIN"]

t = gauth.get_token(["https://www.googleapis.com/auth/spreadsheets",
                     "https://www.googleapis.com/auth/webmasters.readonly"])


# ---------- 1) Leer nuestro contenido ----------
def grab(html, tag):
    m = re.search(r"<%s[^>]*>(.*?)</%s>" % (tag, tag), html, re.S)
    return re.sub("<[^>]+>", "", m.group(1)).strip() if m else ""


arts = []
for p in sorted(glob.glob(PUB + "/*.html")):
    name = os.path.basename(p)[:-5]
    html = open(p, encoding="utf-8").read()
    h1 = grab(html, "h1") or name
    m = re.search(r'class="eyebrow"[^>]*>(.*?)</span>', html, re.S)
    eb = re.sub("<[^>]+>", "", m.group(1)).strip() if m else ""
    url = BASE + "/" if name == "index" else BASE + "/" + name
    arts.append({"slug": name, "h1": h1, "cat": eb.split("·")[0].strip() or "—", "url": url})

# ---------- 2) GSC (90d) por página y por query ----------
site = "sc-domain:" + DOMAIN
gu = "https://www.googleapis.com/webmasters/v3/sites/%s/searchAnalytics/query" % urllib.parse.quote(site, safe="")
end = datetime.date.today().isoformat()
start = (datetime.date.today() - datetime.timedelta(days=90)).isoformat()
pg = gauth.api("POST", gu, t, {"startDate": start, "endDate": end, "dimensions": ["page"], "rowLimit": 1000})
qy = gauth.api("POST", gu, t, {"startDate": start, "endDate": end, "dimensions": ["query"], "rowLimit": 1000})
page_map = {r["keys"][0].rstrip("/"): r for r in pg.get("rows", [])}
queries = qy.get("rows", [])


def cat_intent(c):
    c = c.lower()
    if "local" in c or "formaci" in c or "titula" in c:
        return "Comercial"
    if "negocio" in c:
        return "Comercial/Info"
    if "tendencia" in c or "temporada" in c:
        return "Informacional"
    return "Informacional"


# ---------- 3) Filas del maestro ----------
header = ["Keyword / Tema", "Categoría", "Intención", "URL del artículo", "Estado",
          "Volumen (DinoRank)", "Pos. media (GSC 90d)", "Clics (90d)", "Impresiones (90d)", "Prioridad", "Notas"]
rows = [header]
for a in sorted(arts, key=lambda x: x["cat"]):
    g = page_map.get(a["url"].rstrip("/"))
    pos = round(g["position"], 1) if g else ""
    clk = g["clicks"] if g else ""
    imp = g["impressions"] if g else ""
    rows.append([a["h1"], a["cat"], cat_intent(a["cat"]), a["url"], "Publicado", "", pos, clk, imp,
                 "🟢 Normal", "" if g else "sin datos GSC aún (recién publicado)"])

# ---------- 4) GSC en vivo (top consultas) ----------
gsc_rows = [["Consulta (Search Console)", "Clics", "Impresiones", "CTR %", "Pos. media"]]
for r in sorted(queries, key=lambda x: -x["impressions"])[:100]:
    gsc_rows.append([r["keys"][0], r["clicks"], r["impressions"], round(r["ctr"] * 100, 1), round(r["position"], 1)])
if len(gsc_rows) == 1:
    gsc_rows.append(["(sin datos todavía — el dominio es nuevo)", "", "", "", ""])

# ---------- 5) Oportunidades (placeholder; dino_enrich.py la rellena con datos reales) ----------
opp = [["Keyword oportunidad", "Categoría", "Intención", "Por qué / origen", "Prioridad", "Estado"]]

# ---------- 6) Visibilidad IA (LLM) ----------
llm = [["Prompt de prueba (ChatGPT/Perplexity/Gemini)", "¿Nos cita? (sí/no)", "Fecha check", "Notas"]]

# ---------- Crear/renombrar pestañas ----------
meta = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s?fields=sheets.properties" % SHEET, t)
existing = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
first_id = list(existing.values())[0]
want = ["Keywords & Contenido", "GSC en vivo", "Oportunidades", "Visibilidad IA (LLM)"]
reqs = [{"updateSheetProperties": {"properties": {"sheetId": first_id, "title": want[0]}, "fields": "title"}}]
for name in want[1:]:
    if name not in existing:
        reqs.append({"addSheet": {"properties": {"title": name}}})
res = gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s:batchUpdate" % SHEET, t, {"requests": reqs})
ids = {want[0]: first_id}
for rep in res.get("replies", []):
    if "addSheet" in rep:
        ids[rep["addSheet"]["properties"]["title"]] = rep["addSheet"]["properties"]["sheetId"]
meta2 = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s?fields=sheets.properties" % SHEET, t)
for s in meta2["sheets"]:
    ids[s["properties"]["title"]] = s["properties"]["sheetId"]


# ---------- Escribir valores ----------
def write(tab, data):
    rng = "%s!A1" % tab.replace("'", "")
    u = "https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s?valueInputOption=RAW" % (SHEET, urllib.parse.quote(rng))
    r = gauth.api("PUT", u, t, {"values": data})
    print("  ", tab, "→", "OK" if not r.get("_error") else r)


write("Keywords & Contenido", rows)
write("GSC en vivo", gsc_rows)
write("Oportunidades", opp)
write("Visibilidad IA (LLM)", llm)

# ---------- Formato (cabecera negrita + congelar fila 1) ----------
fmt = []
for name, sid in ids.items():
    if name not in want:
        continue
    fmt.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 0, "endRowIndex": 1},
        "cell": {"userEnteredFormat": {"textFormat": {"bold": True}, "backgroundColor": {"red": 0.99, "green": 0.89, "blue": 0.93}}},
        "fields": "userEnteredFormat.textFormat,userEnteredFormat.backgroundColor"}})
    fmt.append({"updateSheetProperties": {"properties": {"sheetId": sid, "gridProperties": {"frozenRowCount": 1}}, "fields": "gridProperties.frozenRowCount"}})
gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s:batchUpdate" % SHEET, t, {"requests": fmt})
print("Listo. Artículos:", len(arts), "| consultas GSC:", len(queries))
