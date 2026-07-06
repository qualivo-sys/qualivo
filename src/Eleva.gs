/**
 * Eleva.gs
 * Vistas de Eleva Academy (elevanails.es) — embudo por proveedor, MENSUAL y
 * SEMANAL, con datos en vivo de GoHighLevel.
 *
 * Es un módulo INDEPENDIENTE del dashboard de EAC: reutiliza los helpers
 * comunes (httpJson, ghlHeaders, writeTable, THEME, NUMFMT…) pero no toca la
 * configuración ni el render de EAC.
 *
 * Fuente de la verdad:
 *   - Embudo (oportunidades / entrevistas / matrículas): pipeline de GHL.
 *   - Inversión / leads de plataforma: Meta Ads y Google Ads (resumen).
 *
 * El proveedor de cada oportunidad se deduce del campo `source` de GHL
 * (ver ELEVA_SOURCE_RULES). Las etapas del embudo se leen en vivo del pipeline
 * y se clasifican por NOMBRE, de modo que sigue funcionando si se reordenan.
 */

var ELEVA = {
  clientName: 'Eleva Academy',
  website: 'elevanails.es',
  currencySymbol: '€',
  timezone: 'Europe/Madrid',

  // Nombres de las pestañas que genera este módulo.
  sheets: { mensual: 'Eleva · Mensual', semanal: 'Eleva · Semanal' },

  // Clasificación del embudo por NOMBRE de etapa (sin tildes / minúsculas).
  //   entrevista  = llegó a "Propuesta enviada" o posterior (entrevista hecha;
  //                 "Llamada agendada" es solo cita, puede no presentarse).
  //   matrícula   = etapa "Alumna activa".
  //   descartada  = "No cualificada" (no cuenta como oportunidad ni entrevista).
  stageEntrevistaFrom: 'propuesta enviada',
  stageMatricula: 'alumna activa',
  stageDescartada: 'no cualificada'
};

/**
 * Reglas source (GHL) -> proveedor. Se evalúan en orden; primera que casa gana.
 * `test` se compara en minúsculas contra el source de la oportunidad.
 */
var ELEVA_SOURCE_RULES = [
  { test: 'google', provider: 'Google Ads' },
  { test: 'lead form', provider: 'Meta · Instantáneo' },
  { test: 'formulario', provider: 'Meta · Instantáneo' },
  { test: 'instant', provider: 'Meta · Instantáneo' },
  { test: 'landing', provider: 'Meta · Landing' },
  { test: 'facebook', provider: 'Meta · Facebook (s/d)' },
  { test: 'meta', provider: 'Meta · Landing' }
];

/** Orden de proveedores en las tablas. */
var ELEVA_PROVIDERS = ['Meta · Instantáneo', 'Meta · Landing', 'Meta · Facebook (s/d)', 'Google Ads', 'Otro'];

function elevaProvider(source) {
  var s = String(source || '').toLowerCase();
  for (var i = 0; i < ELEVA_SOURCE_RULES.length; i++) {
    if (s.indexOf(ELEVA_SOURCE_RULES[i].test) >= 0) return ELEVA_SOURCE_RULES[i].provider;
  }
  return 'Otro';
}

/**
 * Lee el pipeline de GHL y devuelve la clasificación de etapas:
 *   { posById:{id:pos}, nameById:{id:name}, entrevistaFromPos, matriculaId, descartadaId }
 */
function elevaStageInfo(token, locationId) {
  var info = { posById: {}, nameById: {}, entrevistaFromPos: 99, matriculaId: null, descartadaId: null };
  var url = 'https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + encodeURIComponent(locationId);
  var json = httpJson(url, { headers: ghlHeaders(token) });
  (json.pipelines || []).forEach(function (p) {
    (p.stages || []).slice().sort(function (a, b) { return (a.position || 0) - (b.position || 0); })
      .forEach(function (s) {
        var pos = s.position || 0;
        info.posById[s.id] = pos;
        info.nameById[s.id] = s.name;
        var n = String(s.name || '').trim().toLowerCase();
        if (n === ELEVA.stageEntrevistaFrom) info.entrevistaFromPos = pos;
        if (n === ELEVA.stageMatricula) info.matriculaId = s.id;
        if (n === ELEVA.stageDescartada) info.descartadaId = s.id;
      });
  });
  return info;
}

/** Clasifica una oportunidad en flags de embudo según la etapa. */
function elevaFunnelFlags(opp, stageInfo) {
  var id = opp.pipelineStageId;
  var pos = stageInfo.posById[id];
  if (pos === undefined) pos = 0;
  var descartada = (id === stageInfo.descartadaId);
  return {
    lead: 1,
    oport: (pos >= 1 && !descartada) ? 1 : 0,
    entrevista: (pos >= stageInfo.entrevistaFromPos && !descartada) ? 1 : 0,
    matricula: (id === stageInfo.matriculaId) ? 1 : 0
  };
}

/** Lunes ISO (YYYY-MM-DD) de la semana que contiene la fecha dada. */
function elevaWeekMonday(dateStr) {
  var d = new Date(dateStr.slice(0, 10) + 'T00:00:00Z');
  var dow = d.getUTCDay();            // 0=domingo … 6=sábado
  var offset = (dow + 6) % 7;         // días desde el lunes
  d.setUTCDate(d.getUTCDate() - offset);
  return fmtDate(d);
}

function elevaEmptyCounter() { return { leads: 0, oport: 0, entrevista: 0, matricula: 0 }; }

function elevaAddInto(target, flags) {
  target.leads += flags.lead;
  target.oport += flags.oport;
  target.entrevista += flags.entrevista;
  target.matricula += flags.matricula;
}

/**
 * Construye el dataset del embudo de Eleva para un mes:
 *   { byProvider:{prov:counter}, byWeek:{week:{prov:counter}}, total:counter, opps:n }
 */
function elevaBuildFunnel(monthKey) {
  var token = getProp('GHL_TOKEN');
  var locationId = getProp('GHL_LOCATION_ID');
  if (!token || !locationId) throw new Error('Faltan credenciales de GHL (GHL_TOKEN / GHL_LOCATION_ID).');

  var range = monthRange(monthKey);
  var stageInfo = elevaStageInfo(token, locationId);
  var opps = ghlSearchOpportunities(token, locationId, range.since, range.until);

  var byProvider = {}, byWeek = {}, total = elevaEmptyCounter();
  opps.forEach(function (o) {
    var prov = elevaProvider(o.source);
    var flags = elevaFunnelFlags(o, stageInfo);
    if (!byProvider[prov]) byProvider[prov] = elevaEmptyCounter();
    elevaAddInto(byProvider[prov], flags);
    elevaAddInto(total, flags);

    var wk = elevaWeekMonday(o.createdAt || range.since);
    if (!byWeek[wk]) byWeek[wk] = {};
    if (!byWeek[wk][prov]) byWeek[wk][prov] = elevaEmptyCounter();
    elevaAddInto(byWeek[wk][prov], flags);
  });

  return { month: monthKey, byProvider: byProvider, byWeek: byWeek, total: total, opps: opps.length,
           generatedAt: Utilities.formatDate(new Date(), ELEVA.timezone, 'yyyy-MM-dd HH:mm') };
}

/** Resumen de inversión de plataforma (Meta + Google) para el mes. Best-effort. */
function elevaSpendSummary(monthKey) {
  var rows = [];
  try {
    var meta = fetchMeta(monthKey);
    if (!meta.error) rows.push({ platform: 'Meta Ads', spend: meta.spend, leads: meta.leads });
  } catch (e) { logInfo('Eleva Meta spend error', e); }
  try {
    var g = fetchGoogleAds(monthKey);
    if (!g.error) rows.push({ platform: 'Google Ads', spend: g.spend, leads: g.leads });
  } catch (e) { logInfo('Eleva Google spend error', e); }
  return rows;
}

/* --------------------------------- Render -------------------------------- */

/** Cabecera común de las pestañas de Eleva. */
function elevaHeader(sh, ncols, subtitle, generatedAt) {
  sh.clear(); sh.clearFormats(); sh.setHiddenGridlines(true);
  setDashboardColumnWidths(sh, ncols);
  var title = sh.getRange(1, 1, 1, ncols).merge();
  title.setValue(ELEVA.clientName + ' · ' + subtitle)
    .setFontSize(18).setFontWeight('bold').setFontColor(THEME.dark);
  sh.setRowHeight(1, 34);
  sh.getRange(2, 1, 1, ncols).merge()
    .setValue(ELEVA.website + '  ·  Fuente embudo: GoHighLevel  ·  Actualizado: ' + (generatedAt || ''))
    .setFontColor('#57606a');
}

/** Fila de embudo de un contador, con ratio lead→matrícula. */
function elevaFunnelRow(label, c) {
  var l2m = safeDiv(c.matricula, c.leads);
  return [label, c.leads, c.oport, c.entrevista, c.matricula, l2m];
}

/** Pinta la pestaña MENSUAL de Eleva para el mes indicado. */
function elevaRenderMensual(monthKey) {
  var ds = elevaBuildFunnel(monthKey);
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ELEVA.sheets.mensual) || ss.insertSheet(ELEVA.sheets.mensual);
  var NC = 6;
  elevaHeader(sh, NC, 'Embudo mensual · ' + monthLabel(monthKey), ds.generatedAt);

  var row = 4;
  // Inversión de plataforma (resumen)
  row = writeSectionHeader(sh, row, NC, 'Inversión (Meta + Google)');
  var spend = elevaSpendSummary(monthKey);
  var invRows = spend.map(function (p) {
    return [p.platform, p.spend, p.leads, safeDiv(p.spend, p.leads), '', ''];
  });
  var totSpend = spend.reduce(function (s, p) { return s + p.spend; }, 0);
  var totLeads = spend.reduce(function (s, p) { return s + p.leads; }, 0);
  invRows.push(['TOTAL', totSpend, totLeads, safeDiv(totSpend, totLeads), '', '']);
  if (!spend.length) invRows = [['(sin credenciales Meta/Google — configúralas para la inversión en vivo)', '', '', '', '', '']];
  row = writeTable(sh, row, ['Plataforma', 'Inversión €', 'Leads', 'CPL €', '', ''],
    invRows, [null, NUMFMT.eur, NUMFMT.int, NUMFMT.eur, null, null], spend.length > 0);

  // Embudo por proveedor (GHL)
  row = writeSectionHeader(sh, row, NC, 'Embudo por proveedor · GHL (cohorte creada en el mes)');
  var header = ['Proveedor', 'Leads', 'Oportunidades', 'Entrevistas', 'Matrículas', 'Lead→Matrícula'];
  var rows = ELEVA_PROVIDERS.filter(function (p) { return ds.byProvider[p]; })
    .map(function (p) { return elevaFunnelRow(p, ds.byProvider[p]); });
  rows.push(elevaFunnelRow('TOTAL', ds.total));
  var fmts = [null, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.pct];
  row = writeTable(sh, row, header, rows, fmts, true);

  sh.getRange(row, 1, 1, NC).merge().setValue(
    'Entrevista = oportunidad que llegó a "Propuesta enviada" o posterior (entrevista hecha). ' +
    'Matrícula = etapa "Alumna activa". "Facebook (s/d)" = source Meta sin desglose instant/landing en GHL.'
  ).setFontColor('#57606a').setWrap(true);

  sh.setActiveSelection('A1');
}

/** Pinta la pestaña SEMANAL de Eleva para el mes indicado. */
function elevaRenderSemanal(monthKey) {
  var ds = elevaBuildFunnel(monthKey);
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ELEVA.sheets.semanal) || ss.insertSheet(ELEVA.sheets.semanal);
  var NC = 7;
  elevaHeader(sh, NC, 'Embudo semanal · ' + monthLabel(monthKey), ds.generatedAt);

  var header = ['Semana', 'Proveedor', 'Leads', 'Oportunidades', 'Entrevistas', 'Matrículas', 'Lead→Matrícula'];
  var rows = [];
  Object.keys(ds.byWeek).sort().forEach(function (wk) {
    var week = ds.byWeek[wk];
    var weekTotal = elevaEmptyCounter();
    ELEVA_PROVIDERS.filter(function (p) { return week[p]; }).forEach(function (p) {
      var c = week[p];
      rows.push([wk, p, c.leads, c.oport, c.entrevista, c.matricula, safeDiv(c.matricula, c.leads)]);
      elevaAddInto(weekTotal, { lead: c.leads, oport: c.oport, entrevista: c.entrevista, matricula: c.matricula });
    });
    rows.push([wk, '— Total semana', weekTotal.leads, weekTotal.oport, weekTotal.entrevista,
      weekTotal.matricula, safeDiv(weekTotal.matricula, weekTotal.leads)]);
  });
  if (!rows.length) rows = [['(sin datos)', '', '', '', '', '', '']];
  var fmts = [null, null, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.pct];
  writeTable(sh, 4, header, rows, fmts, false);
  sh.setActiveSelection('A1');
}

/** Pinta ambas vistas de Eleva para el mes en curso (o el indicado). */
function elevaRenderAll(monthKey) {
  monthKey = monthKey || currentMonthKey();
  elevaRenderMensual(monthKey);
  elevaRenderSemanal(monthKey);
}

/* ------------------------------ Menú / acciones --------------------------- */

function elevaMenuRenderCurrent() {
  var m = currentMonthKey();
  toast('Eleva: generando embudo de ' + monthLabel(m) + '…');
  elevaRenderAll(m);
  toast('Eleva listo: ' + monthLabel(m));
}
