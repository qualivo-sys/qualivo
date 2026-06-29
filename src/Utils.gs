/**
 * Utils.gs
 * Helpers genéricos: HTTP, fechas, números, normalización de texto.
 */

/** Realiza una petición HTTP JSON y devuelve el objeto parseado. */
function httpJson(url, options) {
  options = options || {};
  options.muteHttpExceptions = true;
  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  var body = res.getContentText();
  var json;
  try {
    json = body ? JSON.parse(body) : {};
  } catch (e) {
    json = { _raw: body };
  }
  if (code < 200 || code >= 300) {
    throw new Error('HTTP ' + code + ' en ' + url + ': ' + body.slice(0, 500));
  }
  return json;
}

/** Convierte un texto a número de forma robusta (admite €, comas, %). */
function toNumber(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  var s = String(v).replace(/[€%\s]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

/** Divide a/b devolviendo 0 si b es 0 (evita NaN/Infinity). */
function safeDiv(a, b) {
  return (!b) ? 0 : (a / b);
}

/** Redondea a n decimales. */
function round(n, decimals) {
  var f = Math.pow(10, decimals || 0);
  return Math.round((Number(n) || 0) * f) / f;
}

/** Normaliza una etapa/estado del CRM a su forma canónica. */
function normalizeStage(raw) {
  if (!raw) return '';
  var key = String(raw).trim().toLowerCase();
  return STAGE_ALIASES[key] || raw;
}

/**
 * Devuelve {since, until} en formato YYYY-MM-DD para un mes dado.
 * @param {string} monthKey - 'YYYY-MM' (p.ej. '2026-06')
 */
function monthRange(monthKey) {
  var parts = monthKey.split('-');
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10); // 1-12
  var first = new Date(Date.UTC(year, month - 1, 1));
  var last = new Date(Date.UTC(year, month, 0)); // día 0 del mes siguiente = último día
  return {
    since: fmtDate(first),
    until: fmtDate(last),
    year: year,
    month: month,
    label: monthLabel(monthKey)
  };
}

/** Formatea una fecha como YYYY-MM-DD (UTC). */
function fmtDate(d) {
  return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}

var MONTH_NAMES_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** 'YYYY-MM' -> 'junio 2026' */
function monthLabel(monthKey) {
  var parts = monthKey.split('-');
  return MONTH_NAMES_ES[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}

/** monthKey del mes natural actual ('YYYY-MM'). */
function currentMonthKey() {
  var now = new Date();
  var tz = CLIENT.timezone;
  return Utilities.formatDate(now, tz, 'yyyy-MM');
}

/** Devuelve los últimos N monthKeys incluyendo el actual (más reciente primero). */
function recentMonthKeys(n) {
  var keys = [];
  var now = new Date();
  var y = parseInt(Utilities.formatDate(now, CLIENT.timezone, 'yyyy'), 10);
  var m = parseInt(Utilities.formatDate(now, CLIENT.timezone, 'MM'), 10);
  for (var i = 0; i < n; i++) {
    var mm = m - i;
    var yy = y;
    while (mm <= 0) { mm += 12; yy -= 1; }
    keys.push(yy + '-' + (mm < 10 ? '0' + mm : '' + mm));
  }
  return keys;
}

/** Log seguro a la consola de Apps Script. */
function logInfo() {
  try { console.log.apply(console, arguments); } catch (e) {}
}
