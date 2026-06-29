/**
 * ConfigSheet.gs
 * Pestaña `_Config` para introducir credenciales desde la propia hoja y
 * volcarlas a las Script Properties (más cómodo que el editor de Apps Script).
 *
 * NOTA: las credenciales quedan visibles en la pestaña. Es una hoja oculta;
 * para máxima seguridad, bórrala tras "Guardar credenciales" o usa
 * directamente Configuración del proyecto → Propiedades del script.
 */

var CONFIG_ROWS = [
  ['— META (Marketing API) —', ''],
  ['META_ACCESS_TOKEN', ''],
  ['META_AD_ACCOUNT_ID', ''],
  ['META_API_VERSION', 'v21.0'],
  ['— GOOGLE ADS —', ''],
  ['GOOGLE_ADS_DEVELOPER_TOKEN', ''],
  ['GOOGLE_ADS_CLIENT_ID', ''],
  ['GOOGLE_ADS_CLIENT_SECRET', ''],
  ['GOOGLE_ADS_REFRESH_TOKEN', ''],
  ['GOOGLE_ADS_CUSTOMER_ID', ''],
  ['GOOGLE_ADS_LOGIN_CUSTOMER_ID', ''],
  ['GOOGLE_ADS_API_VERSION', 'v21'],
  ['— TIKTOK —', ''],
  ['TIKTOK_ACCESS_TOKEN', ''],
  ['TIKTOK_ADVERTISER_ID', ''],
  ['— HUBSPOT —', ''],
  ['HUBSPOT_TOKEN', ''],
  ['HUBSPOT_STATUS_PROP', 'hs_lead_status'],
  ['— GOHIGHLEVEL —', ''],
  ['GHL_TOKEN', ''],
  ['GHL_LOCATION_ID', ''],
  ['GHL_PIPELINE_ID', ''] // opcional: filtra a un pipeline (EAC usa "Pipeline")
];

/** Crea la hoja _Config con las filas de credenciales si no existe. */
function ensureConfigSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.config);
  if (sh) return sh;
  sh = ss.insertSheet(SHEETS.config);
  sh.getRange(1, 1, 1, 2).setValues([['Clave', 'Valor']])
    .setFontWeight('bold').setBackground(THEME.dark).setFontColor(THEME.textLight);

  // Pre-rellena con valores ya guardados en Script Properties.
  var rows = CONFIG_ROWS.map(function (r) {
    var key = r[0];
    if (key.indexOf('—') === 0) return r;
    var existing = getProp(key);
    return [key, existing || r[1]];
  });
  sh.getRange(2, 1, rows.length, 2).setValues(rows);

  // Resalta separadores de sección.
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).indexOf('—') === 0) {
      sh.getRange(2 + i, 1, 1, 2).merge().setBackground(THEME.light).setFontWeight('bold');
    }
  }
  sh.setColumnWidth(1, 240);
  sh.setColumnWidth(2, 460);
  sh.hideSheet();
  return sh;
}

/** Muestra la hoja _Config para editar credenciales. */
function openConfigSheet() {
  var sh = ensureConfigSheet();
  sh.showSheet();
  SpreadsheetApp.getActive().setActiveSheet(sh);
  toast('Introduce las credenciales y luego "Guardar credenciales de _Config"');
}

/** Vuelca los valores de _Config a las Script Properties. */
function saveConfigFromSheet() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.config);
  if (!sh) { toast('No existe la hoja _Config'); return; }
  var data = sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues();
  var props = PropertiesService.getScriptProperties();
  var saved = 0;
  data.forEach(function (r) {
    var key = String(r[0]).trim();
    if (!key || key.indexOf('—') === 0) return;
    var val = r[1] === null ? '' : String(r[1]).trim();
    if (val) { props.setProperty(key, val); saved++; }
  });
  toast(saved + ' credenciales guardadas. Ya puedes refrescar.');
}
