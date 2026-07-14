/**
 * Eleva.gs
 * Vistas de Eleva Academy (elevanails.es): leads POR CANAL Y ETAPA del
 * pipeline (Nuevos, Respondidos, Agendados, Propuesta, Negociación, Ganados,
 * No cualif.), MENSUAL y SEMANAL, con datos en vivo de GoHighLevel.
 *
 * Módulo INDEPENDIENTE del dashboard de EAC: reutiliza los helpers comunes
 * (httpJson, ghlHeaders, ghlSearchOpportunities, ghlStageNameMap, writeTable,
 * THEME, NUMFMT…) pero no toca la configuración ni el render de EAC.
 *
 * Cada lead se cuenta en su etapa ACTUAL. La inversión/CPL se toma de
 * ELEVA.inversion (editable) porque Meta/Google requieren credenciales aparte.
 */

var ELEVA = {
  clientName: 'Eleva Academy',
  website: 'elevanails.es',
  timezone: 'Europe/Madrid',
  sheets: { mensual: 'Eleva · Mensual', semanal: 'Eleva · Semanal' },

  // Meses (una tabla por mes en la vista mensual, el más reciente primero) y
  // mes de la vista semanal.
  meses: ['2026-07', '2026-06'],
  mesSemanal: '2026-07',

  // Etapa (nombre en GHL, minúsculas) -> etiqueta mostrada. Define el orden.
  stageLabels: [
    { match: 'nuevo lead',          label: 'Nuevos' },
    { match: 'leads llamados',      label: 'Respondidos' },
    { match: 'llamada agendada',    label: 'Agendados' },
    { match: 'propuesta enviada',   label: 'Propuesta' },
    { match: 'negociacion / dudas', label: 'Negociación' },
    { match: 'alumna activa',       label: 'Ganados' },
    { match: 'no cualificada',      label: 'No cualif.' }
  ],
  ganadosLabel: 'Ganados',

  providers: ['Meta · Instantáneo', 'Meta · Landing', 'Meta · Facebook (s/d)', 'Google Ads', 'Otro'],

  sourceRules: [
    { test: 'google', provider: 'Google Ads' },
    { test: 'lead form', provider: 'Meta · Instantáneo' },
    { test: 'formulario', provider: 'Meta · Instantáneo' },
    { test: 'instant', provider: 'Meta · Instantáneo' },
    { test: 'landing', provider: 'Meta · Landing' },
    { test: 'facebook', provider: 'Meta · Facebook (s/d)' },
    { test: 'meta', provider: 'Meta · Landing' }
  ],

  inversion: {
    '2026-07': {
      'Meta · Instantáneo': { spend: 51.68, leads: 30 },
      'Meta · Landing':     { spend: 148.90, leads: 14 },
      'Google Ads':         { spend: 157.62, leads: 15 }
    }
  }
};

function elevaProvider(source) {
  var s = String(source || '').toLowerCase();
  for (var i = 0; i < ELEVA.sourceRules.length; i++) {
    if (s.indexOf(ELEVA.sourceRules[i].test) >= 0) return ELEVA.sourceRules[i].provider;
  }
  return 'Otro';
}

/** stageId -> etiqueta configurada (usa ghlStageNameMap de GoHighLevel.gs). */
function elevaStageLabelMap() {
  var token = getProp('GHL_TOKEN'), locationId = getProp('GHL_LOCATION_ID');
  if (!token || !locationId) throw new Error('Faltan credenciales de GHL (GHL_TOKEN / GHL_LOCATION_ID).');
  var names = ghlStageNameMap(token, locationId); // stageId -> nombre
  var map = {};
  Object.keys(names).forEach(function (id) {
    var n = String(names[id] || '').trim().toLowerCase(), label = names[id];
    for (var i = 0; i < ELEVA.stageLabels.length; i++) {
      if (n === ELEVA.stageLabels[i].match) { label = ELEVA.stageLabels[i].label; break; }
    }
    map[id] = label;
  });
  return map;
}

function elevaStageOrder() { return ELEVA.stageLabels.map(function (s) { return s.label; }); }

/** Matriz canal -> {etapa: n}. */
function elevaMatrix(opps, stageMap) {
  var m = {};
  opps.forEach(function (o) {
    var prov = elevaProvider(o.source);
    var label = stageMap[o.pipelineStageId] || '(otra)';
    if (!m[prov]) m[prov] = {};
    m[prov][label] = (m[prov][label] || 0) + 1;
  });
  return m;
}

function elevaWeekMonday(dateStr) {
  var d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00Z');
  var off = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return fmtDate(d);
}

function elevaSum(obj) { var t = 0; for (var k in obj) t += obj[k]; return t; }
function elevaPad(n) { var a = []; for (var i = 0; i < n; i++) a.push(''); return a; }
function elevaNow() { return Utilities.formatDate(new Date(), ELEVA.timezone, 'dd/MM/yyyy HH:mm'); }

function elevaInitSheet(sh, ncols, title, sub) {
  sh.clear(); sh.clearFormats(); sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 200);
  for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 95);
  sh.getRange(1, 1, 1, ncols).merge().setValue(title)
    .setFontSize(17).setFontWeight('bold').setFontColor(THEME.dark);
  sh.setRowHeight(1, 30);
  sh.getRange(2, 1, 1, ncols).merge().setValue(sub).setFontColor('#57606a');
}

/* ------------------------------- MENSUAL -------------------------------- */

function elevaRenderMensual() {
  var stageMap = elevaStageLabelMap();
  var stages = elevaStageOrder();
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ELEVA.sheets.mensual) || ss.insertSheet(ELEVA.sheets.mensual);
  var NC = 2 + stages.length + 2; // Canal + etapas + Total + %Gan
  elevaInitSheet(sh, NC, ELEVA.clientName + ' · Leads por canal y etapa (mensual)',
    ELEVA.website + '  ·  Fuente: GoHighLevel (en vivo)  ·  Actualizado: ' + elevaNow());
  var row = 4;

  ELEVA.meses.forEach(function (monthKey) {
    var range = monthRange(monthKey);
    var opps = ghlSearchOpportunities(getProp('GHL_TOKEN'), getProp('GHL_LOCATION_ID'), range.since, range.until);
    var m = elevaMatrix(opps, stageMap);

    var inv = ELEVA.inversion[monthKey];
    row = writeSectionHeader(sh, row, NC, 'Inversión · ' + monthLabel(monthKey));
    if (inv) {
      var invRows = [], tS = 0, tL = 0;
      ELEVA.providers.forEach(function (p) {
        var iv = inv[p]; if (!iv) return;
        invRows.push([p, iv.spend, iv.leads, safeDiv(iv.spend, iv.leads)].concat(elevaPad(NC - 4)));
        tS += iv.spend; tL += iv.leads;
      });
      invRows.push(['TOTAL', tS, tL, safeDiv(tS, tL)].concat(elevaPad(NC - 4)));
      row = writeTable(sh, row, ['Canal', 'Inversión €', 'Leads (plataf.)', 'CPL €'].concat(elevaPad(NC - 4)),
        invRows, [null, NUMFMT.eur, NUMFMT.int, NUMFMT.eur], true);
    }

    row = writeSectionHeader(sh, row, NC, 'Leads por canal y etapa · ' + monthLabel(monthKey) + ' (cohorte del mes)');
    var header = ['Canal'].concat(stages).concat(['Total', '% Ganado']);
    var rows = [], totals = {};
    ELEVA.providers.forEach(function (p) {
      if (!m[p]) return;
      var line = [p], tot = elevaSum(m[p]);
      stages.forEach(function (s) { var v = m[p][s] || 0; line.push(v); totals[s] = (totals[s] || 0) + v; });
      line.push(tot);
      line.push(safeDiv(m[p][ELEVA.ganadosLabel] || 0, tot));
      rows.push(line);
    });
    var grand = 0; stages.forEach(function (s) { grand += (totals[s] || 0); });
    var totalLine = ['TOTAL'].concat(stages.map(function (s) { return totals[s] || 0; }));
    totalLine.push(grand);
    totalLine.push(safeDiv(totals[ELEVA.ganadosLabel] || 0, grand));
    rows.push(totalLine);
    var fmts = [null].concat(stages.map(function () { return NUMFMT.int; })).concat([NUMFMT.int, NUMFMT.pct]);
    row = writeTable(sh, row, header, rows.length ? rows : [['(sin datos)'].concat(elevaPad(NC - 1))], fmts, rows.length > 0);
    row += 1;
  });

  sh.getRange(row, 1, 1, NC).merge().setValue(
    'Cada lead se cuenta en su etapa ACTUAL. "Respondidos" = Leads llamados; "Agendados" = Llamada agendada; ' +
    '"Ganados" = Alumna activa. Parte de los leads en etapas tempranas pueden estar abandonados/perdidos en GHL.'
  ).setFontColor('#57606a').setWrap(true);
  sh.setActiveSelection('A1');
}

/* ------------------------------- SEMANAL -------------------------------- */

function elevaRenderSemanal() {
  var stageMap = elevaStageLabelMap();
  var stages = elevaStageOrder();
  var monthKey = ELEVA.mesSemanal;
  var range = monthRange(monthKey);
  var opps = ghlSearchOpportunities(getProp('GHL_TOKEN'), getProp('GHL_LOCATION_ID'), range.since, range.until);

  var byWeek = {};
  opps.forEach(function (o) {
    var wk = elevaWeekMonday(o.createdAt || range.since);
    if (!byWeek[wk]) byWeek[wk] = [];
    byWeek[wk].push(o);
  });

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ELEVA.sheets.semanal) || ss.insertSheet(ELEVA.sheets.semanal);
  var NC = 2 + stages.length + 1; // Semana + Canal + etapas + Total
  elevaInitSheet(sh, NC, ELEVA.clientName + ' · Leads por canal y etapa (semanal · ' + monthLabel(monthKey) + ')',
    'Cohorte por semana de creación del lead  ·  Fuente: GoHighLevel  ·  Actualizado: ' + elevaNow());

  var header = ['Semana', 'Canal'].concat(stages).concat(['Total']);
  var rows = [];
  Object.keys(byWeek).sort().forEach(function (wk) {
    var m = elevaMatrix(byWeek[wk], stageMap);
    var wkTotals = {};
    ELEVA.providers.forEach(function (p) {
      if (!m[p]) return;
      var line = [wk, p];
      stages.forEach(function (s) { var v = m[p][s] || 0; line.push(v); wkTotals[s] = (wkTotals[s] || 0) + v; });
      line.push(elevaSum(m[p]));
      rows.push(line);
    });
    var tot = ['', '— Total ' + wk], g = 0;
    stages.forEach(function (s) { tot.push(wkTotals[s] || 0); g += (wkTotals[s] || 0); });
    tot.push(g);
    rows.push(tot);
  });
  if (!rows.length) rows = [['(sin datos)', ''].concat(elevaPad(stages.length + 1))];

  var fmts = [null, null].concat(stages.map(function () { return NUMFMT.int; })).concat([NUMFMT.int]);
  writeTable(sh, 4, header, rows, fmts, false);
  sh.setActiveSelection('A1');
}

/* ------------------------------ Menú / acción --------------------------- */

function elevaRenderAll() { elevaRenderMensual(); elevaRenderSemanal(); }

function elevaMenuRenderCurrent() {
  toast('Eleva: generando dashboard…');
  elevaRenderAll();
  toast('Eleva: dashboard actualizado');
}
