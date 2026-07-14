/**
 * Eleva.gs
 * Vistas de Eleva Academy (elevanails.es): inversión por canal (Meta en vivo +
 * Google manual) y leads POR CANAL Y ETAPA del pipeline (Nuevos, Respondidos,
 * Agendados, Propuesta, Negociación, Ganados, No cualif.), MENSUAL y SEMANAL,
 * con datos en vivo de GoHighLevel + Meta Marketing API.
 *
 * Módulo INDEPENDIENTE del dashboard de EAC: reutiliza helpers comunes
 * (httpJson, ghlHeaders, ghlSearchOpportunities, ghlStageNameMap, writeTable,
 * THEME, NUMFMT…). Cada lead se cuenta en su etapa ACTUAL.
 *
 * Credenciales (Script Properties): GHL_TOKEN, GHL_LOCATION_ID,
 * META_ACCESS_TOKEN, META_AD_ACCOUNT_ID (sin act_), META_API_VERSION (opc.).
 */

var ELEVA = {
  clientName: 'Eleva Academy',
  website: 'elevanails.es',
  timezone: 'Europe/Madrid',
  sheets: { mensual: 'Eleva · Mensual', semanal: 'Eleva · Semanal' },

  meses: ['2026-07', '2026-06'],
  mesSemanal: '2026-07',

  // Google Ads manual (mensual) hasta conectar su API.
  googleInv: { '2026-07': { spend: 157.62, leads: 15 } },

  // Las columnas del embudo usan los nombres de etapa TAL CUAL están en GHL
  // (orden del pipeline). `ganadosStage` marca la etapa que cuenta como matrícula.
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

/* ------------------------------ GHL (embudo) ---------------------------- */

function elevaProvider(source) {
  var s = String(source || '').toLowerCase();
  for (var i = 0; i < ELEVA.sourceRules.length; i++) if (s.indexOf(ELEVA.sourceRules[i].test) >= 0) return ELEVA.sourceRules[i].provider;
  return 'Otro';
}

/** Lee el pipeline: {order:[nombres], map:{stageId:nombre}, ganados:nombre}. */
function elevaPipeline() {
  var token = getProp('GHL_TOKEN'), locationId = getProp('GHL_LOCATION_ID');
  if (!token || !locationId) throw new Error('Faltan credenciales de GHL (GHL_TOKEN / GHL_LOCATION_ID).');
  var url = 'https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + encodeURIComponent(locationId);
  var json = httpJson(url, { headers: ghlHeaders(token) });
  var order = [], map = {}, ganados = '';
  (json.pipelines || []).forEach(function (p) {
    (p.stages || []).slice().sort(function (a, b) { return (a.position || 0) - (b.position || 0); }).forEach(function (s) {
      map[s.id] = s.name;
      if (order.indexOf(s.name) < 0) order.push(s.name);
      if (String(s.name || '').trim().toLowerCase() === ELEVA.ganadosStage) ganados = s.name;
    });
  });
  if (!ganados && order.length) ganados = order[order.length - 1];
  return { order: order, map: map, ganados: ganados };
}

function elevaMatrix(opps, stageMap) {
  var m = {};
  opps.forEach(function (o) {
    var prov = elevaProvider(o.source), label = stageMap[o.pipelineStageId] || '(otra)';
    if (!m[prov]) m[prov] = {};
    m[prov][label] = (m[prov][label] || 0) + 1;
  });
  return m;
}

function elevaOpps(monthKey) {
  var r = monthRange(monthKey);
  return ghlSearchOpportunities(getProp('GHL_TOKEN'), getProp('GHL_LOCATION_ID'), r.since, r.until);
}

/* ---------------------------- Meta (inversión) -------------------------- */

function elevaMetaChannel(name) {
  var n = String(name || '').toLowerCase();
  if (n.indexOf('landing') >= 0) return 'Meta · Landing';
  if (n.indexOf('lead') >= 0 || n.indexOf('instant') >= 0 || n.indexOf('formulario') >= 0) return 'Meta · Instantáneo';
  return 'Meta · (otro)';
}
function elevaMetaLeads(actions) {
  if (!actions) return 0;
  var by = {}; actions.forEach(function (a) { by[a.action_type] = toNumber(a.value); });
  if (by['lead'] != null) return by['lead'];
  return (by['onsite_conversion.lead_grouped'] || 0) + (by['offsite_conversion.fb_pixel_lead'] || 0);
}
/** Insights diarios por campaña: [{date, channel, spend, leads}] (o null sin creds). */
function elevaMetaDaily(since, until) {
  var token = getProp('META_ACCESS_TOKEN'), acct = getProp('META_AD_ACCOUNT_ID').replace(/^act_/, '');
  if (!token || !acct) return null;
  var ver = getProp('META_API_VERSION', 'v21.0');
  var url = 'https://graph.facebook.com/' + ver + '/act_' + acct + '/insights?level=campaign&time_increment=1' +
    '&fields=campaign_name,spend,actions&limit=500' +
    '&time_range=' + encodeURIComponent(JSON.stringify({ since: since, until: until })) +
    '&access_token=' + encodeURIComponent(token);
  var out = [], guard = 0;
  while (url && guard < 50) {
    var json = httpJson(url); guard++;
    (json.data || []).forEach(function (r) {
      out.push({ date: r.date_start, channel: elevaMetaChannel(r.campaign_name), spend: toNumber(r.spend), leads: elevaMetaLeads(r.actions) });
    });
    url = (json.paging && json.paging.next) ? json.paging.next : null;
  }
  return out;
}
function elevaMetaMonthly(daily) {
  var m = {};
  (daily || []).forEach(function (d) { if (!m[d.channel]) m[d.channel] = { spend: 0, leads: 0 }; m[d.channel].spend += d.spend; m[d.channel].leads += d.leads; });
  return m;
}
function elevaMetaWeekly(daily) {
  var w = {};
  (daily || []).forEach(function (d) {
    var wk = elevaWeekMonday(d.date);
    if (!w[wk]) w[wk] = {}; if (!w[wk][d.channel]) w[wk][d.channel] = { spend: 0, leads: 0 };
    w[wk][d.channel].spend += d.spend; w[wk][d.channel].leads += d.leads;
  });
  return w;
}
function elevaInvestment(monthKey) {
  var r = monthRange(monthKey);
  var daily = elevaMetaDaily(r.since, r.until);
  var byChannel = elevaMetaMonthly(daily);
  var g = ELEVA.googleInv[monthKey];
  if (g) byChannel['Google Ads'] = { spend: g.spend, leads: g.leads };
  return { byChannel: byChannel, metaWeekly: elevaMetaWeekly(daily) };
}

/* -------------------------------- Utilidades ---------------------------- */

function elevaWeekMonday(dateStr) {
  var d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00Z');
  var off = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - off);
  return fmtDate(d);
}
function elevaSum(obj) { var t = 0; for (var k in obj) t += obj[k]; return t; }
function elevaPad(n) { var a = []; for (var i = 0; i < n; i++) a.push(''); return a; }
function elevaNow() { return Utilities.formatDate(new Date(), ELEVA.timezone, 'dd/MM/yyyy HH:mm'); }

function elevaInitSheet(sh, ncols, title, sub) {
  sh.clear(); sh.clearFormats(); sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 200);
  for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 95);
  sh.getRange(1, 1, 1, ncols).merge().setValue(title).setFontSize(17).setFontWeight('bold').setFontColor(THEME.dark);
  sh.setRowHeight(1, 30);
  sh.getRange(2, 1, 1, ncols).merge().setValue(sub).setFontColor('#57606a');
}
function elevaWriteInvestment(sh, row, ncols, byChannel) {
  var order = ['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)', 'Google Ads'];
  var rows = [], tS = 0, tL = 0;
  order.forEach(function (ch) {
    var v = byChannel[ch]; if (!v) return;
    rows.push([ch, v.spend, v.leads, safeDiv(v.spend, v.leads)].concat(elevaPad(ncols - 4)));
    tS += v.spend; tL += v.leads;
  });
  if (!rows.length) { sh.getRange(row, 1, 1, ncols).merge().setValue('Sin inversión (configura META_ACCESS_TOKEN / ELEVA.googleInv).').setFontColor('#57606a').setFontStyle('italic'); return row + 2; }
  rows.push(['TOTAL', tS, tL, safeDiv(tS, tL)].concat(elevaPad(ncols - 4)));
  return writeTable(sh, row, ['Canal', 'Inversión €', 'Leads (plataf.)', 'CPL €'].concat(elevaPad(ncols - 4)),
    rows, [null, NUMFMT.eur, NUMFMT.int, NUMFMT.eur], true);
}

/* -------------------------------- MENSUAL ------------------------------- */

function elevaRenderMensual() {
  var pipe = elevaPipeline();
  var stageMap = pipe.map, stages = pipe.order, ganados = pipe.ganados;
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ELEVA.sheets.mensual) || ss.insertSheet(ELEVA.sheets.mensual);
  var NC = 2 + stages.length + 2;
  elevaInitSheet(sh, NC, ELEVA.clientName + ' · Inversión y leads por canal/etapa (mensual)',
    ELEVA.website + '  ·  Embudo: GHL  ·  Inversión: Meta (en vivo) + Google (manual)  ·  Actualizado: ' + elevaNow());
  var row = 4;

  ELEVA.meses.forEach(function (monthKey) {
    var opps = elevaOpps(monthKey);
    var m = elevaMatrix(opps, stageMap);
    var inv = elevaInvestment(monthKey);

    row = writeSectionHeader(sh, row, NC, 'Inversión · ' + monthLabel(monthKey));
    row = elevaWriteInvestment(sh, row, NC, inv.byChannel);

    row = writeSectionHeader(sh, row, NC, 'Leads por canal y etapa · ' + monthLabel(monthKey) + ' (cohorte del mes)');
    var header = ['Canal'].concat(stages).concat(['Total', '% Ganado']);
    var rows = [], totals = {};
    ELEVA.providers.forEach(function (p) {
      if (!m[p]) return;
      var line = [p], tot = elevaSum(m[p]);
      stages.forEach(function (s) { var v = m[p][s] || 0; line.push(v); totals[s] = (totals[s] || 0) + v; });
      line.push(tot); line.push(safeDiv(m[p][ganados] || 0, tot));
      rows.push(line);
    });
    var grand = 0; stages.forEach(function (s) { grand += (totals[s] || 0); });
    var totalLine = ['TOTAL'].concat(stages.map(function (s) { return totals[s] || 0; }));
    totalLine.push(grand); totalLine.push(safeDiv(totals[ganados] || 0, grand));
    rows.push(totalLine);
    var fmts = [null].concat(stages.map(function () { return NUMFMT.int; })).concat([NUMFMT.int, NUMFMT.pct]);
    row = writeTable(sh, row, header, rows.length ? rows : [['(sin datos)'].concat(elevaPad(NC - 1))], fmts, rows.length > 0);
    row += 1;
  });

  sh.getRange(row, 1, 1, NC).merge().setValue(
    'Cada lead se cuenta en su etapa ACTUAL del pipeline (nombres tal cual en GHL); "Alumna activa" = matrícula. ' +
    'Inversión Meta en vivo (instantáneo=formulario, landing=web); Google manual hasta conectar su API.'
  ).setFontColor('#57606a').setWrap(true);
  sh.setActiveSelection('A1');
}

/* -------------------------------- SEMANAL ------------------------------- */

function elevaRenderSemanal() {
  var pipe = elevaPipeline();
  var stageMap = pipe.map, stages = pipe.order;
  var monthKey = ELEVA.mesSemanal;
  var opps = elevaOpps(monthKey);
  var inv = elevaInvestment(monthKey);
  var range = monthRange(monthKey);

  var byWeek = {};
  opps.forEach(function (o) { var wk = elevaWeekMonday(o.createdAt || range.since); if (!byWeek[wk]) byWeek[wk] = []; byWeek[wk].push(o); });

  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ELEVA.sheets.semanal) || ss.insertSheet(ELEVA.sheets.semanal);
  var NC = 2 + stages.length + 1;
  elevaInitSheet(sh, NC, ELEVA.clientName + ' · Semanal · ' + monthLabel(monthKey),
    'Cohorte por semana de creación del lead  ·  GHL + Meta (en vivo)  ·  Actualizado: ' + elevaNow());

  var row = writeSectionHeader(sh, 4, NC, 'Inversión semanal · Meta');
  var invRows = [];
  Object.keys(inv.metaWeekly).sort().forEach(function (wk) {
    var chs = inv.metaWeekly[wk];
    ['Meta · Instantáneo', 'Meta · Landing', 'Meta · (otro)'].forEach(function (ch) {
      if (!chs[ch]) return;
      invRows.push([wk, ch, chs[ch].spend, chs[ch].leads, safeDiv(chs[ch].spend, chs[ch].leads)].concat(elevaPad(NC - 5)));
    });
  });
  if (invRows.length) {
    row = writeTable(sh, row, ['Semana', 'Canal', 'Inversión €', 'Leads', 'CPL €'].concat(elevaPad(NC - 5)),
      invRows, [null, null, NUMFMT.eur, NUMFMT.int, NUMFMT.eur], false);
  } else {
    sh.getRange(row, 1, 1, NC).merge().setValue('Sin inversión Meta (configura META_ACCESS_TOKEN).').setFontColor('#57606a').setFontStyle('italic');
    row += 2;
  }
  row += 1;

  row = writeSectionHeader(sh, row, NC, 'Leads por canal y etapa · por semana');
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
  writeTable(sh, row, header, rows, fmts, false);
  sh.setActiveSelection('A1');
}

/* ------------------------------ Menú / acción --------------------------- */

function elevaRenderAll() { elevaRenderMensual(); elevaRenderSemanal(); }
function elevaMenuRenderCurrent() { toast('Eleva: generando dashboard…'); elevaRenderAll(); toast('Eleva: dashboard actualizado'); }
