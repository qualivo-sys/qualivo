/**
 * ConfigSheet.gs · pestaña `_Config` para introducir credenciales/ajustes y
 * volcarlos a las Script Properties (almacenamiento seguro del proyecto).
 */

/** Crea (si no existe) la pestaña _Config con las claves esperadas. */
function ensureConfigSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.config);
  if (!sh) sh = ss.insertSheet(SHEETS.config);

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, 2).setValues([['Clave', 'Valor']]);
    sh.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
    var props = PropertiesService.getScriptProperties();
    var rows = CREDENTIAL_KEYS.map(function (k) { return [k, props.getProperty(k) || '']; });
    sh.getRange(2, 1, rows.length, 2).setValues(rows);
    sh.setColumnWidth(1, 240);
    sh.setColumnWidth(2, 380);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Abre / crea la pestaña _Config y la activa. */
function openConfigSheet() {
  var sh = ensureConfigSheet();
  SpreadsheetApp.setActiveSheet(sh);
  toast('Rellena los valores y luego "Guardar credenciales de _Config".');
}

/** Vuelca los valores de _Config a las Script Properties. */
function saveConfigFromSheet() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.config);
  if (!sh) { toast('No existe la hoja _Config.'); return; }
  var last = sh.getLastRow();
  if (last < 2) { toast('_Config está vacía.'); return; }
  var values = sh.getRange(2, 1, last - 1, 2).getValues();
  var props = PropertiesService.getScriptProperties();
  var saved = 0;
  values.forEach(function (r) {
    var key = String(r[0] || '').trim();
    var val = String(r[1] || '').trim();
    if (key && val) { props.setProperty(key, val); saved++; }
  });
  toast(saved + ' credenciales guardadas en Script Properties.');
}
