/**
 * Sheet.gs · estructura y escritura de la hoja "Prospectos" + "_Log".
 */

/** Cabeceras de la tabla de prospectos (el orden define las columnas). */
var PROSPECT_HEADERS = [
  'Fecha',            // 0  detección
  'Empresa',          // 1
  'Dominio',          // 2  clave de deduplicación
  'Web',              // 3
  'Sector',           // 4
  'Empleados',        // 5
  'Ubicación',        // 6
  'Oferta detectada', // 7  título de la vacante
  'URL oferta',       // 8
  'Publicada',        // 9  fecha de publicación (si Apollo la da)
  'Señal',            // 10 palabra clave que disparó el match
  'Nº ofertas',       // 11 nº de ofertas relevantes abiertas
  'Score',            // 12 0-100
  'Prioridad',        // 13 Alta / Media / Baja
  'Decisor',          // 14 nombre
  'Cargo',            // 15
  'Email',            // 16
  'LinkedIn',         // 17
  'Estado',           // 18 PROSPECT_STATES
  'Canal',            // 19 Email / LinkedIn / Ambos
  'Asunto',           // 20 asunto del email sugerido
  'Mensaje sugerido', // 21 cuerpo del email sugerido
  'Notas'             // 22
];

/** Índice de columna (0-based) por nombre de cabecera. */
function col(name) {
  var i = PROSPECT_HEADERS.indexOf(name);
  if (i < 0) throw new Error('Columna desconocida: ' + name);
  return i;
}

/** Devuelve (creando si hace falta) la pestaña de prospectos con cabeceras. */
function prospectSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.prospects);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.prospects);
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, PROSPECT_HEADERS.length).setValues([PROSPECT_HEADERS]);
    formatProspectSheet(sh);
  }
  return sh;
}

/** Formato de cabecera + validación de la columna Estado + anchos. */
function formatProspectSheet(sh) {
  var header = sh.getRange(1, 1, 1, PROSPECT_HEADERS.length);
  header.setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff')
    .setVerticalAlignment('middle');
  sh.setFrozenRows(1);

  // Desplegable de Estado.
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(PROSPECT_STATES, true).setAllowInvalid(true).build();
  sh.getRange(2, col('Estado') + 1, sh.getMaxRows() - 1, 1).setDataValidation(rule);

  // Anchos cómodos para las columnas de texto largo.
  sh.setColumnWidth(col('Empresa') + 1, 200);
  sh.setColumnWidth(col('Oferta detectada') + 1, 220);
  sh.setColumnWidth(col('Asunto') + 1, 260);
  sh.setColumnWidth(col('Mensaje sugerido') + 1, 420);
  sh.setColumnWidth(col('Notas') + 1, 220);
}

/** Conjunto de dominios ya presentes (para no duplicar empresas). */
function existingDomains() {
  var sh = prospectSheet();
  var last = sh.getLastRow();
  var set = {};
  if (last < 2) return set;
  var vals = sh.getRange(2, col('Dominio') + 1, last - 1, 1).getValues();
  vals.forEach(function (r) {
    var d = cleanDomain(r[0]);
    if (d) set[d] = true;
  });
  return set;
}

/**
 * Convierte un objeto prospecto en la fila (array) según PROSPECT_HEADERS.
 * @param {Object} p - ver buildProspect() en Radar.gs
 */
function prospectToRow(p) {
  var row = new Array(PROSPECT_HEADERS.length).fill('');
  row[col('Fecha')] = p.date || today();
  row[col('Empresa')] = p.company || '';
  row[col('Dominio')] = p.domain || '';
  row[col('Web')] = p.website || '';
  row[col('Sector')] = p.industry || '';
  row[col('Empleados')] = p.employees || '';
  row[col('Ubicación')] = p.location || '';
  row[col('Oferta detectada')] = p.jobTitle || '';
  row[col('URL oferta')] = p.jobUrl || '';
  row[col('Publicada')] = p.jobPostedAt || '';
  row[col('Señal')] = p.signal || '';
  row[col('Nº ofertas')] = p.jobCount || 0;
  row[col('Score')] = p.score || 0;
  row[col('Prioridad')] = p.priority || '';
  row[col('Decisor')] = p.contactName || '';
  row[col('Cargo')] = p.contactTitle || '';
  row[col('Email')] = p.contactEmail || '';
  row[col('LinkedIn')] = p.contactLinkedin || '';
  row[col('Estado')] = p.state || 'Nuevo';
  row[col('Canal')] = p.channel || '';
  row[col('Asunto')] = p.subject || '';
  row[col('Mensaje sugerido')] = p.message || '';
  row[col('Notas')] = p.notes || '';
  return row;
}

/** Añade varias filas de prospectos al final de la hoja. */
function appendProspects(prospects) {
  if (!prospects.length) return;
  var sh = prospectSheet();
  var rows = prospects.map(prospectToRow);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, PROSPECT_HEADERS.length).setValues(rows);
}

/**
 * Lee las filas cuyo Estado esté en `states` (array). Devuelve objetos con el
 * número de fila real (`_row`) para poder actualizarlas después.
 */
function readProspectsByState(states) {
  var sh = prospectSheet();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, PROSPECT_HEADERS.length).getValues();
  var out = [];
  values.forEach(function (r, i) {
    var state = r[col('Estado')];
    if (states.indexOf(state) < 0) return;
    out.push({
      _row: i + 2,
      company: r[col('Empresa')],
      domain: r[col('Dominio')],
      contactName: r[col('Decisor')],
      contactEmail: r[col('Email')],
      contactLinkedin: r[col('LinkedIn')],
      jobTitle: r[col('Oferta detectada')],
      subject: r[col('Asunto')],
      message: r[col('Mensaje sugerido')],
      channel: r[col('Canal')]
    });
  });
  return out;
}

/** Escribe el Estado (y opcionalmente una nota) de una fila concreta. */
function setProspectState(rowNumber, state, note) {
  var sh = prospectSheet();
  sh.getRange(rowNumber, col('Estado') + 1).setValue(state);
  if (note) {
    var cell = sh.getRange(rowNumber, col('Notas') + 1);
    var prev = cell.getValue();
    cell.setValue(prev ? (prev + ' · ' + note) : note);
  }
}

/* --------------------------------- Log --------------------------------- */

/** Devuelve (creando) la pestaña _Log. */
function logSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.log);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.log);
    sh.getRange(1, 1, 1, 3).setValues([['Cuándo', 'Evento', 'Detalle']]);
    sh.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Registra una línea en _Log (y en la consola). */
function logEvent(event, detail) {
  logInfo(event, detail || '');
  try {
    logSheet().appendRow([nowStamp(), event, detail || '']);
  } catch (e) {}
}
