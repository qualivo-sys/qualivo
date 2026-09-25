// Sesión del modo real de Qualivo Intelligence (qualivo.io/intelligence/?sector=qualivo&modo=real).
//
// Contraseña: variable de entorno INTELLIGENCE_CLAVE (la pone Maikel en Vercel).
// La cookie lleva la caducidad y una firma HMAC; la clave de firma se deriva de
// la contraseña, así que al cambiarla se cierran todas las sesiones abiertas.
// HttpOnly, Secure, SameSite=Strict y solo para /api: la página no la ve.

const crypto = require('crypto');

const COOKIE = 'qi_sesion';
const DURACION_S = 12 * 60 * 60;

function claveFirma() {
  const c = process.env.INTELLIGENCE_CLAVE || '';
  return c ? crypto.createHash('sha256').update('qualivo-intelligence|' + c).digest() : null;
}

function firmar(exp) {
  return crypto.createHmac('sha256', claveFirma()).update(String(exp)).digest('hex');
}

function igual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function leerCookie(req) {
  const raw = String((req.headers && req.headers.cookie) || '');
  const m = raw.split(/;\s*/).filter(function (p) { return p.indexOf(COOKIE + '=') === 0; })[0];
  return m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : '';
}

// ¿Hay sesión válida?
function valida(req) {
  if (!claveFirma()) return false;
  const v = leerCookie(req);
  const i = v.indexOf('.');
  if (i < 1) return false;
  const exp = Number(v.slice(0, i));
  if (!exp || exp < Math.floor(Date.now() / 1000)) return false;
  return igual(v.slice(i + 1), firmar(exp));
}

function cookieSesion() {
  const exp = Math.floor(Date.now() / 1000) + DURACION_S;
  return COOKIE + '=' + encodeURIComponent(exp + '.' + firmar(exp)) + '; Path=/api; Max-Age=' + DURACION_S + '; HttpOnly; Secure; SameSite=Strict';
}
function cookieBorrar() {
  return COOKIE + '=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Strict';
}

// Compara la contraseña en tiempo constante (sobre sus hashes).
function claveCorrecta(intento) {
  const c = process.env.INTELLIGENCE_CLAVE || '';
  if (!c) return false;
  const h = function (s) { return crypto.createHash('sha256').update(String(s)).digest(); };
  return crypto.timingSafeEqual(h(intento), h(c));
}

// Intentos fallidos por IP (en memoria de la instancia): 8 cada 15 minutos.
const fallos = {};
function bloqueada(ip) {
  const f = fallos[ip];
  if (!f) return false;
  if (Date.now() - f.desde > 15 * 60000) { delete fallos[ip]; return false; }
  return f.n >= 8;
}
function fallo(ip) {
  const f = fallos[ip] || { n: 0, desde: Date.now() };
  f.n++; fallos[ip] = f;
}

function ipDe(req) {
  return String((req.headers && req.headers['x-forwarded-for']) || (req.socket && req.socket.remoteAddress) || 'x').split(',')[0].trim();
}

module.exports = { valida: valida, cookieSesion: cookieSesion, cookieBorrar: cookieBorrar, claveCorrecta: claveCorrecta, bloqueada: bloqueada, fallo: fallo, ipDe: ipDe, configurada: function () { return !!claveFirma(); } };
