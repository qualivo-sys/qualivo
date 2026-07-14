#!/usr/bin/env python3
"""
build_sheet.py — Escribe el dashboard de Eleva Academy (2 pestañas formateadas:
«Eleva · Mensual» y «Eleva · Semanal») directamente en un Google Sheet, usando
una service account. Datos en vivo: GoHighLevel (embudo) + Meta Ads (inversión).

Alternativa en Python a los módulos Apps Script (src/Eleva.gs). Útil para
ejecutarlo en local o programado (cron) sin depender del editor de Apps Script.

Requisitos: solo librería estándar de Python + `openssl` en el PATH (para firmar
el JWT de la service account). NO contiene secretos: todo por variables de entorno.

Uso:
  export GOOGLE_SA_JSON=/ruta/service-account.json     # con acceso de edición al Sheet
  export SHEET_ID=13rT4r1FijPVQR5pD0FtMSWbcdKvqNRx_CttK8jSJAQU
  export GHL_TOKEN=pit-xxxx
  export GHL_LOCATION_ID=FPBnvtKnkVYGadTPBi2n
  export META_TOKEN=EAAG...            # opcional (sin él, la inversión Meta se omite)
  export META_ACT=2028650084720565     # id de cuenta Meta sin 'act_'
  export MESES="2026-07,2026-06"       # opcional (por defecto)
  export MES_SEMANAL="2026-07"         # opcional
  python3 tools/build_sheet.py

La service account debe tener el Sheet compartido con permiso de edición.
"""
import os, json, time, base64, subprocess, tempfile, urllib.request, urllib.parse, datetime, calendar
from collections import defaultdict

SA = os.environ['GOOGLE_SA_JSON']
SHEET_ID = os.environ['SHEET_ID']
GHL_TOKEN = os.environ['GHL_TOKEN']
GHL_LOC = os.environ['GHL_LOCATION_ID']
META_TOKEN = os.environ.get('META_TOKEN', '')
META_ACT = os.environ.get('META_ACT', '')
MESES = os.environ.get('MESES', '2026-07,2026-06').split(',')
MES_SEMANAL = os.environ.get('MES_SEMANAL', '2026-07')
# Google Ads manual (por campaña) hasta conectar su API. Clave = 'YYYY-MM'.
GOOGLE_INV = {'2026-07': {'Google · Performance Max': {'spend': 200.55, 'leads': 26},
                          'Google · Search': {'spend': 201.61, 'leads': 20}}}
COURSE_PRICE = 1500.0  # precio del curso (€) -> Ingresos = matrículas × precio

# ------------------------------- auth (JWT/openssl) -------------------------------
def sheets_token():
    sa = json.load(open(SA))
    b = lambda x: base64.urlsafe_b64encode(x).rstrip(b'=')
    now = int(time.time())
    si = (b(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()) + b'.' +
          b(json.dumps({"iss": sa["client_email"], "scope": "https://www.googleapis.com/auth/spreadsheets",
                        "aud": sa["token_uri"], "iat": now, "exp": now + 3600}).encode()))
    with tempfile.NamedTemporaryFile('w', suffix='.pem', delete=False) as f:
        f.write(sa["private_key"]); key = f.name
    os.chmod(key, 0o600)
    try:
        p = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', key], input=si, capture_output=True, check=True)
    finally:
        os.remove(key)
    jwt = (si + b'.' + b(p.stdout)).decode()
    data = urllib.parse.urlencode({"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt}).encode()
    return json.load(urllib.request.urlopen(urllib.request.Request(sa["token_uri"], data=data)))["access_token"]

AT = sheets_token()
def sheets(method, url, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Authorization": "Bearer " + AT, "Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        raise SystemExit("Sheets API %s: %s" % (e.code, e.read().decode()[:500]))

# ------------------------------- data: GHL -------------------------------
PROV = ['Meta · Instantáneo', 'Meta · Landing', 'Google Ads', 'Otro']
STAGES = []                 # nombres de etapa tal cual en GHL (orden del pipeline); se llena en main()
GANADOS = 'Alumna activa'   # etapa que cuenta como matrícula para el % ganado

def ghl(url):
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + GHL_TOKEN, 'Version': '2021-07-28',
                                               'Accept': 'application/json', 'User-Agent': 'qualivo-eleva-dashboard/1.0'})
    return json.load(urllib.request.urlopen(req))

def pipeline_stages():
    """Devuelve (nombres_ordenados, {stageId: nombre}, nombre_etapa_ganados)."""
    j = ghl('https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + urllib.parse.quote(GHL_LOC))
    names, id2name = [], {}
    for p in j.get('pipelines', []):
        for s in sorted(p.get('stages', []), key=lambda x: x.get('position', 0)):
            id2name[s['id']] = s['name']
            if s['name'] not in names: names.append(s['name'])
    gan = next((n for n in names if n.strip().lower() == 'alumna activa'), names[-1] if names else '')
    return names, id2name, gan

def fetch_opps(since, until):
    url = 'https://services.leadconnectorhq.com/opportunities/search?location_id=' + urllib.parse.quote(GHL_LOC) + '&limit=100'
    out, pages = [], 0
    while url and pages < 120:
        j = ghl(url); pages += 1
        mind = '9999'
        for o in j.get('opportunities', []):
            c = (o.get('createdAt') or '')[:10]
            if c < mind: mind = c
            if since <= c <= until: out.append(o)
        if mind < since: break
        url = (j.get('meta') or {}).get('nextPageUrl')
    return out

def provider(src):
    x = (src or '').lower()
    if 'google' in x: return 'Google Ads'
    if 'landing' in x: return 'Meta · Landing'           # "Meta Ads - Landing web"
    # formulario instantáneo: incluye source "Facebook" (así entran los Lead Ads en GHL)
    if 'facebook' in x or 'lead form' in x or 'instant' in x or 'formulario' in x or 'meta' in x: return 'Meta · Instantáneo'
    return 'Otro'

def wkmon(ds):
    d = datetime.date.fromisoformat(ds[:10]); return (d - datetime.timedelta(days=d.weekday())).isoformat()

def month_range(mk):
    y, m = int(mk[:4]), int(mk[5:7]); return f'{mk}-01', f'{mk}-{calendar.monthrange(y, m)[1]:02d}'

# ------------------------------- data: Meta -------------------------------
def meta_channel(n):
    n = (n or '').lower()
    if 'landing' in n: return 'Meta · Landing'
    if 'lead' in n or 'instant' in n or 'formulario' in n: return 'Meta · Instantáneo'
    return 'Meta · (otro)'

def meta_daily(mk):
    if not META_TOKEN or not META_ACT: return []
    since, until = month_range(mk)
    url = f'https://graph.facebook.com/v21.0/act_{META_ACT}/insights?' + urllib.parse.urlencode({
        'level': 'campaign', 'time_increment': '1', 'fields': 'campaign_name,spend,actions', 'limit': '500',
        'time_range': json.dumps({'since': since, 'until': until}), 'access_token': META_TOKEN})
    out = []
    while url:
        d = json.load(urllib.request.urlopen(url))
        for r in d.get('data', []):
            acts = {a['action_type']: float(a['value']) for a in r.get('actions', [])}
            lead = acts.get('lead', 0) or (acts.get('onsite_conversion.lead_grouped', 0) + acts.get('offsite_conversion.fb_pixel_lead', 0))
            out.append((r['date_start'], meta_channel(r.get('campaign_name')), float(r.get('spend', 0)), lead))
        url = (d.get('paging') or {}).get('next')
    return out

def meta_monthly(mk):
    m = defaultdict(lambda: {'spend': 0.0, 'leads': 0.0})
    for _, ch, sp, ld in meta_daily(mk): m[ch]['spend'] += sp; m[ch]['leads'] += ld
    for ch, v in GOOGLE_INV.get(mk, {}).items(): m[ch] = v
    return m

def meta_weekly(mk):
    w = defaultdict(lambda: defaultdict(lambda: {'spend': 0.0, 'leads': 0.0}))
    for dt, ch, sp, ld in meta_daily(mk): w[wkmon(dt)][ch]['spend'] += sp; w[wkmon(dt)][ch]['leads'] += ld
    return w

# ------------------------------- formato -------------------------------
def rgb(h): return {'red': int(h[0:2], 16) / 255, 'green': int(h[2:4], 16) / 255, 'blue': int(h[4:6], 16) / 255}
DARK, ACCENT, TOTAL, LIGHT, GREY, WHITE, BORD = rgb('0f2233'), rgb('1f6feb'), rgb('11324d'), rgb('eef3f8'), rgb('57606a'), rgb('ffffff'), rgb('d0d7de')
EUR, INT, PCT = '€#,##0.00', '#,##0', '0.0%'

class Layout:
    def __init__(self, sid, ncols): self.sid, self.nc, self.rows, self.reqs = sid, ncols, [], []
    def _merge(self, r): self.reqs.append({'mergeCells': {'range': self._rng(r, r + 1, 0, self.nc), 'mergeType': 'MERGE_ALL'}})
    def _rng(self, r0, r1, c0, c1): return {'sheetId': self.sid, 'startRowIndex': r0, 'endRowIndex': r1, 'startColumnIndex': c0, 'endColumnIndex': c1}
    def _fmt(self, r0, r1, c0, c1, cell, fields): self.reqs.append({'repeatCell': {'range': self._rng(r0, r1, c0, c1), 'cell': cell, 'fields': fields}})
    def _rowh(self, r, h): self.reqs.append({'updateDimensionProperties': {'range': {'sheetId': self.sid, 'dimension': 'ROWS', 'startIndex': r, 'endIndex': r + 1}, 'properties': {'pixelSize': h}, 'fields': 'pixelSize'}})
    def title(self, t):
        r = len(self.rows); self.rows.append([t] + [''] * (self.nc - 1)); self._merge(r)
        self._fmt(r, r + 1, 0, self.nc, {'userEnteredFormat': {'textFormat': {'bold': True, 'fontSize': 16, 'foregroundColor': DARK}}}, 'userEnteredFormat.textFormat'); self._rowh(r, 30)
    def subtitle(self, t):
        r = len(self.rows); self.rows.append([t] + [''] * (self.nc - 1)); self._merge(r)
        self._fmt(r, r + 1, 0, self.nc, {'userEnteredFormat': {'textFormat': {'fontSize': 9, 'foregroundColor': GREY}}}, 'userEnteredFormat.textFormat')
    def blank(self): self.rows.append([''] * self.nc)
    def section(self, t):
        r = len(self.rows); self.rows.append([t.upper()] + [''] * (self.nc - 1)); self._merge(r)
        self._fmt(r, r + 1, 0, self.nc, {'userEnteredFormat': {'backgroundColor': DARK, 'textFormat': {'bold': True, 'fontSize': 11, 'foregroundColor': WHITE}, 'verticalAlignment': 'MIDDLE'}}, 'userEnteredFormat'); self._rowh(r, 24)
    def note(self, t):
        r = len(self.rows); self.rows.append([t] + [''] * (self.nc - 1)); self._merge(r)
        self._fmt(r, r + 1, 0, self.nc, {'userEnteredFormat': {'wrapStrategy': 'WRAP', 'textFormat': {'italic': True, 'fontSize': 9, 'foregroundColor': GREY}}}, 'userEnteredFormat'); self._rowh(r, 30)
    def table(self, header, data, colfmt, total=False):
        hr = len(self.rows); self.rows.append(header + [''] * (self.nc - len(header)))
        self._fmt(hr, hr + 1, 0, len(header), {'userEnteredFormat': {'backgroundColor': ACCENT, 'textFormat': {'bold': True, 'foregroundColor': WHITE}, 'horizontalAlignment': 'CENTER', 'wrapStrategy': 'WRAP'}}, 'userEnteredFormat')
        d0 = len(self.rows)
        for row in data: self.rows.append(row + [''] * (self.nc - len(row)))
        d1 = len(self.rows)
        self.reqs.append({'updateBorders': {'range': self._rng(d0, d1, 0, len(header)), 'top': {'style': 'SOLID', 'color': BORD}, 'bottom': {'style': 'SOLID', 'color': BORD}, 'left': {'style': 'SOLID', 'color': BORD}, 'right': {'style': 'SOLID', 'color': BORD}, 'innerHorizontal': {'style': 'SOLID', 'color': BORD}, 'innerVertical': {'style': 'SOLID', 'color': BORD}}})
        for c, f in enumerate(colfmt):
            if f: self._fmt(d0, d1, c, c + 1, {'userEnteredFormat': {'numberFormat': {'type': 'NUMBER', 'pattern': f}}}, 'userEnteredFormat.numberFormat')
        for i in range(len(data)):
            if i % 2 == 1: self._fmt(d0 + i, d0 + i + 1, 0, len(header), {'userEnteredFormat': {'backgroundColor': LIGHT}}, 'userEnteredFormat.backgroundColor')
        if total and data:
            self._fmt(d1 - 1, d1, 0, len(header), {'userEnteredFormat': {'backgroundColor': TOTAL, 'textFormat': {'bold': True, 'foregroundColor': WHITE}}}, 'userEnteredFormat.backgroundColor,userEnteredFormat.textFormat')
        return hr
    def highlight_row(self, r):
        self._fmt(r, r + 1, 0, self.nc, {'userEnteredFormat': {'backgroundColor': LIGHT, 'textFormat': {'bold': True}}}, 'userEnteredFormat.backgroundColor,userEnteredFormat.textFormat')
    def colwidths(self, widths):
        for c, w in enumerate(widths):
            self.reqs.append({'updateDimensionProperties': {'range': {'sheetId': self.sid, 'dimension': 'COLUMNS', 'startIndex': c, 'endIndex': c + 1}, 'properties': {'pixelSize': w}, 'fields': 'pixelSize'}})
    def gridreqs(self): return [{'updateSheetProperties': {'properties': {'sheetId': self.sid, 'gridProperties': {'hideGridlines': True}}, 'fields': 'gridProperties.hideGridlines'}}]

def inv_rows(byc):
    rows, tS, tL = [], 0, 0
    for ch in ['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)', 'Google · Performance Max', 'Google · Search', 'Google Ads']:
        v = byc.get(ch)
        if not v: continue
        rows.append([ch, round(v['spend'], 2), int(v['leads']), round(v['spend'] / v['leads'], 2) if v['leads'] else 0]); tS += v['spend']; tL += v['leads']
    rows.append(['TOTAL', round(tS, 2), int(tL), round(tS / tL, 2) if tL else 0])
    return rows

def matrix(opps, stagemap):
    m = defaultdict(lambda: defaultdict(int))
    for o in opps: m[provider(o.get('source'))][stagemap.get(o.get('pipelineStageId'), '(otra)')] += 1
    return m

MESLBL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
def mlabel(mk): return MESLBL[int(mk[5:7]) - 1] + ' ' + mk[:4]

def build_mensual(sid, stagemap):
    nc = 11; L = Layout(sid, nc)
    L.title('Eleva Academy · Marketing dashboard (mensual)')
    L.subtitle('Embudo: GoHighLevel (en vivo) · Inversión: Meta (en vivo) + Google (manual) · Curso 1.500 € · Actualizado: ' + datetime.datetime.now().strftime('%d/%m/%Y'))
    L.blank()
    low = [s.lower() for s in STAGES]
    prop_idx = low.index('propuesta enviada') if 'propuesta enviada' in low else len(STAGES)
    ENTRE = [STAGES[i] for i in range(prop_idx, len(STAGES)) if low[i] != 'no cualificada']
    for mk in MESES:
        since, until = month_range(mk); m = matrix(fetch_opps(since, until), stagemap)
        byc = meta_monthly(mk)
        # 1) Inversión
        L.section('Inversión · ' + mlabel(mk))
        L.table(['Canal', 'Inversión €', 'Leads (plataf.)', 'CPL €'], inv_rows(byc), [None, EUR, INT, EUR], total=True)
        # 2) Leads por canal y etapa
        L.section('Leads por canal y etapa · ' + mlabel(mk) + ' (cohorte del mes)')
        rows, totals = [], defaultdict(int)
        for p in PROV:
            if p not in m: continue
            tot = sum(m[p].values())
            rows.append([p] + [m[p].get(s, 0) for s in STAGES] + [tot, (m[p].get(GANADOS, 0) / tot if tot else 0)])
            for s in STAGES: totals[s] += m[p].get(s, 0)
        grand = sum(totals.values())
        rows.append(['TOTAL'] + [totals[s] for s in STAGES] + [grand, (totals[GANADOS] / grand if grand else 0)])
        L.table(['Canal'] + STAGES + ['Total', '% Ganado'], rows, [None] + [INT] * len(STAGES) + [INT, PCT], total=True)
        # 3) Rentabilidad y conversión
        L.section('Rentabilidad y conversión · ' + mlabel(mk))
        def spend_of(keys): return sum(byc[k]['spend'] for k in keys if k in byc)
        def agg(provs):
            leads = entre = matr = 0
            for p in provs:
                d = m.get(p, {}); leads += sum(d.values()); entre += sum(d.get(s, 0) for s in ENTRE); matr += d.get(GANADOS, 0)
            return leads, entre, matr
        def rrow(label, provs, spend):
            leads, entre, matr = agg(provs); ing = matr * COURSE_PRICE
            return [label,
                    round(spend, 2) if spend else '',
                    leads, entre, matr,
                    (entre / leads if leads else ''),
                    (matr / entre if entre else ''),
                    (round(spend / entre, 2) if (spend and entre) else ''),
                    (round(spend / matr, 2) if (spend and matr) else ''),
                    ing,
                    (round(ing / spend, 2) if spend else '')]
        rent = [
            rrow('Meta · Instantáneo', ['Meta · Instantáneo'], spend_of(['Meta · Instantáneo'])),
            rrow('Meta · Landing', ['Meta · Landing'], spend_of(['Meta · Landing'])),
            rrow('Meta (subtotal)', ['Meta · Instantáneo', 'Meta · Landing'], spend_of(['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)'])),
            rrow('Google Ads', ['Google Ads'], spend_of(['Google · Performance Max', 'Google · Search', 'Google Ads'])),
            rrow('TOTAL', PROV, spend_of(list(byc.keys()))),
        ]
        rent_hdr = ['Canal', 'Inversión €', 'Leads', 'Entrevistas', 'Matrículas', '% L→Entr', '% Entr→Matr', 'Coste/Entr €', 'CPA €', 'Ingresos €', 'ROAS']
        rent_fmt = [None, EUR, INT, INT, INT, PCT, PCT, EUR, EUR, EUR, '0.0"x"']
        hr = L.table(rent_hdr, rent, rent_fmt, total=True)
        L.highlight_row(hr + 1 + 2)  # fila "Meta (subtotal)"
        L.blank()
    L.note('Entrevista = "Propuesta enviada" o posterior · Matrícula = "Alumna activa" · Ingresos = matrículas × 1.500 € · ROAS = ingresos / inversión · CPA = inversión / matrículas. '
           'La inversión es por canal de plataforma y el embudo se atribuye por el source de GHL; fíjate en "Meta (subtotal)" y "TOTAL" para la eficiencia real. Meta · Instantáneo incluye el source "Facebook".')
    L.colwidths([165] + [92] * 10)
    return L

def build_semanal(sid, stagemap):
    nc = 2 + len(STAGES) + 1; L = Layout(sid, nc)
    L.title('Eleva Academy · Semanal · ' + mlabel(MES_SEMANAL))
    L.subtitle('Cohorte por semana de creación del lead · GHL + Meta (en vivo) · Actualizado: ' + datetime.datetime.now().strftime('%d/%m/%Y'))
    L.blank()
    L.section('Inversión semanal · Meta')
    mw = meta_weekly(MES_SEMANAL); invrows = []
    for wk in sorted(mw):
        for ch in ['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)']:
            if ch in mw[wk]:
                v = mw[wk][ch]; invrows.append([wk, ch, round(v['spend'], 2), int(v['leads']), round(v['spend'] / v['leads'], 2) if v['leads'] else 0])
    if invrows: L.table(['Semana', 'Canal', 'Inversión €', 'Leads', 'CPL €'], invrows, [None, None, EUR, INT, EUR])
    else: L.note('Sin inversión Meta (define META_TOKEN / META_ACT).')
    L.blank()
    L.section('Leads por canal y etapa · por semana')
    since, until = month_range(MES_SEMANAL)
    byweek = defaultdict(list)
    for o in fetch_opps(since, until): byweek[wkmon(o.get('createdAt') or since)].append(o)
    rows, totalrows = [], []
    for wk in sorted(byweek):
        m = matrix(byweek[wk], stagemap); wt = defaultdict(int)
        for p in PROV:
            if p not in m: continue
            rows.append([wk, p] + [m[p].get(s, 0) for s in STAGES] + [sum(m[p].values())])
            for s in STAGES: wt[s] += m[p].get(s, 0)
        rows.append(['', '— Total ' + wk] + [wt[s] for s in STAGES] + [sum(wt.values())]); totalrows.append(len(rows) - 1)
    hr = L.table(['Semana', 'Canal'] + STAGES + ['Total'], rows, [None, None] + [INT] * len(STAGES) + [INT])
    for i in totalrows: L.highlight_row(hr + 1 + i)
    L.colwidths([100, 190] + [92] * len(STAGES) + [70])
    return L

# ------------------------------- push -------------------------------
def main():
    global STAGES, GANADOS
    STAGES, stagemap, GANADOS = pipeline_stages()
    meta = sheets('GET', f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}?fields=sheets.properties')
    existing = {s['properties']['title']: s['properties']['sheetId'] for s in meta['sheets']}
    reqs, ids = [], {}
    for idx, t in enumerate(['Eleva · Mensual', 'Eleva · Semanal']):
        if t in existing:
            ids[t] = existing[t]
            reqs.append({'unmergeCells': {'range': {'sheetId': ids[t]}}})
            reqs.append({'repeatCell': {'range': {'sheetId': ids[t]}, 'cell': {'userEnteredFormat': {}}, 'fields': 'userEnteredFormat'}})
        else:
            reqs.append({'addSheet': {'properties': {'title': t, 'index': idx}}})
    rep = sheets('POST', f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}:batchUpdate', {'requests': reqs})
    for r in rep.get('replies', []):
        if 'addSheet' in r: ids[r['addSheet']['properties']['title']] = r['addSheet']['properties']['sheetId']
    for t in ids:
        sheets('POST', f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/' + urllib.parse.quote("'" + t + "'") + ':clear', {})
    Lm = build_mensual(ids['Eleva · Mensual'], stagemap)
    Ls = build_semanal(ids['Eleva · Semanal'], stagemap)
    for name, L in [('Eleva · Mensual', Lm), ('Eleva · Semanal', Ls)]:
        sheets('PUT', f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/' + urllib.parse.quote("'" + name + "'!A1") + '?valueInputOption=USER_ENTERED', {'values': L.rows})
    sheets('POST', f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}:batchUpdate', {'requests': Lm.gridreqs() + Lm.reqs + Ls.gridreqs() + Ls.reqs})
    print('OK: dashboard actualizado en', SHEET_ID)

if __name__ == '__main__':
    main()
