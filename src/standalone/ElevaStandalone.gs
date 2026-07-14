/**
 * ElevaStandalone.gs — Dashboard de Eleva Academy en UN solo archivo.
 *
 * Pega TODO este archivo en:  tu Google Sheet → Extensiones → Apps Script
 * (borra el Code.gs de ejemplo, pega esto, guarda) y ejecuta `elevaGenerar`.
 * Autoriza permisos la primera vez. Crea/actualiza dos pestañas formateadas:
 * «Eleva · Mensual» y «Eleva · Semanal».
 *
 * Muestra, POR CANAL: la inversión (Meta en vivo + Google manual) y cuántos
 * leads hay en cada etapa del pipeline (Nuevos, Respondidos, Agendados,
 * Propuesta, Negociación, Ganados, No cualif.), por mes y por semana.
 * Fuentes: GoHighLevel (embudo) + Meta Marketing API (inversión).
 */

var CFG = {
  // --- GoHighLevel (embudo) ---
  GHL_TOKEN: '',            // <-- token pit-xxxxxxxx
  GHL_LOCATION_ID: '',      // <-- location id

  // --- Meta Ads (inversión, en vivo) ---
  META_TOKEN: '',           // <-- token de Meta (EAAG...). Vacío = inversión Meta off
  META_ACT: '2028650084720565',   // id de la cuenta SIN el prefijo act_
  META_API_VERSION: 'v21.0',

  // --- Google Ads (inversión manual, por campaña, hasta tener API) por mes ---
  googleInv: {
    '2026-07': { 'Google · Performance Max': { spend: 200.55, leads: 26 },
                 'Google · Search': { spend: 201.61, leads: 20 } }
  },

  timezone: 'Europe/Madrid',
  meses: ['2026-07', '2026-06'],   // tablas de la pestaña Mensual (reciente primero)
  mesSemanal: '2026-07',           // mes de la pestaña Semanal
  sheetMensual: 'Eleva · Mensual',
  sheetSemanal: 'Eleva · Semanal',

  // Las columnas del embudo usan los nombres de etapa TAL CUAL están en GHL
  // (en el orden del pipeline). `ganadosStage` (en minúsculas) marca la etapa
  // que cuenta como matrícula para el % Ganado.
  ganadosStage: 'alumna activa',

  providers: ['Meta · Instantáneo', 'Meta · Landing', 'Meta · Facebook (s/d)', 'Google Ads', 'Otro'],
  sourceRules: [
    { test: 'google', provider: 'Google Ads' },
    { test: 'lead form', provider: 'Meta · Instantáneo' },
    { test: 'formulario', provider: 'Meta · Instantáneo' },
    { test: 'instant', provider: 'Meta · Instantáneo' },
    { test: 'landing', provider: 'Meta · Landing' },
    { test: 'facebook', provider: 'Meta · Facebook (s/d)' },
    { test: 'meta', provider: 'Meta · Landing' }
  ]
};

/* ============================ Menú ============================ */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Eleva Academy')
    .addItem('Generar dashboard (mensual + semanal)', 'elevaGenerar')
    .addToUi();
}

function elevaGenerar() {
  elevaRenderMensual_();
  elevaRenderSemanal_();
  SpreadsheetApp.getActive().toast('Dashboard de Eleva actualizado', 'Eleva Academy', 5);
}

/* ============================ HTTP ============================ */

function elevaHttp_(url, headers) {
  var res = UrlFetchApp.fetch(url, { headers: headers || {}, muteHttpExceptions: true });
  var code = res.getResponseCode(), body = res.getContentText();
  if (code < 200 || code >= 300) throw new Error('HTTP ' + code + ': ' + body.slice(0, 300));
  return body ? JSON.parse(body) : {};
}
function elevaGhlHeaders_() { return { 'Authorization': 'Bearer ' + CFG.GHL_TOKEN, 'Version': '2021-07-28', 'Accept': 'application/json' }; }

/* ============================ GHL (embudo) ============================ */

/** Lee el pipeline: {order:[nombres de etapa], map:{stageId:nombre}, ganados:nombre}. */
function elevaPipeline_() {
  var url = 'https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + encodeURIComponent(CFG.GHL_LOCATION_ID);
  var json = elevaHttp_(url, elevaGhlHeaders_());
  var order = [], map = {}, ganados = '';
  (json.pipelines || []).forEach(function (p) {
    (p.stages || []).slice().sort(function (a, b) { return (a.position || 0) - (b.position || 0); }).forEach(function (s) {
      map[s.id] = s.name;
      if (order.indexOf(s.name) < 0) order.push(s.name);
      if (String(s.name || '').trim().toLowerCase() === CFG.ganadosStage) ganados = s.name;
    });
  });
  if (!ganados && order.length) ganados = order[order.length - 1];
  return { order: order, map: map, ganados: ganados };
}

function elevaFetchOpps_(since, until) {
  var url = 'https://services.leadconnectorhq.com/opportunities/search?location_id=' +
    encodeURIComponent(CFG.GHL_LOCATION_ID) + '&limit=100';
  var out = [], pages = 0;
  while (url && pages < 120) {
    var json = elevaHttp_(url, elevaGhlHeaders_()); pages++;
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
  for (var i = 0; i < CFG.sourceRules.length; i++) if (s.indexOf(CFG.sourceRules[i].test) >= 0) return CFG.sourceRules[i].provider;
  return 'Otro';
}
function elevaMatrix_(opps, stageMap) {
  var m = {};
  opps.forEach(function (o) {
    var prov = elevaProvider_(o.source), label = stageMap[o.pipelineStageId] || '(otra)';
    if (!m[prov]) m[prov] = {};
    m[prov][label] = (m[prov][label] || 0) + 1;
  });
  return m;
}

/* ============================ Meta (inversión) ============================ */

function elevaMetaChannel_(name) {
  var n = String(name || '').toLowerCase();
  if (n.indexOf('landing') >= 0) return 'Meta · Landing';
  if (n.indexOf('lead') >= 0 || n.indexOf('instant') >= 0 || n.indexOf('formulario') >= 0) return 'Meta · Instantáneo';
  return 'Meta · (otro)';
}
function elevaMetaLeads_(actions) {
  if (!actions) return 0;
  var by = {}; actions.forEach(function (a) { by[a.action_type] = parseFloat(a.value) || 0; });
  if (by['lead'] != null) return by['lead'];
  return (by['onsite_conversion.lead_grouped'] || 0) + (by['offsite_conversion.fb_pixel_lead'] || 0);
}
/** Insights diarios por campaña en [since, until]: [{date, channel, spend, leads}]. */
function elevaMetaDaily_(since, until) {
  if (!CFG.META_TOKEN) return null;
  var base = 'https://graph.facebook.com/' + CFG.META_API_VERSION + '/act_' + CFG.META_ACT + '/insights';
  var q = '?level=campaign&time_increment=1&fields=campaign_name,spend,actions&limit=500' +
    '&time_range=' + encodeURIComponent(JSON.stringify({ since: since, until: until })) +
    '&access_token=' + encodeURIComponent(CFG.META_TOKEN);
  var url = base + q, out = [], guard = 0;
  while (url && guard < 50) {
    var json = elevaHttp_(url); guard++;
    (json.data || []).forEach(function (r) {
      out.push({ date: r.date_start, channel: elevaMetaChannel_(r.campaign_name), spend: parseFloat(r.spend) || 0, leads: elevaMetaLeads_(r.actions) });
    });
    url = (json.paging && json.paging.next) ? json.paging.next : null;
  }
  return out;
}
function elevaMetaMonthly_(daily) {
  var m = {};
  (daily || []).forEach(function (d) {
    if (!m[d.channel]) m[d.channel] = { spend: 0, leads: 0 };
    m[d.channel].spend += d.spend; m[d.channel].leads += d.leads;
  });
  return m;
}
function elevaMetaWeekly_(daily) {
  var w = {};
  (daily || []).forEach(function (d) {
    var wk = elevaWeekMonday_(d.date);
    if (!w[wk]) w[wk] = {};
    if (!w[wk][d.channel]) w[wk][d.channel] = { spend: 0, leads: 0 };
    w[wk][d.channel].spend += d.spend; w[wk][d.channel].leads += d.leads;
  });
  return w;
}

/* ============================ Fechas ============================ */

function elevaMonthRange_(monthKey) {
  var p = monthKey.split('-'), y = +p[0], m = +p[1];
  var first = new Date(Date.UTC(y, m - 1, 1)), last = new Date(Date.UTC(y, m, 0));
  return { since: Utilities.formatDate(first, 'UTC', 'yyyy-MM-dd'), until: Utilities.formatDate(last, 'UTC', 'yyyy-MM-dd') };
}
function elevaWeekMonday_(dateStr) {
  var d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00Z');
  var off = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - off);
  return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}
var ELEVA_MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function elevaMonthLabel_(monthKey) { var p = monthKey.split('-'); return ELEVA_MESES[(+p[1]) - 1] + ' ' + p[0]; }
function elevaNow_() { return Utilities.formatDate(new Date(), CFG.timezone, 'dd/MM/yyyy HH:mm'); }

/* ============================ Formato ============================ */

var ELV = { dark: '#0f2233', accent: '#1f6feb', total: '#11324d', light: '#eef3f8', border: '#d0d7de', white: '#ffffff', grey: '#57606a' };
var ELVFMT = { eur: '€#,##0.00', int: '#,##0', pct: '0.0%' };

function elevaInitSheet_(sh, ncols, title, sub) {
  sh.clear(); sh.clearFormats(); sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 200);
  for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 95);
  sh.getRange(1, 1, 1, ncols).merge().setValue(title).setFontSize(17).setFontWeight('bold').setFontColor(ELV.dark);
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
function elevaPad_(n) { var a = []; for (var i = 0; i < n; i++) a.push(''); return a; }

/* ====================== Tabla de inversión (reutilizable) ====================== */

/** Devuelve {byChannel:{ch:{spend,leads}}, metaWeekly:{wk:{ch:{spend,leads}}}}. */
function elevaInvestment_(monthKey) {
  var r = elevaMonthRange_(monthKey);
  var daily = elevaMetaDaily_(r.since, r.until);
  var byChannel = elevaMetaMonthly_(daily);         // Meta en vivo
  var g = CFG.googleInv[monthKey] || {};
  Object.keys(g).forEach(function (ch) { byChannel[ch] = g[ch]; });   // Google manual (por campaña)
  return { byChannel: byChannel, metaWeekly: elevaMetaWeekly_(daily) };
}

/** Pinta la tabla de inversión (Canal · Inversión · Leads · CPL) y devuelve la fila siguiente. */
function elevaWriteInvestment_(sh, row, ncols, byChannel) {
  var order = ['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)', 'Google · Performance Max', 'Google · Search', 'Google Ads'];
  var rows = [], tS = 0, tL = 0;
  order.forEach(function (ch) {
    var v = byChannel[ch]; if (!v) return;
    rows.push([ch, v.spend, v.leads, elevaDiv_(v.spend, v.leads)].concat(elevaPad_(ncols - 4)));
    tS += v.spend; tL += v.leads;
  });
  if (!rows.length) return elevaNote_(sh, row, ncols, 'Sin inversión (configura CFG.META_TOKEN y/o CFG.googleInv).');
  rows.push(['TOTAL', tS, tL, elevaDiv_(tS, tL)].concat(elevaPad_(ncols - 4)));
  return elevaTable_(sh, row, ['Canal', 'Inversión €', 'Leads (plataf.)', 'CPL €'].concat(elevaPad_(ncols - 4)),
    rows, [null, ELVFMT.eur, ELVFMT.int, ELVFMT.eur], true);
}

/* ============================ Render: MENSUAL ============================ */

function elevaRenderMensual_() {
  var pipe = elevaPipeline_();
  var stageMap = pipe.map, stages = pipe.order, ganados = pipe.ganados;
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CFG.sheetMensual) || ss.insertSheet(CFG.sheetMensual);
  var NC = 2 + stages.length + 2;
  elevaInitSheet_(sh, NC, 'Eleva Academy · Inversión y leads por canal/etapa (mensual)',
    'elevanails.es  ·  Embudo: GoHighLevel  ·  Inversión: Meta (en vivo) + Google (manual)  ·  Actualizado: ' + elevaNow_());
  var row = 4;

  CFG.meses.forEach(function (monthKey) {
    var r = elevaMonthRange_(monthKey);
    var opps = elevaFetchOpps_(r.since, r.until);
    var m = elevaMatrix_(opps, stageMap);
    var inv = elevaInvestment_(monthKey);

    row = elevaSection_(sh, row, NC, 'Inversión · ' + elevaMonthLabel_(monthKey));
    row = elevaWriteInvestment_(sh, row, NC, inv.byChannel);

    row = elevaSection_(sh, row, NC, 'Leads por canal y etapa · ' + elevaMonthLabel_(monthKey) + ' (cohorte del mes)');
    var header = ['Canal'].concat(stages).concat(['Total', '% Ganado']);
    var rows = [], totals = {};
    CFG.providers.forEach(function (p) {
      if (!m[p]) return;
      var line = [p], tot = elevaSum_(m[p]);
      stages.forEach(function (s) { var v = m[p][s] || 0; line.push(v); totals[s] = (totals[s] || 0) + v; });
      line.push(tot); line.push(elevaDiv_(m[p][ganados] || 0, tot));
      rows.push(line);
    });
    var grand = 0; stages.forEach(function (s) { grand += (totals[s] || 0); });
    var totalLine = ['TOTAL'].concat(stages.map(function (s) { return totals[s] || 0; }));
    totalLine.push(grand); totalLine.push(elevaDiv_(totals[ganados] || 0, grand));
    rows.push(totalLine);
    var fmts = [null].concat(stages.map(function () { return ELVFMT.int; })).concat([ELVFMT.int, ELVFMT.pct]);
    row = elevaTable_(sh, row, header, rows.length ? rows : [['(sin datos)'].concat(elevaPad_(NC - 1))], fmts, rows.length > 0);
    row += 1;
  });

  elevaNote_(sh, row, NC,
    'Cada lead se cuenta en su etapa ACTUAL del pipeline (nombres tal cual en GHL); "Alumna activa" = matrícula. ' +
    'Inversión Meta en vivo (instantáneo=formulario, landing=web). Google es manual hasta conectar su API. ' +
    'Nota: muchos leads en etapas tempranas están marcados como abandonados/perdidos en GHL.');
  sh.setActiveSelection('A1');
}

/* ============================ Render: SEMANAL ============================ */

function elevaRenderSemanal_() {
  var pipe = elevaPipeline_();
  var stageMap = pipe.map, stages = pipe.order;
  var monthKey = CFG.mesSemanal;
  var r = elevaMonthRange_(monthKey);
  var opps = elevaFetchOpps_(r.since, r.until);
  var inv = elevaInvestment_(monthKey);

  var byWeek = {};
  opps.forEach(function (o) {
    var wk = elevaWeekMonday_(o.createdAt || r.since);
    if (!byWeek[wk]) byWeek[wk] = [];
    byWeek[wk].push(o);
  });

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CFG.sheetSemanal) || ss.insertSheet(CFG.sheetSemanal);
  var NC = 2 + stages.length + 1;
  elevaInitSheet_(sh, NC, 'Eleva Academy · Semanal · ' + elevaMonthLabel_(monthKey),
    'Cohorte por semana de creación del lead  ·  GHL + Meta (en vivo)  ·  Actualizado: ' + elevaNow_());

  // --- Inversión semanal (Meta) ---
  var row = elevaSection_(sh, 4, NC, 'Inversión semanal · Meta');
  var invRows = [];
  Object.keys(inv.metaWeekly).sort().forEach(function (wk) {
    var chs = inv.metaWeekly[wk];
    ['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)'].forEach(function (ch) {
      if (!chs[ch]) return;
      invRows.push([wk, ch, chs[ch].spend, chs[ch].leads, elevaDiv_(chs[ch].spend, chs[ch].leads)].concat(elevaPad_(NC - 5)));
    });
  });
  if (invRows.length) {
    row = elevaTable_(sh, row, ['Semana', 'Canal', 'Inversión €', 'Leads', 'CPL €'].concat(elevaPad_(NC - 5)),
      invRows, [null, null, ELVFMT.eur, ELVFMT.int, ELVFMT.eur], false);
  } else {
    row = elevaNote_(sh, row, NC, 'Sin inversión Meta (configura CFG.META_TOKEN).');
  }
  row += 1;

  // --- Embudo semanal por canal y etapa ---
  row = elevaSection_(sh, row, NC, 'Leads por canal y etapa · por semana');
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
    var tot = ['', '— Total ' + wk], g = 0;
    stages.forEach(function (s) { tot.push(wkTotals[s] || 0); g += (wkTotals[s] || 0); });
    tot.push(g);
    rows.push(tot);
  });
  if (!rows.length) rows = [['(sin datos)', ''].concat(elevaPad_(stages.length + 1))];
  var fmts = [null, null].concat(stages.map(function () { return ELVFMT.int; })).concat([ELVFMT.int]);
  var start = row;
  elevaTable_(sh, start, header, rows, fmts, false);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][1]).indexOf('— Total') === 0) sh.getRange(start + 1 + i, 1, 1, NC).setBackground(ELV.light).setFontWeight('bold');
  }
  sh.setActiveSelection('A1');
}
