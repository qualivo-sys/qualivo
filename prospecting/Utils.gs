/**
 * Utils.gs · helpers genéricos: HTTP, texto, fechas, normalización.
 */

/** Petición HTTP JSON. Devuelve {ok, code, json}. No lanza en errores HTTP. */
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
  return { ok: (code >= 200 && code < 300), code: code, json: json, body: body };
}

/** Igual que httpJson pero lanza si el código no es 2xx (para llamadas críticas). */
function httpJsonOrThrow(url, options) {
  var r = httpJson(url, options);
  if (!r.ok) throw new Error('HTTP ' + r.code + ' en ' + url + ': ' + String(r.body).slice(0, 400));
  return r.json;
}

/**
 * Normaliza texto para comparar: minúsculas, sin tildes, sin signos raros.
 * "Generación de Leads (Senior)" -> "generacion de leads senior"
 */
function normalizeText(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita tildes
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extrae el dominio limpio de una URL o email. "https://www.acme.com/x" -> "acme.com" */
function cleanDomain(input) {
  if (!input) return '';
  var s = String(input).trim().toLowerCase();
  if (s.indexOf('@') >= 0) s = s.split('@').pop();
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '');
  s = s.split('/')[0].split('?')[0].split('#')[0];
  return s;
}

/** YYYY-MM-DD de hoy en la zona horaria de Qualivo. */
function today() {
  return Utilities.formatDate(new Date(), QUALIVO.timezone, 'yyyy-MM-dd');
}

/** Marca de tiempo legible "2026-07-09 14:32". */
function nowStamp() {
  return Utilities.formatDate(new Date(), QUALIVO.timezone, 'yyyy-MM-dd HH:mm');
}

/** Días transcurridos desde una fecha ISO (o '' si no se puede parsear). */
function daysSince(isoDate) {
  if (!isoDate) return null;
  var t = Date.parse(isoDate);
  if (isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}

/** Primer nombre a partir de "María López" -> "María". */
function firstName(full) {
  if (!full) return '';
  return String(full).trim().split(/\s+/)[0];
}

/** Log seguro a la consola de Apps Script. */
function logInfo() {
  try { console.log.apply(console, arguments); } catch (e) {}
}
