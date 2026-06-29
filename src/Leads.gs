/**
 * Leads.gs
 * Pinta la pestaña Leads con el listado individual del CRM para el mes
 * seleccionado en el Dashboard (o el más reciente cacheado).
 */
function renderLeads(monthKey) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.leads) || ss.insertSheet(SHEETS.leads);
  sh.clear();
  sh.clearFormats();
  sh.setHiddenGridlines(true);

  if (!monthKey) monthKey = (cacheMonths()[0] || currentMonthKey());
  var ds = cacheGet(monthKey);
  var leads = (ds && ds.crm && ds.crm.leads) || [];

  sh.getRange(1, 1, 1, 8).merge()
    .setValue(CLIENT.name + ' · Leads · ' + monthLabel(monthKey) + '  (' + leads.length + ')')
    .setFontSize(14).setFontWeight('bold').setFontColor(THEME.dark);

  var header = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Fuente', 'URL primera visita', 'Status', ''];
  var rows = leads.map(function (l) {
    return [l.date, l.name, l.email, l.phone, l.source, l.url, l.status, ''];
  });
  writeTable(sh, 3, header, rows.length ? rows : [['—', '—', '—', '—', '—', '—', '—', '']], null, false);

  var widths = [90, 160, 220, 120, 130, 280, 120, 20];
  for (var c = 0; c < widths.length; c++) sh.setColumnWidth(c + 1, widths[c]);
}
