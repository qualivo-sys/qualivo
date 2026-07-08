/**
 * Dashboard.gs — Pinta las pestañas "Campañas" y "Anuncios".
 */

function htlRenderAll() {
  if (!htlHasCreds()) {
    SpreadsheetApp.getActive().toast('Faltan credenciales (HTL_META_TOKEN / HTL_AD_ACCOUNT_ID).');
    return;
  }
  htlRenderCampaigns();
  htlRenderAds();
  SpreadsheetApp.getActive().toast('Dashboard actualizado (' + htlDatePreset() + ')');
}

function htlRenderCampaigns() {
  var rows = htlInsights('campaign');
  var header = ['Campaña', 'Gasto (€)', 'Impresiones', 'Clicks', 'CTR %', 'CPC (€)', 'Leads', 'CPL (€)'];
  var data = rows.map(function (r) {
    return [r.campaign, round2(r.spend), r.impressions, r.clicks, round2(r.ctr), round2(r.cpc), r.leads, round2(r.cpl)];
  });
  htlWriteSheet(HTL.sheets.campaigns, header, data, rows);
}

function htlRenderAds() {
  var rows = htlInsights('ad');
  var header = ['Campaña', 'Conjunto', 'Anuncio', 'Estado', 'Gasto (€)', 'Impresiones', 'Clicks', 'CTR %', 'CPC (€)', 'Leads', 'CPL (€)'];
  var data = rows.map(function (r) {
    return [r.campaign, r.adset, r.ad, r.status, round2(r.spend), r.impressions, r.clicks, round2(r.ctr), round2(r.cpc), r.leads, round2(r.cpl)];
  });
  htlWriteSheet(HTL.sheets.ads, header, data, rows);
}

/** Escribe una pestaña con cabecera, totales y formato. */
function htlWriteSheet(name, header, data, rows) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();

  var stamp = Utilities.formatDate(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm');
  sh.getRange(1, 1).setValue('HackTheLead · ' + name + '  ·  ' + htlDatePreset() + '  ·  act. ' + stamp)
    .setFontWeight('bold').setFontSize(12);

  var hRow = 3;
  sh.getRange(hRow, 1, 1, header.length).setValues([header])
    .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');

  if (data.length) {
    sh.getRange(hRow + 1, 1, data.length, header.length).setValues(data);
  }

  // Fila de totales
  var totSpend = 0, totImp = 0, totClicks = 0, totLeads = 0;
  rows.forEach(function (r) { totSpend += r.spend; totImp += r.impressions; totClicks += r.clicks; totLeads += r.leads; });
  var totalRow = new Array(header.length).fill('');
  var iSpend = header.indexOf('Gasto (€)');
  totalRow[0] = 'TOTAL';
  totalRow[iSpend] = round2(totSpend);
  totalRow[header.indexOf('Impresiones')] = totImp;
  totalRow[header.indexOf('Clicks')] = totClicks;
  totalRow[header.indexOf('Leads')] = totLeads;
  totalRow[header.indexOf('CPL (€)')] = totLeads ? round2(totSpend / totLeads) : 0;
  var tRow = hRow + 1 + data.length;
  sh.getRange(tRow, 1, 1, header.length).setValues([totalRow])
    .setFontWeight('bold').setBackground('#374151').setFontColor('#ffffff');

  sh.autoResizeColumns(1, header.length);
  sh.setFrozenRows(hRow);
}

function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
