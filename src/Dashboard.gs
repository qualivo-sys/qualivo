/**
 * Dashboard.gs
 * Renderiza la pestaña Dashboard para un mes (desde la caché) y la pestaña
 * Comparativa (KPIs mes a mes). El selector de mes es un desplegable en B2
 * con un trigger onEdit que vuelve a pintar.
 */

var DASH_COLS = 7; // nº de columnas del layout

/** Pinta el Dashboard para el mes seleccionado (o el más reciente cacheado). */
function renderDashboard(monthKey) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.dashboard) || ss.insertSheet(SHEETS.dashboard);
  var months = cacheMonths();
  if (!monthKey) monthKey = (months[0] || currentMonthKey());

  var ds = cacheGet(monthKey);
  sh.clear();
  sh.clearFormats();
  setDashboardColumnWidths(sh, DASH_COLS);
  sh.setHiddenGridlines(true);

  // --- Cabecera + selector ---
  var titleRange = sh.getRange(1, 1, 1, DASH_COLS).merge();
  titleRange.setValue(CLIENT.name + ' · Dashboard de Métricas')
    .setFontSize(18).setFontWeight('bold').setFontColor(THEME.dark);
  sh.setRowHeight(1, 34);

  sh.getRange(2, 1).setValue('Mes:').setFontWeight('bold').setHorizontalAlignment('right');
  var selCell = sh.getRange(2, 2);
  if (months.length) {
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(months, true).build();
    selCell.setDataValidation(rule);
  }
  selCell.setValue(monthKey).setFontWeight('bold').setBackground(THEME.light)
    .setHorizontalAlignment('center');

  if (!ds) {
    sh.getRange(4, 1, 1, DASH_COLS).merge()
      .setValue('Sin datos para ' + monthLabel(monthKey) + '. Usa el menú "EAC Dashboard → Refrescar" tras configurar las credenciales.')
      .setFontColor(THEME.warn);
    return;
  }

  sh.getRange(2, 4).setValue('Actualizado: ' + (ds.generatedAt || ''))
    .setFontColor('#57606a').setHorizontalAlignment('right');
  sh.getRange(2, 5, 1, 3).merge();

  var row = 4;

  // --- KPIs blended ---
  row = writeSectionHeader(sh, row, DASH_COLS, 'Resumen general · ' + ds.label);
  var t = ds.total;
  row = writeKpiGrid(sh, row, [
    { label: 'Inversión total', value: t.spend, format: NUMFMT.eur },
    { label: 'Impresiones', value: t.impressions, format: NUMFMT.int },
    { label: 'Clicks', value: t.clicks, format: NUMFMT.int },
    { label: 'CTR', value: t.ctr / 100, format: NUMFMT.pct },
    { label: 'Leads totales', value: t.leads, format: NUMFMT.int },
    { label: 'CPL blended', value: t.cpl, format: NUMFMT.eur },
    { label: 'Budget contratado', value: ds.budget, format: NUMFMT.eur0 },
    { label: '% Budget gastado', value: ds.budgetSpentPct / 100, format: NUMFMT.pct0 }
  ], 4);

  // --- Por plataforma ---
  row = writeSectionHeader(sh, row, DASH_COLS, 'Por plataforma');
  var platHeader = ['Plataforma', 'Inversión €', 'Impresiones', 'Clicks', 'CTR', 'Leads', 'CPL €'];
  var platRows = ds.platforms.map(function (p) {
    return [p.platform + (p.error ? ' ⚠' : ''), p.spend, p.impressions, p.clicks, p.ctr / 100, p.leads, p.cpl];
  });
  platRows.push(['TOTAL', t.spend, t.impressions, t.clicks, t.ctr / 100, t.leads, t.cpl]);
  var platFormats = [null, NUMFMT.eur, NUMFMT.int, NUMFMT.int, NUMFMT.pct, NUMFMT.int, NUMFMT.eur];
  row = writeTable(sh, row, platHeader, platRows, platFormats, true);

  // --- Por campaña (todas las plataformas) ---
  row = writeSectionHeader(sh, row, DASH_COLS, 'Por campaña');
  var campHeader = ['Campaña', 'Inversión €', 'Impresiones', 'Clicks', 'CTR', 'Leads/Conv', 'CPL/CPA €'];
  var campRows = [];
  ds.platforms.forEach(function (p) {
    (p.campaigns || []).forEach(function (c) {
      campRows.push([p.platform + ' · ' + c.name, c.spend, c.impressions, c.clicks, c.ctr / 100, c.leads, c.cpl]);
    });
  });
  campRows.sort(function (a, b) { return b[1] - a[1]; });
  var campFormats = [null, NUMFMT.eur, NUMFMT.int, NUMFMT.int, NUMFMT.pct, NUMFMT.dec2, NUMFMT.eur];
  row = writeTable(sh, row, campHeader, campRows.length ? campRows : [['(sin campañas)', 0, 0, 0, 0, 0, 0]], campFormats, false);

  // --- CRM: pipeline ---
  var crm = ds.crm || emptyCrm('—');
  row = writeSectionHeader(sh, row, DASH_COLS, 'Pipeline CRM · ' + (crm.source || '—'));

  // Open por stage + Total creadas (lado izquierdo) y Matrículas (derecho)
  var stageRows = PIPELINE_STAGES.map(function (s) { return [s, (crm.byStage && crm.byStage[s]) || 0]; });
  stageRows.unshift(['Total leads/oportunidades creadas', crm.totalCreated || 0]);
  row = writeTable(sh, row, ['Open por etapa', '#'], stageRows, [null, NUMFMT.int], false);

  // Matrículas / cierres. La columna de valores mezcla #/€/%/ratio, así que
  // los formatos se aplican por celda tras escribir la tabla.
  var e = crm.enrollment || {};
  var enrollRows = [
    ['Won / Matriculadas (mes)', e.won || 0],
    ['Matriculadas mes anterior', e.wonPrevMonth || 0],
    ['Entrevistados', e.interviewed || 0],
    ['Open (activas)', e.openActive || 0],
    ['Lost', e.lost || 0],
    ['Abandoned', e.abandoned || 0],
    ['Valor contratado €', round(e.contractValue || 0, 2)],
    ['Revenue €', round(e.revenue || 0, 2)],
    ['CR% leads → matrícula', round(safeDiv(e.won || 0, crm.totalCreated || 0), 4)],
    ['ROAS (won € / spend €)', round(safeDiv(e.revenue || 0, t.spend), 2)]
  ];
  var enrollDataStart = row + 1; // primera fila de datos (tras la cabecera)
  row = writeTable(sh, row, ['Matrículas / cierres', 'Valor'], enrollRows, null, false);
  var enrollFmt = [NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.int, NUMFMT.eur, NUMFMT.eur, NUMFMT.pct, NUMFMT.dec2];
  for (var ei = 0; ei < enrollFmt.length; ei++) {
    sh.getRange(enrollDataStart + ei, 2).setNumberFormat(enrollFmt[ei]);
  }

  // Lead status (distribución completa)
  if (crm.byStatus && crm.byStatus.length) {
    var statusHeader = ['Lead status', '#', '%'];
    var statusRows = crm.byStatus.map(function (s) { return [s.key, s.count, s.pct / 100]; });
    row = writeTable(sh, row, statusHeader, statusRows, [null, NUMFMT.int, NUMFMT.pct0], false);
  }

  // Por fuente
  if (crm.bySource && crm.bySource.length) {
    var srcHeader = ['Fuente (' + (crm.source || 'CRM') + ')', '#', '%'];
    var srcRows = crm.bySource.map(function (s) { return [s.key, s.count, s.pct / 100]; });
    row = writeTable(sh, row, srcHeader, srcRows, [null, NUMFMT.int, NUMFMT.pct0], false);
  }

  sh.setActiveSelection('A1');
}

/** Pinta la pestaña Comparativa: una columna por mes con los KPIs clave. */
function renderComparativa() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.comparativa) || ss.insertSheet(SHEETS.comparativa);
  sh.clear();
  sh.clearFormats();
  sh.setHiddenGridlines(true);

  var months = cacheMonths(); // reciente primero
  months = months.slice(0, 6).reverse(); // hasta 6 meses, antiguo→reciente
  var datasets = months.map(function (m) { return cacheGet(m); }).filter(function (d) { return !!d; });

  var ncols = datasets.length + 1;
  sh.getRange(1, 1, 1, Math.max(ncols, 2)).merge()
    .setValue(CLIENT.name + ' · Comparativa mensual')
    .setFontSize(16).setFontWeight('bold').setFontColor(THEME.dark);

  if (!datasets.length) {
    sh.getRange(3, 1).setValue('Sin datos cacheados todavía.').setFontColor(THEME.warn);
    return;
  }

  var metrics = [
    { label: 'Inversión total', get: function (d) { return d.total.spend; }, fmt: NUMFMT.eur },
    { label: 'Impresiones', get: function (d) { return d.total.impressions; }, fmt: NUMFMT.int },
    { label: 'Clicks', get: function (d) { return d.total.clicks; }, fmt: NUMFMT.int },
    { label: 'CTR', get: function (d) { return d.total.ctr / 100; }, fmt: NUMFMT.pct },
    { label: 'Leads totales', get: function (d) { return d.total.leads; }, fmt: NUMFMT.int },
    { label: 'CPL blended', get: function (d) { return d.total.cpl; }, fmt: NUMFMT.eur },
    { label: '% Budget gastado', get: function (d) { return d.budgetSpentPct / 100; }, fmt: NUMFMT.pct0 },
    { label: 'Won / Matrículas', get: function (d) { return (d.crm.enrollment || {}).won || 0; }, fmt: NUMFMT.int },
    { label: 'ROAS', get: function (d) { var e = d.crm.enrollment || {}; return round(safeDiv(e.revenue || 0, d.total.spend), 2); }, fmt: NUMFMT.dec2 }
  ];

  // Cabecera
  var header = ['Métrica'].concat(datasets.map(function (d) { return d.label; }));
  writeTable(sh, 3, header, metrics.map(function (m) {
    return [m.label].concat(datasets.map(function (d) { return m.get(d); }));
  }), [null].concat(datasets.map(function () { return null; })), false);

  // Formatos por fila de métrica (cabecera en fila 3 → datos desde la fila 4)
  for (var i = 0; i < metrics.length; i++) {
    sh.getRange(4 + i, 2, 1, datasets.length).setNumberFormat(metrics[i].fmt);
  }
  sh.setColumnWidth(1, 200);
  for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 130);
}
