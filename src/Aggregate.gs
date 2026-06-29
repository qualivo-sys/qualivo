/**
 * Aggregate.gs
 * Orquesta los conectores para un mes, combina en el dataset normalizado y
 * lo guarda en la pestaña-caché `_Cache` (una fila por mes con JSON).
 */

/** Llama a todos los conectores de paid media y al CRM para un mes. */
function buildDatasetForMonth(monthKey) {
  var platforms = [
    fetchMeta(monthKey),
    fetchGoogleAds(monthKey),
    fetchTikTok(monthKey)
  ];

  // CRM: usa GHL si hay credenciales, si no HubSpot (el cliente migró de
  // HubSpot a GHL). Si hay ambos, se prioriza GHL.
  var crm;
  if (hasCreds('GHL')) crm = fetchGHL(monthKey);
  else if (hasCreds('HubSpot')) crm = fetchHubSpot(monthKey);
  else crm = emptyCrm('—');

  return buildMonthlyDataset(monthKey, platforms, crm);
}

/** Refresca un mes: pide a las APIs, cachea y devuelve el dataset. */
function refreshMonth(monthKey) {
  var dataset = buildDatasetForMonth(monthKey);
  cachePut(monthKey, dataset);
  return dataset;
}

/** Refresca los últimos N meses (por defecto 3). */
function refreshRecentMonths(n) {
  n = n || 3;
  var keys = recentMonthKeys(n);
  keys.forEach(function (k) { refreshMonth(k); });
  return keys;
}

/* ---------------------------------------------------------------------------
 * Caché en hoja oculta `_Cache`: columnas [month, json, generatedAt]
 * ------------------------------------------------------------------------- */

function cacheSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.cache);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.cache);
    sh.getRange(1, 1, 1, 3).setValues([['month', 'json', 'generatedAt']]);
    sh.hideSheet();
  }
  return sh;
}

function cachePut(monthKey, dataset) {
  var sh = cacheSheet();
  var data = sh.getDataRange().getValues();
  var json = JSON.stringify(dataset);
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === monthKey) {
      sh.getRange(i + 1, 2, 1, 2).setValues([[json, dataset.generatedAt]]);
      return;
    }
  }
  sh.appendRow([monthKey, json, dataset.generatedAt]);
}

function cacheGet(monthKey) {
  var sh = cacheSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === monthKey) {
      try { return JSON.parse(data[i][1]); } catch (e) { return null; }
    }
  }
  return null;
}

/** Devuelve los monthKeys cacheados, más reciente primero. */
function cacheMonths() {
  var sh = cacheSheet();
  var data = sh.getDataRange().getValues();
  var keys = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) keys.push(String(data[i][0]));
  }
  keys.sort();
  keys.reverse();
  return keys;
}
