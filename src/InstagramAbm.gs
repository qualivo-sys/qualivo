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

/** Cabeceras de la tabla de contactos (col A..L). */
var IG_HEADERS = ['Foto', '@handle', 'Nombre', 'Bio', 'Seguidores',
  'Verificado', 'URL perfil', 'Fuente', 'Extraído', 'Estado', 'Notas', 'DM enviado'];

var IG_ESTADOS = ['Pendiente', 'Aprobado', 'Descartado'];

/** Hoja de la cola diaria de DMs (Opción A: semi-manual asistido). */
var IG_COLA_SHEET = 'IG_Cola_DM';
var IG_COLA_HEADER_ROW = 6; // fila de cabeceras de la tabla (control encima)

/** Plantilla por defecto del mensaje. Placeholders: {nombre} {handle} {bio} {seguidores}. */
var IG_DEFAULT_TEMPLATE =
  'Hola {nombre} 👋 vi tu perfil (@{handle}) y creo que lo que hacemos te puede encajar. ' +
  '¿Te va que te cuente en 1 minuto?';

/* --------------------------- Setup de hojas --------------------------- */

/** Crea (idempotente) las pestañas IG_Extractor e IG_Contactos. */
function setupInstagramAbm() {
  ensureIgExtractorSheet();
  ensureIgContactosSheet();
  ensureIgColaSheet();
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
  var widths = [90, 150, 190, 320, 100, 90, 230, 160, 110, 130, 260, 110];
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
      '',
      '' // DM enviado
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

/* --------------------------- Cola diaria de DMs (Opción A) --------------------------- */

var IG_COLA_HEADERS = ['Enviado', '@handle', 'Nombre', 'Mensaje', 'Abrir DM'];

/** Crea (idempotente) la hoja IG_Cola_DM con el bloque de control + tabla. */
function ensureIgColaSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(IG_COLA_SHEET);
  if (sh) return sh;
  sh = ss.insertSheet(IG_COLA_SHEET);

  sh.getRange(1, 1, 1, 2).merge()
    .setValue('Cola diaria de DMs (semi-manual, sin coste)')
    .setFontWeight('bold').setFontSize(13)
    .setBackground(THEME.dark).setFontColor(THEME.textLight);

  sh.getRange(2, 1, 2, 1).setValues([['Mensajes por día'], ['Plantilla']]).setFontWeight('bold');
  sh.getRange(2, 2).setValue(8);
  sh.getRange(3, 2).setValue(IG_DEFAULT_TEMPLATE).setWrap(true);
  sh.getRange(4, 1, 1, 2).merge()
    .setValue('Placeholders: {nombre} {handle} {bio} {seguidores}. ' +
      'Menú: Instagram ABM → Generar cola de hoy. Abre cada "Abrir DM", pega el ' +
      'mensaje, marca Enviado y confirma con "Marcar enviados".')
    .setFontColor(THEME.warn).setWrap(true);
  sh.setColumnWidth(1, 90);
  sh.setColumnWidth(2, 640);

  sh.getRange(IG_COLA_HEADER_ROW, 1, 1, IG_COLA_HEADERS.length).setValues([IG_COLA_HEADERS])
    .setFontWeight('bold').setBackground(THEME.dark).setFontColor(THEME.textLight);
  sh.setColumnWidths(2, 1, 150);
  sh.setColumnWidth(3, 190);
  sh.setColumnWidth(4, 560);
  sh.setColumnWidth(5, 120);
  return sh;
}

/**
 * Genera la cola del día: hasta N contactos con Estado=Aprobado y sin DM
 * enviado, con el mensaje ya personalizado y el link directo a su DM.
 */
function menuBuildDmQueue() {
  var src = SpreadsheetApp.getActive().getSheetByName(IG_SHEETS.contactos);
  if (!src || src.getLastRow() < 2) { toast('No hay contactos en IG_Contactos'); return; }
  var cola = ensureIgColaSheet();
  var cap = toNumber(cola.getRange(2, 2).getValue()) || 8;
  var tpl = String(cola.getRange(3, 2).getValue() || '').trim() || IG_DEFAULT_TEMPLATE;

  var headers = igColHeaders(src);
  var cH = headers.indexOf('@handle');
  var cN = headers.indexOf('Nombre');
  var cB = headers.indexOf('Bio');
  var cF = headers.indexOf('Seguidores');
  var cE = headers.indexOf('Estado');
  var cD = headers.indexOf('DM enviado');
  if (cE < 0 || cH < 0) { toast('IG_Contactos no tiene las columnas esperadas'); return; }

  var last = src.getLastRow();
  var data = src.getRange(2, 1, last - 1, src.getLastColumn()).getValues();
  var picked = [];
  for (var i = 0; i < data.length && picked.length < cap; i++) {
    var row = data[i];
    if (String(row[cE]).trim() !== 'Aprobado') continue;
    if (cD >= 0 && String(row[cD]).trim() !== '') continue; // ya contactado
    var handle = String(row[cH] || '').replace(/^@/, '').trim();
    if (!handle) continue;
    var nombre = String(cN >= 0 ? row[cN] : '').trim() || handle;
    var msg = fillTemplate(tpl, {
      nombre: nombre,
      handle: handle,
      bio: String(cB >= 0 ? row[cB] : ''),
      seguidores: cF >= 0 ? row[cF] : ''
    });
    picked.push([false, '@' + handle, nombre, msg,
      '=HYPERLINK("https://ig.me/m/' + handle + '","Abrir DM")']);
  }

  // Limpia filas anteriores y escribe la nueva cola.
  var startRow = IG_COLA_HEADER_ROW + 1;
  var maxRows = cola.getMaxRows();
  if (maxRows >= startRow) {
    cola.getRange(startRow, 1, maxRows - startRow + 1, IG_COLA_HEADERS.length).clearContent();
    cola.getRange(startRow, 1, maxRows - startRow + 1, 1).removeCheckboxes();
  }
  if (!picked.length) { toast('No hay Aprobados pendientes de contactar'); return; }
  cola.getRange(startRow, 1, picked.length, IG_COLA_HEADERS.length).setValues(picked);
  cola.getRange(startRow, 1, picked.length, 1).insertCheckboxes();
  cola.getRange(startRow, 4, picked.length, 1).setWrap(true);
  toast('Cola generada: ' + picked.length + ' contactos para hoy');
}

/**
 * Marca como enviados (con fecha de hoy en IG_Contactos) los contactos de la
 * cola con la casilla "Enviado" activada, para que no reaparezcan mañana.
 */
function menuConfirmDmSent() {
  var cola = SpreadsheetApp.getActive().getSheetByName(IG_COLA_SHEET);
  if (!cola) { toast('No existe la cola IG_Cola_DM'); return; }
  var startRow = IG_COLA_HEADER_ROW + 1;
  var last = cola.getLastRow();
  if (last < startRow) { toast('La cola está vacía'); return; }

  var rows = cola.getRange(startRow, 1, last - startRow + 1, 2).getValues();
  var sent = {};
  rows.forEach(function (r) {
    if (r[0] === true) sent[String(r[1] || '').replace(/^@/, '').trim().toLowerCase()] = true;
  });
  var handles = Object.keys(sent);
  if (!handles.length) { toast('Marca alguna casilla "Enviado" primero'); return; }

  var src = SpreadsheetApp.getActive().getSheetByName(IG_SHEETS.contactos);
  var headers = igColHeaders(src);
  var cH = headers.indexOf('@handle');
  var cD = headers.indexOf('DM enviado');
  if (cD < 0) { toast('Falta la columna "DM enviado" en IG_Contactos'); return; }

  var today = Utilities.formatDate(new Date(), CLIENT.timezone, 'yyyy-MM-dd');
  var srcLast = src.getLastRow();
  var col = src.getRange(2, cH + 1, srcLast - 1, 1).getValues();
  var count = 0;
  for (var i = 0; i < col.length; i++) {
    var h = String(col[i][0] || '').replace(/^@/, '').trim().toLowerCase();
    if (sent[h]) { src.getRange(i + 2, cD + 1).setValue(today); count++; }
  }
  toast(count + ' marcados como enviados');
  menuBuildDmQueue(); // refresca la cola quitando los ya enviados
}

/* ------------------------------- Helpers cola ------------------------------- */

/** Cabeceras (fila 1) de una hoja, como array de strings. */
function igColHeaders(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (v) { return String(v); });
}

/** Rellena una plantilla con {placeholders}. */
function fillTemplate(tpl, vars) {
  return String(tpl).replace(/\{(\w+)\}/g, function (m, k) {
    return (vars[k] === null || vars[k] === undefined) ? '' : String(vars[k]);
  });
}
