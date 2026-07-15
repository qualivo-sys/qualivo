/**
 * InstagramAbm.gs
 * Base de datos de contactos de Instagram para ABM.
 *
 * Flujo:
 *   1. IG_Extractor: eliges el actor de Apify y su input (o una fuente simple).
 *   2. "Extraer de Apify": lanza la máquina, trae los perfiles y los vuelca a
 *      IG_Contactos con la FOTO incrustada (=IMAGE) y una columna Estado.
 *   3. Tú validas (Estado = Aprobado / Descartado). Los "Aprobado" son la cola
 *      que después alimenta el outreach.
 *
 * No automatiza DMs de Instagram: IG no tiene API oficial de DM en frío. Esta
 * pieza cubre la base de datos y su validación.
 */

var IG_SHEETS = {
  contactos: 'IG_Contactos',
  extractor: 'IG_Extractor'
};

/** Cabeceras de la tabla de contactos (col A..K). */
var IG_HEADERS = ['Foto', '@handle', 'Nombre', 'Bio', 'Seguidores',
  'Verificado', 'URL perfil', 'Fuente', 'Extraído', 'Estado', 'Notas'];

var IG_ESTADOS = ['Pendiente', 'Aprobado', 'Descartado'];

/* --------------------------- Setup de hojas --------------------------- */

/** Crea (idempotente) las pestañas IG_Extractor e IG_Contactos. */
function setupInstagramAbm() {
  ensureIgExtractorSheet();
  ensureIgContactosSheet();
  toast('Hojas de Instagram ABM listas');
}

/** Panel de control: actor de Apify + input JSON + fuente rápida. */
function ensureIgExtractorSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(IG_SHEETS.extractor);
  if (sh) return sh;
  sh = ss.insertSheet(IG_SHEETS.extractor);

  sh.getRange(1, 1, 1, 2).merge()
    .setValue('Extractor de Instagram (Apify)')
    .setFontWeight('bold').setFontSize(13)
    .setBackground(THEME.dark).setFontColor(THEME.textLight);

  var rows = [
    ['Actor de Apify (ID)', getProp('APIFY_ACTOR_ID', APIFY_DEFAULT_ACTOR)],
    ['Fuente rápida', '@nasa'],
    ['Límite de resultados', 50],
    ['Input JSON (opcional, tiene prioridad)', ''],
    ['', ''],
    ['Cómo funciona', 'Rellena "Fuente rápida" (p.ej. @cuenta, #hashtag o unas ' +
      'palabras) y usa el menú: EAC Dashboard → Instagram ABM → Extraer de Apify. ' +
      'Si necesitas control total, pega el input JSON del actor en la fila de arriba ' +
      '(tiene prioridad sobre la fuente rápida).'],
    ['Nota fotos', 'Las fotos se incrustan con =IMAGE(url). Si Instagram bloquea ' +
      'alguna URL y la celda queda vacía, usa "Rehospedar fotos en Drive".']
  ];
  sh.getRange(3, 1, rows.length, 2).setValues(rows);
  sh.getRange(3, 1, 4, 1).setFontWeight('bold');
  sh.getRange(7, 1, 2, 1).setFontWeight('bold').setFontColor(THEME.warn);
  sh.getRange(3, 1, rows.length, 2)
    .setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment('top').setWrap(true);
  sh.setColumnWidth(1, 260);
  sh.setColumnWidth(2, 520);
  return sh;
}

/** Tabla de contactos con cabeceras, desplegable de Estado y formato. */
function ensureIgContactosSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(IG_SHEETS.contactos);
  if (sh) return sh;
  sh = ss.insertSheet(IG_SHEETS.contactos);

  sh.getRange(1, 1, 1, IG_HEADERS.length).setValues([IG_HEADERS])
    .setFontWeight('bold').setBackground(THEME.dark).setFontColor(THEME.textLight)
    .setVerticalAlignment('middle');
  sh.setFrozenRows(1);

  // Anchos de columna.
  var widths = [90, 150, 190, 320, 100, 90, 230, 160, 110, 130, 260];
  widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

  applyIgValidationAndFormat(sh);
  return sh;
}

/** Desplegable de Estado + formato condicional (verde/rojo) en toda la columna. */
function applyIgValidationAndFormat(sh) {
  var estadoCol = 10; // J
  var maxRows = Math.max(sh.getMaxRows() - 1, 1);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(IG_ESTADOS, true).setAllowInvalid(false).build();
  sh.getRange(2, estadoCol, maxRows, 1).setDataValidation(rule);

  var rng = sh.getRange(2, estadoCol, maxRows, 1);
  var green = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Aprobado').setBackground('#d3f8d3').setRanges([rng]).build();
  var red = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Descartado').setBackground('#ffd6d6').setRanges([rng]).build();
  sh.setConditionalFormatRules([green, red]);
}

/* --------------------------- Extracción --------------------------- */

/** Acción de menú: lee IG_Extractor, ejecuta Apify y vuelca a IG_Contactos. */
function menuScrapeInstagram() {
  if (!hasCreds('Apify')) {
    toast('Falta APIFY_TOKEN. Configúralo en _Config y guarda credenciales.');
    return;
  }
  var ctrl = readIgExtractorControl();
  toast('Extrayendo de Instagram… (puede tardar 1-3 min)');
  var items = apifyRunActor(ctrl.actorId, ctrl.input);
  var n = writeIgContactos(items, ctrl.sourceLabel);
  toast(n > 0 ? ('Añadidos ' + n + ' perfiles nuevos') : 'Sin perfiles nuevos (¿duplicados o input vacío?)');
}

/** Lee el actor, la fuente y/o el input JSON del panel IG_Extractor. */
function readIgExtractorControl() {
  var sh = ensureIgExtractorSheet();
  var actorId = String(sh.getRange(3, 2).getValue() || '').trim() || APIFY_DEFAULT_ACTOR;
  var source = String(sh.getRange(4, 2).getValue() || '').trim();
  var limit = toNumber(sh.getRange(5, 2).getValue()) || 50;
  var rawJson = String(sh.getRange(6, 2).getValue() || '').trim();

  var input;
  if (rawJson) {
    try { input = JSON.parse(rawJson); }
    catch (e) { throw new Error('Input JSON inválido en IG_Extractor: ' + e.message); }
  } else if (source) {
    input = apifyBuildInput(source, limit);
  } else {
    throw new Error('Rellena "Fuente rápida" o "Input JSON" en IG_Extractor');
  }
  return { actorId: actorId, input: input, sourceLabel: source || actorId };
}

/**
 * Vuelca perfiles a IG_Contactos evitando duplicados (por @handle).
 * La foto va como fórmula =IMAGE(url) en la columna A.
 * @return {number} nº de filas nuevas añadidas.
 */
function writeIgContactos(items, sourceLabel) {
  var sh = ensureIgContactosSheet();
  var existing = igExistingHandles(sh);
  var when = Utilities.formatDate(new Date(), CLIENT.timezone, 'yyyy-MM-dd HH:mm');

  var rows = [];
  (items || []).forEach(function (raw) {
    var p = mapIgProfile(raw);
    if (!p) return;
    var key = p.username.toLowerCase();
    if (existing[key]) return;
    existing[key] = true;
    rows.push([
      p.profilePic ? '=IMAGE("' + p.profilePic + '",4,80,80)' : '',
      '@' + p.username,
      p.fullName,
      p.biography,
      p.followers || '',
      p.verified ? 'Sí' : '',
      p.url,
      sourceLabel || '',
      when,
      'Pendiente',
      ''
    ]);
  });

  if (!rows.length) return 0;
  var start = sh.getLastRow() + 1;
  sh.getRange(start, 1, rows.length, IG_HEADERS.length).setValues(rows);
  sh.setRowHeights(start, rows.length, 84);
  applyIgValidationAndFormat(sh);
  return rows.length;
}

/** Mapa {handle_lower: true} de los handles ya presentes en la hoja. */
function igExistingHandles(sh) {
  var out = {};
  var last = sh.getLastRow();
  if (last < 2) return out;
  var vals = sh.getRange(2, 2, last - 1, 1).getValues();
  vals.forEach(function (r) {
    var h = String(r[0] || '').replace(/^@/, '').trim().toLowerCase();
    if (h) out[h] = true;
  });
  return out;
}

/* --------------------------- Fotos en Drive --------------------------- */

/**
 * Descarga las fotos de perfil a una carpeta de Drive y sustituye la fórmula
 * =IMAGE por la URL de Drive. Úsalo si Instagram bloquea las URLs de CDN y las
 * celdas de foto quedan en blanco.
 */
function menuRehostIgPhotos() {
  var sh = SpreadsheetApp.getActive().getSheetByName(IG_SHEETS.contactos);
  if (!sh || sh.getLastRow() < 2) { toast('No hay contactos que procesar'); return; }
  var folder = igDriveFolder();
  var last = sh.getLastRow();
  var handles = sh.getRange(2, 2, last - 1, 1).getValues();
  var formulas = sh.getRange(2, 1, last - 1, 1).getFormulas();
  var done = 0;

  for (var i = 0; i < formulas.length; i++) {
    var f = formulas[i][0];
    var m = f && f.match(/=IMAGE\("([^"]+)"/i);
    if (!m) continue;
    var src = m[1];
    if (src.indexOf('drive.google.com') >= 0) continue; // ya rehospedada
    try {
      var resp = UrlFetchApp.fetch(src, { muteHttpExceptions: true });
      if (resp.getResponseCode() !== 200) continue;
      var handle = String(handles[i][0] || 'ig').replace(/[^a-z0-9_]/gi, '_');
      var file = folder.createFile(resp.getBlob().setName(handle + '.jpg'));
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var direct = 'https://drive.google.com/uc?export=view&id=' + file.getId();
      sh.getRange(i + 2, 1).setFormula('=IMAGE("' + direct + '",4,80,80)');
      done++;
    } catch (e) {
      logInfo('rehost error', e);
    }
  }
  toast('Fotos rehospedadas: ' + done);
}

/** Carpeta de Drive para las fotos (crea si no existe). */
function igDriveFolder() {
  var name = CLIENT.name + ' – IG ABM fotos';
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}
