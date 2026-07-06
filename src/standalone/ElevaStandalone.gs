/**
 * ElevaStandalone.gs — Dashboard de Eleva Academy en UN solo archivo.
 *
 * Pega TODO este archivo en:  tu Google Sheet → Extensiones → Apps Script
 * (borra el Code.gs de ejemplo, pega esto, guarda) y ejecuta la función
 * `elevaGenerar`. Autoriza los permisos la primera vez. Creará/actualizará
 * dos pestañas formateadas: «Eleva · Mensual» y «Eleva · Semanal».
 *
 * No depende de ningún otro archivo. Fuente del embudo: GoHighLevel (en vivo).
 * La inversión/CPL se toma de CFG.inversion (edítala cada mes) porque las APIs
 * de Meta/Google requieren credenciales aparte.
 */

var CFG = {
  // --- Credenciales GoHighLevel (LeadConnector v2) ---
  GHL_TOKEN: '',            // <-- pega aquí tu token pit-xxxxxxxx
  GHL_LOCATION_ID: '',      // <-- pega aquí tu location id

  timezone: 'Europe/Madrid',

  // Nombres de las pestañas que genera el script.
  sheetMensual: 'Eleva · Mensual',
  sheetSemanal: 'Eleva · Semanal',

  // --- Clasificación del embudo por NOMBRE de etapa (minúsculas, sin tildes cuenta) ---
  // entrevista = llegó a esta etapa o posterior (entrevista hecha).
  // matrícula  = está en esta etapa.
  // descartada = no cuenta como oportunidad ni entrevista.
  stageEntrevistaFrom: 'propuesta enviada',
  stageMatricula: 'alumna activa',
  stageDescartada: 'no cualificada',

  // Orden de proveedores en las tablas.
  providers: ['Meta · Instantáneo', 'Meta · Landing', 'Meta · Facebook (s/d)', 'Google Ads', 'Otro'],

  // Reglas source(GHL) -> proveedor (primera coincidencia gana; se compara en minúsculas).
  sourceRules: [
    { test: 'google', provider: 'Google Ads' },
    { test: 'lead form', provider: 'Meta · Instantáneo' },
    { test: 'formulario', provider: 'Meta · Instantáneo' },
    { test: 'instant', provider: 'Meta · Instantáneo' },
    { test: 'landing', provider: 'Meta · Landing' },
    { test: 'facebook', provider: 'Meta · Facebook (s/d)' },
    { test: 'meta', provider: 'Meta · Landing' }
  ],

  // Inversión y leads de plataforma por mes y proveedor (edítalo cada mes).
  // Clave = 'YYYY-MM'. Se usa en la pestaña Mensual (Inversión / CPL).
  inversion: {
    '2026-07': {
      'Meta · Instantáneo': { spend: 51.68, leads: 30 },
      'Meta · Landing':     { spend: 148.90, leads: 14 },
      'Google Ads':         { spend: 157.62, leads: 15 }   // PMax 76.79 + Search 80.83
    }
  }
};

/* ============================ Menú ============================ */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Eleva Academy')
    .addItem('Generar embudo (mes en curso)', 'elevaGenerar')
    .addItem('Generar embudo de un mes…', 'elevaGenerarPreguntandoMes')
    .addToUi();
}

/* ============================ Entradas ============================ */

/** Genera ambas pestañas para el mes en curso. */
function elevaGenerar() { elevaRenderMes(elevaCurrentMonthKey_()); }

/** Pregunta un mes 'YYYY-MM' y genera ambas pestañas. */
function elevaGenerarPreguntandoMes() {
  var ui = SpreadsheetApp.getUi();
  var res = ui.prompt('Mes a generar', "Escribe el mes en formato AAAA-MM (p.ej. 2026-07):", ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var m = String(res.getResponseText() || '').trim();
  if (!/^\d{4}-\d{2}$/.test(m)) { ui.alert('Formato no válido. Usa AAAA-MM.'); return; }
  elevaRenderMes(m);
}

/* ============================ Datos (GHL) ============================ */

function elevaHeaders_() {
  return { 'Authorization': 'Bearer ' + CFG.GHL_TOKEN, 'Version': '2021-07-28', 'Accept': 'application/json' };
}

function elevaHttp_(url) {
  var res = UrlFetchApp.fetch(url, { headers: elevaHeaders_(), muteHttpExceptions: true });
  var code = res.getResponseCode(), body = res.getContentText();
  if (code < 200 || code >= 300) throw new Error('HTTP ' + code + ': ' + body.slice(0, 300));
  return body ? JSON.parse(body) : {};
}

/** stageId -> {pos,name} + umbrales de embudo, leídos del pipeline en vivo. */
function elevaStageInfo_() {
  var info = { posById: {}, nameById: {}, entrevistaFromPos: 99, matriculaId: null, descartadaId: null };
  var url = 'https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + encodeURIComponent(CFG.GHL_LOCATION_ID);
  var json = elevaHttp_(url);
  (json.pipelines || []).forEach(function (p) {
    (p.stages || []).forEach(function (s) {
      var pos = s.position || 0;
      info.posById[s.id] = pos; info.nameById[s.id] = s.name;
      var n = String(s.name || '').trim().toLowerCase();
      if (n === CFG.stageEntrevistaFrom) info.entrevistaFromPos = pos;
      if (n === CFG.stageMatricula) info.matriculaId = s.id;
      if (n === CFG.stageDescartada) info.descartadaId = s.id;
    });
  });
  return info;
}

/** Oportunidades creadas en [since, until] (paginación por cursor, orden desc). */
function elevaFetchOpps_(since, until) {
  var url = 'https://services.leadconnectorhq.com/opportunities/search?location_id=' +
    encodeURIComponent(CFG.GHL_LOCATION_ID) + '&limit=100';
  var out = [], pages = 0;
  while (url && pages < 80) {
    var json = elevaHttp_(url); pages++;
    var opps = json.opportunities || [], minDate = '9999';
    opps.forEach(function (o) {
      var c = (o.createdAt || '').slice(0, 10);
      if (c < minDate) minDate = c;
      if (c >= since && c <= until) out.push(o);
    });
    if (minDate < since) break;
    url = (json.meta && json.meta.nextPageUrl) ? json.meta.nextPageUrl : null;
  }
  return out;
}

function elevaProvider_(source) {
  var s = String(source || '').toLowerCase();
  for (var i = 0; i < CFG.sourceRules.length; i++) {
    if (s.indexOf(CFG.sourceRules[i].test) >= 0) return CFG.sourceRules[i].provider;
  }
  return 'Otro';
}

function elevaFlags_(opp, si) {
  var pos = si.posById[opp.pipelineStageId]; if (pos === undefined) pos = 0;
  var descartada = (opp.pipelineStageId === si.descartadaId);
  return {
    leads: 1,
    oport: (pos >= 1 && !descartada) ? 1 : 0,
    entrevista: (pos >= si.entrevistaFromPos && !descartada) ? 1 : 0,
    matricula: (opp.pipelineStageId === si.matriculaId) ? 1 : 0
  };
}

function elevaWeekMonday_(dateStr) {
  var d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00Z');
  var off = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}

function elevaEmpty_() { return { leads: 0, oport: 0, entrevista: 0, matricula: 0 }; }
function elevaAdd_(t, f) { t.leads += f.leads; t.oport += f.oport; t.entrevista += f.entrevista; t.matricula += f.matricula; }

function elevaBuildFunnel_(monthKey) {
  if (!CFG.GHL_TOKEN || !CFG.GHL_LOCATION_ID) throw new Error('Rellena CFG.GHL_TOKEN y CFG.GHL_LOCATION_ID al principio del archivo.');
  var r = elevaMonthRange_(monthKey);
  var si = elevaStageInfo_();
  var opps = elevaFetchOpps_(r.since, r.until);
  var byProvider = {}, byWeek = {}, total = elevaEmpty_();
  opps.forEach(function (o) {
    var prov = elevaProvider_(o.source), f = elevaFlags_(o, si);
    if (!byProvider[prov]) byProvider[prov] = elevaEmpty_();
    elevaAdd_(byProvider[prov], f); elevaAdd_(total, f);
    var wk = elevaWeekMonday_(o.createdAt || r.since);
    if (!byWeek[wk]) byWeek[wk] = {};
    if (!byWeek[wk][prov]) byWeek[wk][prov] = elevaEmpty_();
    elevaAdd_(byWeek[wk][prov], f);
  });
  return { month: monthKey, byProvider: byProvider, byWeek: byWeek, total: total, opps: opps.length,
           generatedAt: Utilities.formatDate(new Date(), CFG.timezone, 'dd/MM/yyyy HH:mm') };
}

/* ============================ Fechas ============================ */

function elevaMonthRange_(monthKey) {
  var p = monthKey.split('-'), y = +p[0], m = +p[1];
  var first = new Date(Date.UTC(y, m - 1, 1)), last = new Date(Date.UTC(y, m, 0));
  return { since: Utilities.formatDate(first, 'UTC', 'yyyy-MM-dd'), until: Utilities.formatDate(last, 'UTC', 'yyyy-MM-dd') };
}
function elevaCurrentMonthKey_() { return Utilities.formatDate(new Date(), CFG.timezone, 'yyyy-MM'); }
var ELEVA_MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function elevaMonthLabel_(monthKey) { var p = monthKey.split('-'); return ELEVA_MESES[(+p[1]) - 1] + ' ' + p[0]; }

/* ============================ Formato ============================ */

var ELV = { dark: '#0f2233', accent: '#1f6feb', total: '#11324d', light: '#eef3f8', border: '#d0d7de', white: '#ffffff', grey: '#57606a' };
var ELVFMT = { eur: '€#,##0.00', int: '#,##0', pct: '0.0%' };

function elevaTitle_(sh, ncols, title, sub) {
  sh.clear(); sh.clearFormats(); sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 210); for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 130);
  var t = sh.getRange(1, 1, 1, ncols).merge();
  t.setValue(title).setFontSize(18).setFontWeight('bold').setFontColor(ELV.dark);
  sh.setRowHeight(1, 32);
  sh.getRange(2, 1, 1, ncols).merge().setValue(sub).setFontColor(ELV.grey);
}
function elevaSection_(sh, row, ncols, text) {
  var r = sh.getRange(row, 1, 1, ncols).merge();
  r.setValue(text.toUpperCase()).setBackground(ELV.dark).setFontColor(ELV.white)
    .setFontWeight('bold').setFontSize(11).setVerticalAlignment('middle');
  sh.setRowHeight(row, 24);
  return row + 1;
}
function elevaTable_(sh, row, header, rows, fmts, totalRow) {
  var nc = header.length;
  sh.getRange(row, 1, 1, nc).setValues([header]).setBackground(ELV.accent)
    .setFontColor(ELV.white).setFontWeight('bold').setHorizontalAlignment('center');
  row++;
  if (rows.length) {
    var rng = sh.getRange(row, 1, rows.length, nc);
    rng.setValues(rows).setBorder(true, true, true, true, true, true, ELV.border, SpreadsheetApp.BorderStyle.SOLID);
    if (fmts) for (var c = 0; c < nc; c++) if (fmts[c]) sh.getRange(row, c + 1, rows.length, 1).setNumberFormat(fmts[c]);
    for (var i = 0; i < rows.length; i++) if (i % 2 === 1) sh.getRange(row + i, 1, 1, nc).setBackground(ELV.light);
    if (totalRow) sh.getRange(row + rows.length - 1, 1, 1, nc).setBackground(ELV.total).setFontColor(ELV.white).setFontWeight('bold');
    row += rows.length;
  }
  return row + 1;
}
function elevaNote_(sh, row, ncols, text) {
  sh.getRange(row, 1, 1, ncols).merge().setValue(text).setFontColor(ELV.grey).setFontStyle('italic').setWrap(true);
  sh.setRowHeight(row, 30);
  return row + 1;
}
function elevaDiv_(a, b) { return b ? a / b : 0; }

/* ============================ Render ============================ */

function elevaRenderMes(monthKey) {
  var ds = elevaBuildFunnel_(monthKey);
  elevaRenderMensual_(monthKey, ds);
  elevaRenderSemanal_(monthKey, ds);
  SpreadsheetApp.getActive().toast('Eleva: ' + elevaMonthLabel_(monthKey) + ' generado', 'Eleva Academy', 5);
}

function elevaRenderMensual_(monthKey, ds) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CFG.sheetMensual) || ss.insertSheet(CFG.sheetMensual);
  var NC = 6;
  elevaTitle_(sh, NC, 'Eleva Academy · Embudo mensual · ' + elevaMonthLabel_(monthKey),
    'elevanails.es  ·  Embudo: GoHighLevel (en vivo)  ·  Actualizado: ' + ds.generatedAt);
  var row = 4;

  // Inversión + embudo por canal
  row = elevaSection_(sh, row, NC, 'Por canal · inversión + embudo GHL');
  var inv = CFG.inversion[monthKey] || {};
  var header = ['Canal', 'Inversión €', 'Leads (plataf.)', 'CPL €', 'Entrevistas', 'Matrículas'];
  var rows = [], totSpend = 0, totLeads = 0, totEntr = 0, totMatr = 0;
  CFG.providers.forEach(function (p) {
    var a = ds.byProvider[p]; var iv = inv[p];
    if (!a && !iv) return;
    a = a || elevaEmpty_();
    var spend = iv ? iv.spend : '', leads = iv ? iv.leads : '';
    var cpl = iv && iv.leads ? iv.spend / iv.leads : '';
    rows.push([p, spend, leads, cpl, a.entrevista, a.matricula]);
    if (iv) { totSpend += iv.spend; totLeads += iv.leads; }
    totEntr += a.entrevista; totMatr += a.matricula;
  });
  rows.push(['TOTAL', totSpend, totLeads, elevaDiv_(totSpend, totLeads), totEntr, totMatr]);
  row = elevaTable_(sh, row, header, rows, [null, ELVFMT.eur, ELVFMT.int, ELVFMT.eur, ELVFMT.int, ELVFMT.int], true);

  // Embudo completo por proveedor
  row = elevaSection_(sh, row, NC, 'Embudo por proveedor · GHL (cohorte creada en el mes)');
  var h2 = ['Proveedor', 'Leads', 'Oportunidades', 'Entrevistas', 'Matrículas', 'Lead→Matrícula'];
  var r2 = [], T = elevaEmpty_();
  CFG.providers.forEach(function (p) {
    var a = ds.byProvider[p]; if (!a) return;
    r2.push([p, a.leads, a.oport, a.entrevista, a.matricula, elevaDiv_(a.matricula, a.leads)]);
    elevaAdd_(T, a);
  });
  r2.push(['TOTAL', T.leads, T.oport, T.entrevista, T.matricula, elevaDiv_(T.matricula, T.leads)]);
  row = elevaTable_(sh, row, h2, r2, [null, ELVFMT.int, ELVFMT.int, ELVFMT.int, ELVFMT.int, ELVFMT.pct], true);

  row = elevaNote_(sh, row, NC, 'Entrevista = oportunidad que llegó a "Propuesta enviada" o posterior (entrevista hecha; "Llamada agendada" es solo cita, puede no presentarse). Matrícula = etapa "Alumna activa". "Facebook (s/d)" = source Meta en GHL sin desglose instant/landing.');
  elevaNote_(sh, row, NC, 'Inversión/Leads/CPL se editan en CFG.inversion (Meta = leads reales; Google PMax marca 0 hasta que el seguimiento web esté operativo).');
  sh.setActiveSelection('A1');
}

function elevaRenderSemanal_(monthKey, ds) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CFG.sheetSemanal) || ss.insertSheet(CFG.sheetSemanal);
  var NC = 7;
  elevaTitle_(sh, NC, 'Eleva Academy · Embudo semanal · ' + elevaMonthLabel_(monthKey),
    'Cohorte por semana de creación del lead  ·  Fuente: GoHighLevel  ·  Actualizado: ' + ds.generatedAt);
  var header = ['Semana', 'Proveedor', 'Leads', 'Oportunidades', 'Entrevistas', 'Matrículas', 'Lead→Matrícula'];
  var rows = [];
  Object.keys(ds.byWeek).sort().forEach(function (wk) {
    var week = ds.byWeek[wk], wt = elevaEmpty_();
    CFG.providers.forEach(function (p) {
      var a = week[p]; if (!a) return;
      rows.push([wk, p, a.leads, a.oport, a.entrevista, a.matricula, elevaDiv_(a.matricula, a.leads)]);
      elevaAdd_(wt, a);
    });
    rows.push([wk, '— Total semana', wt.leads, wt.oport, wt.entrevista, wt.matricula, elevaDiv_(wt.matricula, wt.leads)]);
  });
  if (!rows.length) rows = [['(sin datos)', '', '', '', '', '', '']];
  elevaTable_(sh, 4, header, rows, [null, null, ELVFMT.int, ELVFMT.int, ELVFMT.int, ELVFMT.int, ELVFMT.pct], false);
  sh.setActiveSelection('A1');
}
