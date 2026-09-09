// Evento «Lead» a la Conversions API de Meta cuando el diagnóstico guarda un contacto.
// Complementa al píxel del navegador (que solo dispara con consentimiento): así el
// registro cuenta siempre, y el mismo event_id evita que Meta lo cuente dos veces.
// Datos personales solo hasheados (SHA-256), como exige Meta.

const crypto = require('crypto');

const PIXEL_ID = process.env.META_PIXEL_ID || '879197745226987';

function sha(v) {
  v = String(v || '').trim().toLowerCase();
  return v ? crypto.createHash('sha256').update(v).digest('hex') : null;
}

// Envía un evento estándar de Meta (Lead, Schedule, Purchase…) por la Conversions API.
// Devuelve 'enviado', 'sin_token' o lanza error.
async function enviarEvento(nombre, d) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return 'sin_token';
  const userData = {
    em: d.email ? [sha(d.email)] : undefined,
    ph: d.telefono ? [sha(String(d.telefono).replace(/\D/g, ''))] : undefined,
    fn: d.nombre ? [sha(String(d.nombre).split(' ')[0])] : undefined,
    country: [sha('es')],
    external_id: d.contactId ? [sha(d.contactId)] : undefined,
    client_ip_address: d.ip || undefined,
    client_user_agent: d.ua || undefined,
    fbp: d.fbp || undefined,
    fbc: d.fbc || undefined
  };
  if (!userData.em && !userData.ph && !userData.external_id) throw new Error('sin datos de contacto para Meta');
  const custom = Object.assign({ content_name: 'diagnostico-crecimiento' }, d.custom || {});
  if (d.cuello) custom.cuello = d.cuello;
  if (d.nivel) custom.nivel = d.nivel;
  const evento = {
    event_name: nombre,
    event_time: Math.floor(Date.now() / 1000),
    event_id: d.eventoId || undefined,
    action_source: d.accion || 'website',
    event_source_url: d.url || 'https://qualivo.io/donde-se-rompe-tu-crecimiento/',
    user_data: userData,
    custom_data: custom
  };
  const body = { data: [evento] };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;
  const r = await fetch('https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events?access_token=' + encodeURIComponent(token), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('Meta CAPI ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return 'enviado';
}

function enviarLead(d) { return enviarEvento('Lead', d); }

// Lee _fbp y _fbc de la cabecera Cookie (cookies de primera parte del píxel).
function cookiesMeta(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach(function (c) {
    const i = c.indexOf('=');
    if (i < 0) return;
    const k = c.slice(0, i).trim();
    if (k === '_fbp' || k === '_fbc') out[k.slice(1)] = decodeURIComponent(c.slice(i + 1).trim()).slice(0, 200);
  });
  return out;
}

module.exports = { enviarEvento, enviarLead, cookiesMeta };
