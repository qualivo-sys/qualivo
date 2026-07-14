/**
 * ElevaStandalone.gs — Dashboard de Eleva Academy en UN solo archivo.
 *
 * Pega TODO este archivo en:  tu Google Sheet → Extensiones → Apps Script
 * (borra el Code.gs de ejemplo, pega esto, guarda) y ejecuta la función
 * `elevaGenerar`. Autoriza los permisos la primera vez. Creará/actualizará
 * dos pestañas formateadas: «Eleva · Mensual» y «Eleva · Semanal».
 *
 * Muestra, POR CANAL, cuántos leads hay en cada etapa del pipeline
 * (Nuevos, Respondidos, Agendados, Propuesta, Negociación, Ganados,
 * No cualif.), por mes y por semana. Fuente: GoHighLevel (en vivo).
 * La inversión/CPL se toma de CFG.inversion (edítala cada mes).
 */

var CFG = {
  // --- Credenciales GoHighLevel (LeadConnector v2) ---
  GHL_TOKEN: '',            // <-- pega aquí tu token pit-xxxxxxxx
  GHL_LOCATION_ID: '',      // <-- pega aquí tu location id

  timezone: 'Europe/Madrid',

  // Meses a pintar en la pestaña Mensual (una tabla por mes, el más reciente primero).
  meses: ['2026-07', '2026-06'],
  // Mes cuya vista semanal se pinta en la pestaña Semanal.
  mesSemanal: '2026-07',

  sheetMensual: 'Eleva · Mensual',
  sheetSemanal: 'Eleva · Semanal',

  // --- Etapas del pipeline -> etiqueta mostrada (define el ORDEN de columnas) ---
  // `match` se compara en minúsculas contra el nombre de la etapa en GHL.
  stageLabels: [
    { match: 'nuevo lead',          label: 'Nuevos' },
    { match: 'leads llamados',      label: 'Respondidos' },
    { match: 'llamada agendada',    label: 'Agendados' },
    { match: 'propuesta enviada',   label: 'Propuesta' },
    { match: 'negociacion / dudas', label: 'Negociación' },
    { match: 'alumna activa',       label: 'Ganados' },
    { match: 'no cualificada',      label: 'No cualif.' }
  ],
  ganadosLabel: 'Ganados', // etiqueta que cuenta como matrícula para el % ganado

  // Orden de proveedores/canales.
  providers: ['Meta · Instantáneo', 'Meta · Landing', 'Meta · Facebook (s/d)', 'Google Ads', 'Otro'],

  // Reglas source(GHL) -> canal (primera coincidencia gana; se compara en minúsculas).
  sourceRules: [
    { test: 'google', provider: 'Google Ads' },
    { test: 'lead form', provider: 'Meta · Instantáneo' },
    { test: 'formulario', provider: 'Meta · Instantáneo' },
    { test: 'instant', provider: 'Meta · Instantáneo' },
    { test: 'landing', provider: 'Meta · Landing' },
    { test: 'facebook', provider: 'Meta · Facebook (s/d)' },
    { test: 'meta', provider: 'Meta · Landing' }
  ],

  // Inversión y leads de plataforma por mes y canal (edítalo cada mes).
  inversion: {
    '2026-07': {
      'Meta · Instantáneo': { spend: 51.68, leads: 30 },
      'Meta · Landing':     { spend: 148.90, leads: 14 },
      'Google Ads':         { spend: 157.62, leads: 15 }
    }
  }
};

/* ============================ Menú ============================ */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Eleva Academy')
    .addItem('Generar dashboard (mensual + semanal)', 'elevaGenerar')
    .addToUi();
}

/** Genera ambas pestañas según CFG.meses / CFG.mesSemanal. */
function elevaGenerar() {
  elevaRenderMensual_();
  elevaRenderSemanal_();
  SpreadsheetApp.getActive().toast('Dashboard de Eleva actualizado', 'Eleva Academy', 5);
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

/** stageId -> etiqueta configurada (o el nombre crudo si no hay match). */
function elevaStageLabelMap_() {
  var map = {};
  var url = 'https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + encodeURIComponent(CFG.GHL_LOCATION_ID);
  var json = elevaHttp_(url);
  (json.pipelines || []).forEach(function (p) {
    (p.stages || []).forEach(function (s) {
      var n = String(s.name || '').trim().toLowerCase(), label = s.name;
      for (var i = 0; i < CFG.stageLabels.length; i++) {
        if (n === CFG.stageLabels[i].match) { label = CFG.stageLabels[i].label; break; }
      }
      map[s.id] = label;
    });
  });
  return map;
}

/** Oportunidades creadas en [since, until] (paginación por cursor, orden desc). */
function elevaFetchOpps_(since, until) {
  var url = 'https://services.leadconnectorhq.com/opportunities/search?location_id=' +
    encodeURIComponent(CFG.GHL_LOCATION_ID) + '&limit=100';
  var out = [], pages = 0;
  while (url && pages < 120) {
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

function elevaWeekMonday_(dateStr) {
  var d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00Z');
  var off = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}

/** Etiquetas de etapa en el orden configurado. */
function elevaStageOrder_() { return CFG.stageLabels.map(function (s) { return s.label; }); }

/** Matriz canal -> {etapa: n} para un conjunto de oportunidades. */
function elevaMatrix_(opps, stageMap) {
  var m = {};
  opps.forEach(function (o) {
    var prov = elevaProvider_(o.source);
    var label = stageMap[o.pipelineStageId] || '(otra)';
    if (!m[prov]) m[prov] = {};
    m[prov][label] = (m[prov][label] || 0) + 1;
  });
  return m;
}

/* ============================ Fechas ============================ */

function elevaMonthRange_(monthKey) {
  var p = monthKey.split('-'), y = +p[0], m = +p[1];
  var first = new Date(Date.UTC(y, m - 1, 1)), last = new Date(Date.UTC(y, m, 0));
  return { since: Utilities.formatDate(first, 'UTC', 'yyyy-MM-dd'), until: Utilities.formatDate(last, 'UTC', 'yyyy-MM-dd') };
}
var ELEVA_MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function elevaMonthLabel_(monthKey) { var p = monthKey.split('-'); return ELEVA_MESES[(+p[1]) - 1] + ' ' + p[0]; }
function elevaNow_() { return Utilities.formatDate(new Date(), CFG.timezone, 'dd/MM/yyyy HH:mm'); }

/* ============================ Formato ============================ */

var ELV = { dark: '#0f2233', accent: '#1f6feb', total: '#11324d', light: '#eef3f8', border: '#d0d7de', white: '#ffffff', grey: '#57606a', gold: '#b45309' };
var ELVFMT = { eur: '€#,##0.00', int: '#,##0', pct: '0.0%' };

function elevaInitSheet_(sh, ncols, title, sub) {
  sh.clear(); sh.clearFormats(); sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 200);
  for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 95);
  var t = sh.getRange(1, 1, 1, ncols).merge();
  t.setValue(title).setFontSize(17).setFontWeight('bold').setFontColor(ELV.dark);
  sh.setRowHeight(1, 30);
  sh.getRange(2, 1, 1, ncols).merge().setValue(sub).setFontColor(ELV.grey);
}
function elevaSection_(sh, row, ncols, text) {
  sh.getRange(row, 1, 1, ncols).merge().setValue(text.toUpperCase())
    .setBackground(ELV.dark).setFontColor(ELV.white).setFontWeight('bold').setFontSize(11).setVerticalAlignment('middle');
  sh.setRowHeight(row, 24);
  return row + 1;
}
function elevaTable_(sh, row, header, rows, fmts, totalRow) {
  var nc = header.length;
  sh.getRange(row, 1, 1, nc).setValues([header]).setBackground(ELV.accent)
    .setFontColor(ELV.white).setFontWeight('bold').setHorizontalAlignment('center').setWrap(true);
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
  sh.setRowHeight(row, 28);
  return row + 1;
}
function elevaDiv_(a, b) { return b ? a / b : 0; }
function elevaSum_(obj) { var t = 0; for (var k in obj) t += obj[k]; return t; }

/* ============================ Render: MENSUAL ============================ */

function elevaRenderMensual_() {
  var stageMap = elevaStageLabelMap_();
  var stages = elevaStageOrder_();
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CFG.sheetMensual) || ss.insertSheet(CFG.sheetMensual);
  var NC = 2 + stages.length + 2; // Canal + etapas + Total + %Gan
  elevaInitSheet_(sh, NC, 'Eleva Academy · Leads por canal y etapa (mensual)',
    'elevanails.es  ·  Fuente: GoHighLevel (en vivo)  ·  Actualizado: ' + elevaNow_());
  var row = 4;

  CFG.meses.forEach(function (monthKey) {
    var r = elevaMonthRange_(monthKey);
    var opps = elevaFetchOpps_(r.since, r.until);
    var m = elevaMatrix_(opps, stageMap);

    // --- Inversión del mes (si está en CFG.inversion) ---
    var inv = CFG.inversion[monthKey];
    row = elevaSection_(sh, row, NC, 'Inversión · ' + elevaMonthLabel_(monthKey));
    if (inv) {
      var invRows = [], tS = 0, tL = 0;
      CFG.providers.forEach(function (p) {
        var iv = inv[p]; if (!iv) return;
        invRows.push([p, iv.spend, iv.leads, elevaDiv_(iv.spend, iv.leads)].concat(elevaPad_(NC - 4)));
        tS += iv.spend; tL += iv.leads;
      });
      invRows.push(['TOTAL', tS, tL, elevaDiv_(tS, tL)].concat(elevaPad_(NC - 4)));
      var invHdr = ['Canal', 'Inversión €', 'Leads (plataf.)', 'CPL €'].concat(elevaPad_(NC - 4));
      row = elevaTable_(sh, row, invHdr, invRows, [null, ELVFMT.eur, ELVFMT.int, ELVFMT.eur], true);
    } else {
      row = elevaNote_(sh, row, NC, 'Sin inversión configurada para este mes (edita CFG.inversion).');
    }

    // --- Matriz canal × etapa ---
    row = elevaSection_(sh, row, NC, 'Leads por canal y etapa · ' + elevaMonthLabel_(monthKey) + ' (cohorte creada en el mes)');
    var header = ['Canal'].concat(stages).concat(['Total', '% Ganado']);
    var rows = [], totals = {};
    CFG.providers.forEach(function (p) {
      if (!m[p]) return;
      var line = [p], tot = elevaSum_(m[p]);
      stages.forEach(function (s) { var v = m[p][s] || 0; line.push(v); totals[s] = (totals[s] || 0) + v; });
      line.push(tot);
      line.push(elevaDiv_(m[p][CFG.ganadosLabel] || 0, tot));
      rows.push(line);
    });
    var grand = 0; stages.forEach(function (s) { grand += (totals[s] || 0); });
    var totalLine = ['TOTAL'].concat(stages.map(function (s) { return totals[s] || 0; }));
    totalLine.push(grand);
    totalLine.push(elevaDiv_(totals[CFG.ganadosLabel] || 0, grand));
    rows.push(totalLine);
    var fmts = [null].concat(stages.map(function () { return ELVFMT.int; })).concat([ELVFMT.int, ELVFMT.pct]);
    row = elevaTable_(sh, row, header, rows, fmts, true);
    row += 1;
  });

  elevaNote_(sh, row, NC,
    'Cada lead se cuenta en su etapa ACTUAL del pipeline. "Respondidos" = Leads llamados; "Agendados" = Llamada agendada; ' +
    '"Ganados" = Alumna activa. Nota: parte de los leads en etapas tempranas pueden estar marcados como abandonados/perdidos en GHL.');
  sh.setActiveSelection('A1');
}

function elevaPad_(n) { var a = []; for (var i = 0; i < n; i++) a.push(''); return a; }

/* ============================ Render: SEMANAL ============================ */

function elevaRenderSemanal_() {
  var stageMap = elevaStageLabelMap_();
  var stages = elevaStageOrder_();
  var monthKey = CFG.mesSemanal;
  var r = elevaMonthRange_(monthKey);
  var opps = elevaFetchOpps_(r.since, r.until);

  var byWeek = {};
  opps.forEach(function (o) {
    var wk = elevaWeekMonday_(o.createdAt || r.since);
    if (!byWeek[wk]) byWeek[wk] = [];
    byWeek[wk].push(o);
  });

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CFG.sheetSemanal) || ss.insertSheet(CFG.sheetSemanal);
  var NC = 2 + stages.length + 1; // Semana + Canal + etapas + Total
  elevaInitSheet_(sh, NC, 'Eleva Academy · Leads por canal y etapa (semanal · ' + elevaMonthLabel_(monthKey) + ')',
    'Cohorte por semana de creación del lead  ·  Fuente: GoHighLevel  ·  Actualizado: ' + elevaNow_());

  var header = ['Semana', 'Canal'].concat(stages).concat(['Total']);
  var rows = [];
  Object.keys(byWeek).sort().forEach(function (wk) {
    var m = elevaMatrix_(byWeek[wk], stageMap);
    var wkTotals = {};
    CFG.providers.forEach(function (p) {
      if (!m[p]) return;
      var line = [wk, p];
      stages.forEach(function (s) { var v = m[p][s] || 0; line.push(v); wkTotals[s] = (wkTotals[s] || 0) + v; });
      line.push(elevaSum_(m[p]));
      rows.push(line);
    });
    var tot = ['', '— Total ' + wk];
    var g = 0; stages.forEach(function (s) { tot.push(wkTotals[s] || 0); g += (wkTotals[s] || 0); });
    tot.push(g);
    rows.push(tot);
  });
  if (!rows.length) rows = [['(sin datos)', ''].concat(elevaPad_(stages.length + 1))];

  var fmts = [null, null].concat(stages.map(function () { return ELVFMT.int; })).concat([ELVFMT.int]);
  var startRow = 4;
  var endRow = elevaTable_(sh, startRow, header, rows, fmts, false);

  // Resaltar filas "— Total semana"
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][1]).indexOf('— Total') === 0) {
      sh.getRange(startRow + 1 + i, 1, 1, NC).setBackground(ELV.light).setFontWeight('bold');
    }
  }
  sh.setActiveSelection('A1');
}
