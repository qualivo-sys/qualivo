// Token corto para el enlace «elige tu hora» (?paso=agenda&c=…), 13-oct-2026.
// Antes el enlace llevaba nombre, email y teléfono en la URL, y eso acababa en registros,
// vistas previas de WhatsApp y referers. Ahora lleva el id de contacto de GHL y una firma
// HMAC: sin la clave del servidor no se puede fabricar un token para otro contacto.
// Uso: const t = require('./_agenda-token.js'); t.enlace(contactId, '/formacion/v21/')

const crypto = require('crypto');

function clave() {
  return process.env.AGENDA_TOKEN_SECRET || process.env.GHL_API_KEY || '';
}

function firma(contactId) {
  return crypto.createHmac('sha256', clave()).update('agenda:' + contactId).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 16);
}

function crear(contactId) {
  if (!contactId || !clave()) return '';
  return contactId + '.' + firma(contactId);
}

// Devuelve el contactId si el token es válido; si no, null.
function verificar(token) {
  const m = /^([A-Za-z0-9]{10,40})\.([A-Za-z0-9_-]{8,40})$/.exec(String(token || ''));
  if (!m || !clave()) return null;
  const esperada = firma(m[1]);
  const a = Buffer.from(m[2]), b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return m[1];
}

function enlace(contactId, ruta) {
  const t = crear(contactId);
  return 'https://qualivo.io' + (ruta || '/diagnostico/') + '?paso=agenda' + (t ? '&c=' + t : '');
}

module.exports = { crear: crear, verificar: verificar, enlace: enlace };
