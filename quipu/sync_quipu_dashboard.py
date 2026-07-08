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


def _dup_key(a):
    """Clave de duplicado exacto de una factura.

    Incluye el número de factura: dos facturas con números distintos NUNCA
    son duplicados (aunque coincidan cliente, fecha e importe). Solo se
    consideran duplicados los registros idénticos, incluido el número
    (o ambos sin número, típico de facturas de gasto)."""
    f = lambda x: float(x) if x not in (None, "") else 0.0
    return (a.get("kind"), a.get("issuing_tax_id"), a.get("recipient_tax_id"),
            a.get("number"), a.get("issue_date"),
            round(f(a.get("total_amount_without_taxes")), 2),
            round(f(a.get("total_amount")), 2), tuple(a.get("concepts") or []))


def aggregate(invoices):
    """{kind: {'YYYY-MM': {count,total,base,vat,retention}}}
    Elimina facturas duplicadas exactas antes de sumar."""
    agg = defaultdict(lambda: defaultdict(
        lambda: {"count": 0, "total": 0.0, "base": 0.0,
                 "vat": 0.0, "retention": 0.0}))
    f = lambda x: float(x) if x not in (None, "") else 0.0
    seen = set()
    for it in invoices:
        a = it["attributes"]
        date = a.get("issue_date")
        if not date:
            continue
        k = _dup_key(a)
        if k in seen:
            continue
        seen.add(k)
        rec = agg[a.get("kind")][date[:7]]
        rec["count"] += 1
        rec["total"] += f(a.get("total_amount"))
        rec["base"] += f(a.get("total_amount_without_taxes"))
        rec["vat"] += f(a.get("vat_amount"))
        rec["retention"] += f(a.get("retention_amount"))
    return agg


def clients_per_month(invoices):
    """Clientes distintos por mes a partir de facturas emitidas (kind=income).
    Dedup por NIF; si falta, por id de contacto; si no, por nombre.
    Devuelve {'YYYY-MM': n_clientes, 'YYYY': n_unicos_del_anyo}."""
    month = defaultdict(set)
    year = defaultdict(set)
    for it in invoices:
        a = it["attributes"]
        if a.get("kind") != "income":
            continue
        date = a.get("issue_date")
        if not date:
            continue
        rel = it.get("relationships", {})
        key = ((a.get("recipient_tax_id") or "").strip().upper()
               or ((rel.get("contact", {}).get("data") or {}).get("id"))
               or (a.get("recipient_name") or "").strip().upper())
        month[date[:7]].add(key)
        year[date[:4]].add(key)
    out = {ym: len(s) for ym, s in month.items()}
    out.update({y: len(s) for y, s in year.items()})
    return out


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


def build_dashboard(sheet_id, sid, token, agg, clients, years):
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
    c1 = [clients.get(f"{y1}-{m:02d}", 0) for m in range(1, 13)]
    c2 = [clients.get(f"{y2}-{m:02d}", 0) for m in range(1, 13)]
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
    # --- clientes activos por mes ---
    cell("B66", [["CLIENTES ACTIVOS POR MES (facturas emitidas)"]])
    cell("B67", [["Mes", f"Clientes {y1}", f"Clientes {y2}"]])
    cell("B68", [[MES[m], c1[m], c2[m]] for m in range(12)])
    cell("B80", [["Clientes únicos en el año",
                  clients.get(str(y1), 0), clients.get(str(y2), 0)]])
    cell("B95", [["Cifras en base imponible (sin IVA). Clientes = destinatarios "
                  "distintos de facturas emitidas (dedup por NIF). Fuente: API Quipu."]])
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
    reqs.append(_chart_clients(sid, "Clientes activos por mes"))
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
    # títulos de gráficos
    for r in (24, 44):
        merge(r, r + 1, 1, 8)
        fmt(r, r + 1, 1, 8, {"padding": {"left": 4},
                             "textFormat": _tf(True, 12, NAVY)}, "padding,textFormat")
    # sección clientes (título row65, cabecera row66, datos 67..78, total row79)
    merge(65, 66, 1, 8)
    fmt(65, 66, 1, 8, {"padding": {"left": 4},
                       "textFormat": _tf(True, 12, NAVY)}, "padding,textFormat")
    fmt(66, 67, 1, 4, {"backgroundColor": rgb(NAVY), "horizontalAlignment": "CENTER",
                       "verticalAlignment": "MIDDLE", "textFormat": _tf(True, 10, "FFFFFF")},
        "backgroundColor,horizontalAlignment,verticalAlignment,textFormat")
    fmt(66, 67, 1, 2, {"horizontalAlignment": "LEFT", "padding": {"left": 8}},
        "horizontalAlignment,padding")
    fmt(67, 79, 1, 2, {"verticalAlignment": "MIDDLE", "padding": {"left": 8},
                       "textFormat": _tf(True, 10, NAVY)},
        "verticalAlignment,padding,textFormat")
    fmt(67, 79, 2, 4, {"horizontalAlignment": "CENTER",
                       "textFormat": _tf(False, 10, "333333")},
        "horizontalAlignment,textFormat")
    fmt(67, 79, 2, 3, {"backgroundColor": rgb(LGREEN)}, "backgroundColor")
    fmt(67, 79, 3, 4, {"backgroundColor": rgb(LBLUE)}, "backgroundColor")
    fmt(79, 80, 1, 2, {"backgroundColor": rgb(NAVY), "padding": {"left": 8},
                       "verticalAlignment": "MIDDLE", "textFormat": _tf(True, 10, "FFFFFF")},
        "backgroundColor,padding,verticalAlignment,textFormat")
    fmt(79, 80, 2, 4, {"backgroundColor": rgb("DDE3EA"), "horizontalAlignment": "CENTER",
                       "textFormat": _tf(True, 10, NAVY)},
        "backgroundColor,horizontalAlignment,textFormat")
    reqs.append({"updateBorders": {
        "range": _rng(sid, 66, 80, 1, 4),
        "top": {"style": "SOLID", "color": rgb(NAVY)},
        "bottom": {"style": "SOLID", "color": rgb(NAVY)},
        "left": {"style": "SOLID", "color": rgb(NAVY)},
        "right": {"style": "SOLID", "color": rgb(NAVY)},
        "innerHorizontal": {"style": "SOLID", "color": rgb("E0E0E0")},
        "innerVertical": {"style": "SOLID", "color": rgb("E0E0E0")}}})
    # pie (row94)
    merge(94, 95, 1, 8)
    fmt(94, 95, 1, 8, {"textFormat": _tf(False, 9, GREY, True)}, "textFormat")
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


def _chart_clients(sid, title):
    """Gráfico de líneas: clientes activos por mes (tabla filas 66..78)."""
    domain = {"domain": {"sourceRange": {"sources": [_rng(sid, 66, 79, 1, 2)]}}}
    series = [{"series": {"sourceRange": {"sources": [_rng(sid, 66, 79, c, c + 1)]}},
               "targetAxis": "LEFT_AXIS", "color": rgb(col)}
              for c, col in ((2, GREEN), (3, BLUE))]
    return {"addChart": {"chart": {
        "spec": {"title": title,
                 "titleTextFormat": {"bold": True, "fontSize": 12},
                 "basicChart": {"chartType": "LINE", "lineSmoothing": False,
                                "legendPosition": "BOTTOM_LEGEND", "headerCount": 1,
                                "axis": [{"position": "BOTTOM_AXIS"},
                                         {"position": "LEFT_AXIS", "title": "nº clientes"}],
                                "domains": [domain], "series": series}},
        "position": {"overlayPosition": {
            "anchorCell": {"sheetId": sid, "rowIndex": 66, "columnIndex": 5},
            "widthPixels": 560, "heightPixels": 300}}}}}


# --------------------------------------------------------------------------- #
#  Pestaña "Gastos por proveedor"
# --------------------------------------------------------------------------- #
def expenses_by_provider(invoices, year):
    """Gasto por proveedor de un año, eliminando facturas duplicadas.

    Un duplicado exacto = misma (NIF emisor, fecha, importe, concepto);
    se cuenta una sola vez tanto en importe como en nº de facturas.

    Devuelve (rows, dups_eliminados) donde cada row es
    (proveedor, n_facturas, [12 importes mensuales], total)."""
    f = lambda x: float(x) if x not in (None, "") else 0.0
    prov, seen, dups = {}, set(), 0
    for it in invoices:
        a = it["attributes"]
        d = a.get("issue_date") or ""
        if a.get("kind") != "expenses" or not d.startswith(str(year)):
            continue
        base = round(f(a.get("total_amount_without_taxes")), 2)
        dk = _dup_key(a)
        if dk in seen:
            dups += 1
            continue
        seen.add(dk)
        key = (a.get("issuing_tax_id") or "").strip().upper() \
            or (a.get("issuing_name") or "?").strip().upper()
        name = (a.get("issuing_name") or "¿Sin nombre?").strip()
        rec = prov.setdefault(key, {"name": name, "m": [0.0] * 12, "n": 0})
        rec["m"][int(d[5:7]) - 1] += base
        rec["n"] += 1
    rows = [(v["name"], v["n"], [round(x, 2) for x in v["m"]], round(sum(v["m"]), 2))
            for v in prov.values()]
    rows.sort(key=lambda r: -r[3])
    return rows, dups


def _get_or_create_tab(sheet_id, token, title):
    meta = sheets_api("GET", sheet_id +
                      "?fields=sheets(properties.sheetId,properties.title,charts.chartId,"
                      "conditionalFormats)", token)
    for s in meta["sheets"]:
        if s["properties"]["title"] == title:
            sid = s["properties"]["sheetId"]
            reqs = [{"deleteEmbeddedObject": {"objectId": c["chartId"]}}
                    for c in s.get("charts", [])]
            # borrar reglas de formato condicional (en orden inverso)
            for i in range(len(s.get("conditionalFormats", [])) - 1, -1, -1):
                reqs.append({"deleteConditionalFormatRule": {"sheetId": sid, "index": i}})
            reqs.append({"updateCells": {
                "range": {"sheetId": sid}, "fields": "userEnteredValue,userEnteredFormat"}})
            reqs.append({"unmergeCells": {"range": {"sheetId": sid}}})
            sheets_api("POST", sheet_id + ":batchUpdate", token, {"requests": reqs})
            return sid
    res = sheets_api("POST", sheet_id + ":batchUpdate", token, {"requests": [
        {"addSheet": {"properties": {"title": title,
                                     "gridProperties": {"rowCount": 200, "columnCount": 16}}}}]})
    return res["replies"][0]["addSheet"]["properties"]["sheetId"]


def build_providers_tab(sheet_id, token, invoices, years):
    title = "Gastos por proveedor"
    sid = _get_or_create_tab(sheet_id, token, title)
    # Columnas: B=Proveedor(1) C=Nº fact.(2) D..O=meses(3..14) P=TOTAL(15)
    TOT_C = 15          # índice columna TOTAL
    NC = 16             # límite de columna (exclusivo) -> P
    data, reqs = [], []

    def cell(a1, v): data.append({"range": f"'{title}'!" + a1, "values": v})

    def fmt(r0, r1, c0, c1, uf, fields):
        reqs.append({"repeatCell": {"range": _rng(sid, r0, r1, c0, c1),
                     "cell": {"userEnteredFormat": uf},
                     "fields": "userEnteredFormat(" + fields + ")"}})

    def merge(r0, r1, c0, c1):
        reqs.append({"mergeCells": {"range": _rng(sid, r0, r1, c0, c1),
                                    "mergeType": "MERGE_ALL"}})

    def width(c0, c1, px):
        reqs.append({"updateDimensionProperties": {
            "range": {"sheetId": sid, "dimension": "COLUMNS", "startIndex": c0, "endIndex": c1},
            "properties": {"pixelSize": px}, "fields": "pixelSize"}})
    width(0, 1, 32); width(1, 2, 250); width(2, 3, 62)
    width(3, 15, 82); width(15, 16, 92)
    cell("B2", [["GASTOS MENSUALES POR PROVEEDOR"]])
    cell("B3", [["Base imponible (sin IVA) · Nº fact. = nº de facturas del proveedor · "
                 "duplicados exactos (mismo emisor, fecha, importe y concepto) eliminados. "
                 "Fuente: API Quipu."]])
    merge(1, 2, 1, NC)
    fmt(1, 2, 1, NC, {"backgroundColor": rgb(NAVY), "verticalAlignment": "MIDDLE",
                      "padding": {"left": 12}, "textFormat": _tf(True, 18, "FFFFFF")},
        "backgroundColor,verticalAlignment,padding,textFormat")
    reqs.append({"updateDimensionProperties": {
        "range": {"sheetId": sid, "dimension": "ROWS", "startIndex": 1, "endIndex": 2},
        "properties": {"pixelSize": 40}, "fields": "pixelSize"}})
    merge(2, 3, 1, NC)
    fmt(2, 3, 1, NC, {"backgroundColor": rgb(NAVY), "padding": {"left": 12},
                      "textFormat": _tf(False, 10, "AFC6DE", True)},
        "backgroundColor,padding,textFormat")

    row = 4  # 0-based; siguiente bloque empieza aquí
    for year in years:
        rows, dups = expenses_by_provider(invoices, year)
        n = len(rows)
        n_fact = sum(r[1] for r in rows)
        # título del año
        merge(row, row + 1, 1, NC)
        fmt(row, row + 1, 1, NC, {"backgroundColor": rgb(RED),
            "horizontalAlignment": "LEFT", "padding": {"left": 8},
            "verticalAlignment": "MIDDLE", "textFormat": _tf(True, 12, "FFFFFF")},
            "backgroundColor,horizontalAlignment,padding,verticalAlignment,textFormat")
        dtxt = f" · {dups} duplicadas eliminadas" if dups else ""
        cell(_a1(row, 1), [[f"AÑO {year} — {n} proveedores · {n_fact} facturas{dtxt}"]])
        hrow = row + 1
        cell(_a1(hrow, 1), [["Proveedor", "Nº fact."] + MES + ["TOTAL"]])
        fmt(hrow, hrow + 1, 1, NC, {"backgroundColor": rgb(NAVY),
            "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE",
            "textFormat": _tf(True, 9, "FFFFFF")},
            "backgroundColor,horizontalAlignment,verticalAlignment,textFormat")
        fmt(hrow, hrow + 1, 1, 2, {"horizontalAlignment": "LEFT", "padding": {"left": 8}},
            "horizontalAlignment,padding")
        # datos
        drow = hrow + 1
        block = [[nm, nf] + m + [tot] for nm, nf, m, tot in rows]
        cell(_a1(drow, 1), block)
        fmt(drow, drow + n, 1, 2, {"padding": {"left": 8}, "verticalAlignment": "MIDDLE",
            "textFormat": _tf(False, 9, "333333")}, "padding,verticalAlignment,textFormat")
        # Nº fact.: entero centrado
        fmt(drow, drow + n, 2, 3, {"numberFormat": {"type": "NUMBER", "pattern": "0"},
            "horizontalAlignment": "CENTER", "textFormat": _tf(True, 9, GREY)},
            "numberFormat,horizontalAlignment,textFormat")
        # meses + total: euros
        fmt(drow, drow + n, 3, NC, {"numberFormat": {"type": "NUMBER", "pattern": EUR},
            "horizontalAlignment": "RIGHT", "textFormat": _tf(False, 9, "333333")},
            "numberFormat,horizontalAlignment,textFormat")
        fmt(drow, drow + n, TOT_C, NC, {"textFormat": _tf(True, 9, NAVY),
            "backgroundColor": rgb("DDE3EA")}, "textFormat,backgroundColor")
        # ceros de meses en gris claro para que resalten los gastos reales
        reqs.append({"addConditionalFormatRule": {"rule": {
            "ranges": [_rng(sid, drow, drow + n, 3, TOT_C)],
            "booleanRule": {
                "condition": {"type": "NUMBER_EQ", "values": [{"userEnteredValue": "0"}]},
                "format": {"textFormat": _tf(color="C8CDD3")}}}, "index": 0}})
        # total del año
        trow = drow + n
        totals = [round(sum(rows[i][2][m] for i in range(n)), 2) for m in range(12)]
        cell(_a1(trow, 1), [["TOTAL", n_fact] + totals + [round(sum(totals), 2)]])
        fmt(trow, trow + 1, 1, 2, {"backgroundColor": rgb(NAVY), "padding": {"left": 8},
            "verticalAlignment": "MIDDLE", "textFormat": _tf(True, 9, "FFFFFF")},
            "backgroundColor,padding,verticalAlignment,textFormat")
        fmt(trow, trow + 1, 2, 3, {"backgroundColor": rgb("C3CAD3"),
            "numberFormat": {"type": "NUMBER", "pattern": "0"},
            "horizontalAlignment": "CENTER", "textFormat": _tf(True, 9, NAVY)},
            "backgroundColor,numberFormat,horizontalAlignment,textFormat")
        fmt(trow, trow + 1, 3, NC, {"backgroundColor": rgb("C3CAD3"),
            "numberFormat": {"type": "NUMBER", "pattern": EUR},
            "horizontalAlignment": "RIGHT", "textFormat": _tf(True, 9, NAVY)},
            "backgroundColor,numberFormat,horizontalAlignment,textFormat")
        reqs.append({"updateBorders": {"range": _rng(sid, hrow, trow + 1, 1, NC),
            "top": {"style": "SOLID", "color": rgb(NAVY)},
            "bottom": {"style": "SOLID", "color": rgb(NAVY)},
            "left": {"style": "SOLID", "color": rgb(NAVY)},
            "right": {"style": "SOLID", "color": rgb(NAVY)},
            "innerHorizontal": {"style": "SOLID", "color": rgb("E8E8E8")},
            "innerVertical": {"style": "SOLID", "color": rgb("E8E8E8")}}})
        # gráfico de barras: total por proveedor (col TOTAL) vs nombre (col B=1)
        reqs.append({"addChart": {"chart": {"spec": {
            "title": f"Gasto total por proveedor — {year}",
            "titleTextFormat": {"bold": True, "fontSize": 12},
            "basicChart": {"chartType": "BAR", "legendPosition": "NO_LEGEND",
                "axis": [{"position": "BOTTOM_AXIS", "title": "€"},
                         {"position": "LEFT_AXIS"}],
                "domains": [{"domain": {"sourceRange": {"sources": [_rng(sid, drow, trow, 1, 2)]}}}],
                "series": [{"series": {"sourceRange": {"sources": [_rng(sid, drow, trow, TOT_C, NC)]}},
                            "color": rgb(RED)}]}},
            "position": {"overlayPosition": {
                "anchorCell": {"sheetId": sid, "rowIndex": trow + 2, "columnIndex": 1},
                "widthPixels": 760, "heightPixels": max(280, n * 20 + 80)}}}}})
        # avanzar cursor: bloque + gráfico + separación
        chart_rows = max(280, n * 20 + 80) // 21 + 2
        row = trow + 2 + chart_rows + 2

    sheets_api("POST", sheet_id + "/values:batchUpdate", token,
               {"valueInputOption": "USER_ENTERED", "data": data})
    sheets_api("POST", sheet_id + ":batchUpdate", token, {"requests": reqs})


def _a1(row0, col0):
    """Convierte índices 0-based a A1 (solo columnas simples A-Z)."""
    return chr(ord("A") + col0) + str(row0 + 1)


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
    clients = clients_per_month(inv)

    print("Construyendo dashboard en Google Sheets…", file=sys.stderr)
    gtok = google_token(sa)
    meta = sheets_api("GET", sheet_id + "?fields=sheets.properties", gtok)
    sid = meta["sheets"][0]["properties"]["sheetId"]
    build_dashboard(sheet_id, sid, gtok, agg, clients, years)
    print("Construyendo pestaña de gastos por proveedor…", file=sys.stderr)
    build_providers_tab(sheet_id, gtok, inv, years)
    print(f"Listo → https://docs.google.com/spreadsheets/d/{sheet_id}/edit")


if __name__ == "__main__":
    main()
