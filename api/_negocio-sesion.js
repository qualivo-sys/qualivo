// Sesión del Panel de negocio (qualivo.io/intelligence/negocio/): usuario y contraseña.
//
// Usuarios: variable de entorno NEGOCIO_USUARIOS en Vercel, con el formato
//   usuario:contraseña;usuario2:contraseña2
// Nada de credenciales en el código. La clave de firma de la cookie se deriva de esa
// variable entera: al cambiar cualquier contraseña se cierran todas las sesiones.
//
// Cookie qi_negocio: «caducidad.usuario.firma», HMAC-SHA256, HttpOnly, Secure,
// SameSite=Strict y solo para /api (la página no la ve). 12 horas.
// 8 intentos fallidos cada 15 minutos por IP (en memoria de la instancia).

const crypto = require('crypto');

const COOKIE = 'qi_negocio';
const SAL = 'qualivo-panel-negocio|';
const DURACION_S = 12 * 60 * 60;

function usuarios() {
  const raw = String(process.env.NEGOCIO_USUARIOS || '');
  const out = {};
  raw.split(/[;\n]/).forEach(function (par) {
    const i = par.indexOf(':');
    if (i < 1) return;
    const u = par.slice(0, i).trim().toLowerCase();
    const c = par.slice(i + 1).trim();
    if (/^[a-z0-9._-]{2,40}$/.test(u) && c.length >= 8) out[u] = c;
  });
  return out;
}

function claveFirma() {
  const raw = String(process.env.NEGOCIO_USUARIOS || '');
  return raw ? crypto.createHash('sha256').update(SAL + raw).digest() : null;
}
function firmar(texto) { return crypto.createHmac('sha256', claveFirma()).update(texto).digest('hex'); }
function igual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function hash(s) { return crypto.createHash('sha256').update(String(s)).digest(); }

function leerCookie(req) {
  const raw = String((req.headers && req.headers.cookie) || '');
  const m = raw.split(/;\s*/).filter(function (p) { return p.indexOf(COOKIE + '=') === 0; })[0];
  return m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : '';
}

// Devuelve el usuario de la sesión, o '' si no hay sesión válida.
function usuario(req) {
  if (!claveFirma()) return '';
  const partes = leerCookie(req).split('.');
  if (partes.length !== 3) return '';
  const exp = Number(partes[0]);
  const u = partes[1];
  if (!exp || exp < Math.floor(Date.now() / 1000)) return '';
  if (!igual(partes[2], firmar(exp + '.' + u))) return '';
  return usuarios()[u] ? u : ''; // si se borra el usuario, su sesión deja de valer
}

function cookieSesion(u) {
  const exp = Math.floor(Date.now() / 1000) + DURACION_S;
  const v = exp + '.' + u + '.' + firmar(exp + '.' + u);
  return COOKIE + '=' + encodeURIComponent(v) + '; Path=/api; Max-Age=' + DURACION_S + '; HttpOnly; Secure; SameSite=Strict';
}
function cookieBorrar() { return COOKIE + '=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Strict'; }

// Comprueba usuario y contraseña en tiempo constante. Devuelve el usuario o ''.
function comprobar(u, c) {
  const lista = usuarios();
  const nombre = String(u || '').trim().toLowerCase();
  const real = lista[nombre];
  // Se compara siempre (aunque el usuario no exista) para no delatar qué usuarios hay.
  const ok = crypto.timingSafeEqual(hash(c), hash(real || '\u0000no-existe\u0000'));
  return real && ok ? nombre : '';
}

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

// ¿Puede este usuario pulsar acciones que escriben en GHL? Solo los de NEGOCIO_ACCIONES_USUARIOS
// (por defecto «maikel»): el resto ve el panel pero no los botones.
function puedeActuar(u) {
  const lista = String(process.env.NEGOCIO_ACCIONES_USUARIOS || 'maikel').toLowerCase().split(/[,;\s]+/).filter(Boolean);
  return !!u && lista.indexOf(u) >= 0;
}

module.exports = { usuario, cookieSesion, cookieBorrar, comprobar, bloqueada, fallo, ipDe, puedeActuar, configurada: function () { return Object.keys(usuarios()).length > 0; } };
