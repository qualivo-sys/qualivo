#!/usr/bin/env python3
"""
Sincroniza la facturación de Quipu (ingresos y gastos) en un dashboard de
Google Sheets, agregada por mes para los años indicados.

Fuente de datos: API de Quipu  https://getquipu.com/api/invoices
Destino:         Google Sheets (pestaña "Dashboard")

Uso:
    export QUIPU_CLIENT_ID=...          # App ID de Quipu
    export QUIPU_CLIENT_SECRET=...      # App secret de Quipu
    export GOOGLE_SA_JSON=/ruta/service_account.json
    export SHEET_ID=1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0
    python3 sync_quipu_dashboard.py 2025 2026

La cuenta de servicio de Google debe tener el Sheet compartido con permiso
de edición. No se guarda ninguna credencial en el repositorio.
"""
import os, sys, json, time, base64, ssl, urllib.request, urllib.parse
from collections import defaultdict
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

CTX = ssl.create_default_context()
QUIPU_ACCEPT = "application/vnd.quipu.v1+json"


def _urlopen(req, tries=5):
    """urlopen con reintentos exponenciales ante 429/5xx."""
    for n in range(tries):
        try:
            return urllib.request.urlopen(req, context=CTX)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and n < tries - 1:
                time.sleep(2 ** n)
                continue
            raise
MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
       "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]


# --------------------------------------------------------------------------- #
#  Quipu
# --------------------------------------------------------------------------- #
def quipu_token(client_id, client_secret):
    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode(
        {"grant_type": "client_credentials", "scope": "ecommerce"}).encode()
    req = urllib.request.Request(
        "https://getquipu.com/oauth/token", data=body,
        headers={"Authorization": f"Basic {auth}",
                 "Content-Type": "application/x-www-form-urlencoded"})
    return json.load(_urlopen(req))["access_token"]


def quipu_all_invoices(token):
    """Devuelve todas las facturas (income y expenses) paginando la API."""
    out, page = [], 1
    while True:
        url = f"https://getquipu.com/api/invoices?page%5Bnumber%5D={page}"
        req = urllib.request.Request(
            url, headers={"Authorization": f"Bearer {token}",
                          "Accept": QUIPU_ACCEPT})
        d = json.load(_urlopen(req))
        out.extend(d["data"])
        total = d["meta"]["pagination_info"]["total_pages"]
        print(f"  Quipu página {page}/{total}", file=sys.stderr)
        if page >= total:
            break
        page += 1
    return out


def aggregate(invoices):
    """{kind: {'YYYY-MM': {count,total,base,vat,retention}}}"""
    agg = defaultdict(lambda: defaultdict(
        lambda: {"count": 0, "total": 0.0, "base": 0.0,
                 "vat": 0.0, "retention": 0.0}))
    f = lambda x: float(x) if x not in (None, "") else 0.0
    for it in invoices:
        a = it["attributes"]
        date = a.get("issue_date")
        if not date:
            continue
        rec = agg[a.get("kind")][date[:7]]
        rec["count"] += 1
        rec["total"] += f(a.get("total_amount"))
        rec["base"] += f(a.get("total_amount_without_taxes"))
        rec["vat"] += f(a.get("vat_amount"))
        rec["retention"] += f(a.get("retention_amount"))
    return agg


# --------------------------------------------------------------------------- #
#  Google Sheets (service account, sin dependencias externas)
# --------------------------------------------------------------------------- #
def _b64(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=")


def google_token(sa_path):
    d = json.load(open(sa_path))
    now = int(time.time())
    seg = (_b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()) + b"." +
           _b64(json.dumps({
               "iss": d["client_email"],
               "scope": "https://www.googleapis.com/auth/spreadsheets",
               "aud": d["token_uri"], "iat": now, "exp": now + 3600}).encode()))
    key = serialization.load_pem_private_key(
        d["private_key"].encode(), password=None)
    jwt = seg + b"." + _b64(key.sign(seg, padding.PKCS1v15(), hashes.SHA256()))
    body = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt.decode()}).encode()
    req = urllib.request.Request(d["token_uri"], data=body)
    return json.load(_urlopen(req))["access_token"]


def sheets_api(method, path, token, payload=None):
    url = "https://sheets.googleapis.com/v4/spreadsheets/" + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={"Authorization": f"Bearer {token}",
                 "Content-Type": "application/json"})
    return json.load(_urlopen(req))


# --------------------------------------------------------------------------- #
#  Dashboard
# --------------------------------------------------------------------------- #
def rgb(hx):
    hx = hx.lstrip("#")
    return {"red": int(hx[0:2], 16) / 255,
            "green": int(hx[2:4], 16) / 255,
            "blue": int(hx[4:6], 16) / 255}


NAVY, GREEN, RED, BLUE, GREY = "0F2A43", "1E8E5A", "C0392B", "2E6BB8", "6B7280"
LGREEN, LRED, LBLUE, PANEL = "E7F4EC", "FBEAE8", "EAF0FA", "F4F6F8"
EUR = '#,##0.00" €"'


def build_dashboard(sheet_id, sid, token, agg, years):
    """Escribe valores, formato y gráficos. `years` = lista de 2 años."""
    y1, y2 = years
    base = lambda kind, ym: round(agg.get(kind, {}).get(ym, {}).get("base", 0.0), 2)

    def cols(year):
        inc = [base("income", f"{year}-{m:02d}") for m in range(1, 13)]
        exp = [base("expenses", f"{year}-{m:02d}") for m in range(1, 13)]
        ben = [round(i - e, 2) for i, e in zip(inc, exp)]
        return inc, exp, ben

    i1, e1, b1 = cols(y1)
    i2, e2, b2 = cols(y2)
    T = lambda a: round(sum(a), 2)

    # 1) renombrar pestaña ------------------------------------------------- #
    sheets_api("POST", sheet_id + ":batchUpdate", token, {"requests": [
        {"updateSheetProperties": {
            "properties": {"sheetId": sid, "title": "Dashboard"},
            "fields": "title"}},
        {"updateSpreadsheetProperties": {
            "properties": {"locale": "es_ES", "timeZone": "Europe/Madrid"},
            "fields": "locale,timeZone"}}]})

    # 2) valores ----------------------------------------------------------- #
    data = []
    cell = lambda a1, v: data.append({"range": "Dashboard!" + a1, "values": v})
    cell("B2", [["FACTURACIÓN — INGRESOS Y GASTOS"]])
    cell("B3", [[f"Datos en vivo desde Quipu · actualizado {time.strftime('%Y-%m-%d')}"]])
    cell("B5", [["RESUMEN", f"AÑO {y1}", "", "", f"AÑO {y2}", "", ""]])
    cell("B6", [["", "Ingresos", "Gastos", "Beneficio",
                 "Ingresos", "Gastos", "Beneficio"]])
    cell("B7", [["Base imponible (sin IVA)",
                 T(i1), T(e1), T(b1), T(i2), T(e2), T(b2)]])
    mar = lambda b, i: f"{round(b / i * 100, 1)}%" if i else "—"
    cell("B8", [["Margen s/ ingresos", "", "", mar(T(b1), T(i1)),
                 "", "", mar(T(b2), T(i2))]])
    cell("B10", [["Mes", f"Ingresos {y1}", f"Gastos {y1}", f"Beneficio {y1}",
                  f"Ingresos {y2}", f"Gastos {y2}", f"Beneficio {y2}"]])
    cell("B11", [[MES[m], i1[m], e1[m], b1[m], i2[m], e2[m], b2[m]]
                 for m in range(12)])
    cell("B23", [["TOTAL", T(i1), T(e1), T(b1), T(i2), T(e2), T(b2)]])
    cell("B25", [[f"Ingresos vs Gastos por mes — {y1}"]])
    cell("B45", [[f"Ingresos vs Gastos por mes — {y2}"]])
    cell("B65", [["Cifras en base imponible (sin IVA). Fuente: API Quipu "
                  "(kind=income → ingresos, kind=expenses → gastos)."]])
    sheets_api("POST", sheet_id + "/values:batchUpdate", token,
               {"valueInputOption": "USER_ENTERED", "data": data})

    # 3) formato + gráficos (idempotente: borra gráficos previos) ---------- #
    meta = sheets_api("GET", sheet_id + "?fields=sheets(properties.sheetId,charts.chartId)", token)
    reqs = []
    for s in meta["sheets"]:
        if s["properties"]["sheetId"] == sid:
            for ch in s.get("charts", []):
                reqs.append({"deleteEmbeddedObject": {"objectId": ch["chartId"]}})
    reqs += _format_requests(sid)
    reqs.append(_chart(sid, f"Ingresos vs Gastos por mes — {y1}", [2, 3], 25))
    reqs.append(_chart(sid, f"Ingresos vs Gastos por mes — {y2}", [5, 6], 45))
    sheets_api("POST", sheet_id + ":batchUpdate", token, {"requests": reqs})


def _rng(sid, r0, r1, c0, c1):
    return {"sheetId": sid, "startRowIndex": r0, "endRowIndex": r1,
            "startColumnIndex": c0, "endColumnIndex": c1}


def _tf(bold=None, size=None, color=None, italic=None):
    t = {}
    if bold is not None: t["bold"] = bold
    if size is not None: t["fontSize"] = size
    if color is not None: t["foregroundColor"] = rgb(color)
    if italic is not None: t["italic"] = italic
    return t


def _format_requests(sid):
    reqs = []

    def fmt(r0, r1, c0, c1, uf, fields):
        reqs.append({"repeatCell": {
            "range": _rng(sid, r0, r1, c0, c1),
            "cell": {"userEnteredFormat": uf},
            "fields": "userEnteredFormat(" + fields + ")"}})

    def merge(r0, r1, c0, c1):
        reqs.append({"mergeCells": {"range": _rng(sid, r0, r1, c0, c1),
                                    "mergeType": "MERGE_ALL"}})

    def width(c0, c1, px):
        reqs.append({"updateDimensionProperties": {
            "range": {"sheetId": sid, "dimension": "COLUMNS",
                      "startIndex": c0, "endIndex": c1},
            "properties": {"pixelSize": px}, "fields": "pixelSize"}})

    def height(r0, r1, px):
        reqs.append({"updateDimensionProperties": {
            "range": {"sheetId": sid, "dimension": "ROWS",
                      "startIndex": r0, "endIndex": r1},
            "properties": {"pixelSize": px}, "fields": "pixelSize"}})

    width(0, 1, 32); width(1, 2, 200); width(2, 8, 132)
    # título
    merge(1, 2, 1, 8)
    fmt(1, 2, 1, 8, {"backgroundColor": rgb(NAVY), "verticalAlignment": "MIDDLE",
                     "padding": {"left": 12}, "textFormat": _tf(True, 20, "FFFFFF")},
        "backgroundColor,verticalAlignment,padding,textFormat")
    height(1, 2, 44)
    merge(2, 3, 1, 8)
    fmt(2, 3, 1, 8, {"backgroundColor": rgb(NAVY), "padding": {"left": 12},
                     "textFormat": _tf(False, 10, "AFC6DE", True)},
        "backgroundColor,padding,textFormat")
    # KPIs
    merge(4, 5, 2, 5); merge(4, 5, 5, 8)
    fmt(4, 5, 1, 2, {"backgroundColor": rgb(PANEL), "verticalAlignment": "MIDDLE",
                     "textFormat": _tf(True, 9, GREY)},
        "backgroundColor,verticalAlignment,textFormat")
    fmt(4, 5, 2, 5, {"backgroundColor": rgb(GREEN), "horizontalAlignment": "CENTER",
                     "textFormat": _tf(True, 12, "FFFFFF")},
        "backgroundColor,horizontalAlignment,textFormat")
    fmt(4, 5, 5, 8, {"backgroundColor": rgb(BLUE), "horizontalAlignment": "CENTER",
                     "textFormat": _tf(True, 12, "FFFFFF")},
        "backgroundColor,horizontalAlignment,textFormat")
    fmt(5, 6, 1, 2, {"backgroundColor": rgb(PANEL)}, "backgroundColor")
    fmt(5, 6, 2, 8, {"backgroundColor": rgb(PANEL), "horizontalAlignment": "CENTER",
                     "textFormat": _tf(True, 9, GREY)},
        "backgroundColor,horizontalAlignment,textFormat")
    fmt(6, 7, 1, 2, {"backgroundColor": rgb("FFFFFF"), "verticalAlignment": "MIDDLE",
                     "textFormat": _tf(True, 9, GREY)},
        "backgroundColor,verticalAlignment,textFormat")
    fmt(6, 7, 2, 8, {"horizontalAlignment": "CENTER",
                     "numberFormat": {"type": "NUMBER", "pattern": EUR},
                     "textFormat": _tf(True, 13, NAVY)},
        "horizontalAlignment,numberFormat,textFormat")
    fmt(6, 7, 4, 5, {"textFormat": _tf(True, 13, GREEN)}, "textFormat")
    fmt(6, 7, 7, 8, {"textFormat": _tf(True, 13, GREEN)}, "textFormat")
    height(6, 7, 34)
    fmt(7, 8, 1, 2, {"textFormat": _tf(False, 9, GREY)}, "textFormat")
    fmt(7, 8, 2, 8, {"horizontalAlignment": "CENTER",
                     "textFormat": _tf(False, 10, GREY)},
        "horizontalAlignment,textFormat")
    # cabecera tabla
    fmt(9, 10, 1, 8, {"backgroundColor": rgb(NAVY), "horizontalAlignment": "CENTER",
                      "verticalAlignment": "MIDDLE", "wrapStrategy": "WRAP",
                      "textFormat": _tf(True, 10, "FFFFFF")},
        "backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat")
    fmt(9, 10, 1, 2, {"horizontalAlignment": "LEFT", "padding": {"left": 8}},
        "horizontalAlignment,padding")
    height(9, 10, 38)
    # datos
    fmt(10, 22, 1, 2, {"verticalAlignment": "MIDDLE", "padding": {"left": 8},
                       "textFormat": _tf(True, 10, NAVY)},
        "verticalAlignment,padding,textFormat")
    fmt(10, 22, 2, 8, {"numberFormat": {"type": "NUMBER", "pattern": EUR},
                       "horizontalAlignment": "RIGHT",
                       "textFormat": _tf(False, 10, "333333")},
        "numberFormat,horizontalAlignment,textFormat")
    for col, tint in ((2, LGREEN), (3, LRED), (4, LBLUE),
                      (5, LGREEN), (6, LRED), (7, LBLUE)):
        fmt(10, 22, col, col + 1, {"backgroundColor": rgb(tint)}, "backgroundColor")
    # total
    fmt(22, 23, 1, 2, {"backgroundColor": rgb(NAVY), "padding": {"left": 8},
                       "verticalAlignment": "MIDDLE",
                       "textFormat": _tf(True, 10, "FFFFFF")},
        "backgroundColor,padding,verticalAlignment,textFormat")
    fmt(22, 23, 2, 8, {"backgroundColor": rgb("DDE3EA"),
                       "numberFormat": {"type": "NUMBER", "pattern": EUR},
                       "horizontalAlignment": "RIGHT",
                       "textFormat": _tf(True, 10, NAVY)},
        "backgroundColor,numberFormat,horizontalAlignment,textFormat")
    height(22, 23, 30)
    reqs.append({"updateBorders": {
        "range": _rng(sid, 9, 23, 1, 8),
        "top": {"style": "SOLID", "color": rgb(NAVY)},
        "bottom": {"style": "SOLID", "color": rgb(NAVY)},
        "left": {"style": "SOLID", "color": rgb(NAVY)},
        "right": {"style": "SOLID", "color": rgb(NAVY)},
        "innerHorizontal": {"style": "SOLID", "color": rgb("E0E0E0")},
        "innerVertical": {"style": "SOLID", "color": rgb("E0E0E0")}}})
    # títulos de gráficos + pie
    for r in (24, 44):
        merge(r, r + 1, 1, 8)
        fmt(r, r + 1, 1, 8, {"padding": {"left": 4},
                             "textFormat": _tf(True, 12, NAVY)}, "padding,textFormat")
    merge(64, 65, 1, 8)
    fmt(64, 65, 1, 8, {"textFormat": _tf(False, 9, GREY, True)}, "textFormat")
    return reqs


def _chart(sid, title, series_cols, anchor_row):
    domain = {"domain": {"sourceRange": {"sources": [_rng(sid, 9, 22, 1, 2)]}}}
    colors = [GREEN, RED]
    series = [{"series": {"sourceRange": {"sources": [_rng(sid, 9, 22, c, c + 1)]}},
               "targetAxis": "LEFT_AXIS", "color": rgb(col)}
              for c, col in zip(series_cols, colors)]
    return {"addChart": {"chart": {
        "spec": {"title": title,
                 "titleTextFormat": {"bold": True, "fontSize": 12},
                 "basicChart": {"chartType": "COLUMN",
                                "legendPosition": "BOTTOM_LEGEND", "headerCount": 1,
                                "axis": [{"position": "BOTTOM_AXIS"},
                                         {"position": "LEFT_AXIS",
                                          "title": "€ (base sin IVA)"}],
                                "domains": [domain], "series": series}},
        "position": {"overlayPosition": {
            "anchorCell": {"sheetId": sid, "rowIndex": anchor_row,
                           "columnIndex": 1},
            "widthPixels": 720, "heightPixels": 360}}}}}


# --------------------------------------------------------------------------- #
def main():
    years = [int(y) for y in sys.argv[1:]] or [2025, 2026]
    if len(years) != 2:
        sys.exit("Indica exactamente dos años, p.ej.: python3 sync_quipu_dashboard.py 2025 2026")
    cid = os.environ["QUIPU_CLIENT_ID"]
    csec = os.environ["QUIPU_CLIENT_SECRET"]
    sa = os.environ["GOOGLE_SA_JSON"]
    sheet_id = os.environ["SHEET_ID"]

    print("Conectando con Quipu…", file=sys.stderr)
    inv = quipu_all_invoices(quipu_token(cid, csec))
    print(f"  {len(inv)} facturas descargadas", file=sys.stderr)
    agg = aggregate(inv)

    print("Construyendo dashboard en Google Sheets…", file=sys.stderr)
    gtok = google_token(sa)
    meta = sheets_api("GET", sheet_id + "?fields=sheets.properties", gtok)
    sid = meta["sheets"][0]["properties"]["sheetId"]
    build_dashboard(sheet_id, sid, gtok, agg, years)
    print(f"Listo → https://docs.google.com/spreadsheets/d/{sheet_id}/edit")


if __name__ == "__main__":
    main()
