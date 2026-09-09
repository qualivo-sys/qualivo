// Webhook para GoHighLevel: convierte hitos del CRM en eventos de Meta por la
// Conversions API, para que Meta vea el embudo entero y no solo el registro.
//   ?evento=Schedule  → cita reservada (workflow «Appointment booked»)
//   ?evento=Purchase  → oportunidad ganada (workflow «Opportunity won»), con el valor
// Seguridad: ?k= debe coincidir con META_WEBHOOK_KEY (o, si no existe, con CRON_SECRET).
// El cuerpo es el que manda la acción «Webhook» de un workflow de GoHighLevel; si no
// trae correo ni teléfono, se consulta el contacto en el CRM por su id.

const META = require('./_meta');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EVENTOS = { Schedule: 'Schedule', Purchase: 'Purchase' };

function campo(b, rutas) {
  for (const r of rutas) {
    const v = r.split('.').reduce(function (o, k) { return (o && o[k] !== undefined) ? o[k] : undefined; }, b);
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}

async function contactoGhl(id) {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey || !id) return null;
  const r = await fetch(GHL_BASE + '/contacts/' + encodeURIComponent(id), {
    headers: { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION }
  });
  if (!r.ok) return null;
  const d = await r.json();
  return d.contact || null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  const clave = process.env.META_WEBHOOK_KEY || process.env.CRON_SECRET;
  const q = req.query || {};
  if (!clave || String(q.k || '') !== clave) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const evento = EVENTOS[String(q.evento || '')];
  if (!evento) return res.status(400).json({ ok: false, error: 'evento_desconocido' });

  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }

  const contactId = String(campo(b, ['contact_id', 'contactId', 'contact.id', 'id']) || '');
  let email = String(campo(b, ['email', 'contact.email']) || '');
  let telefono = String(campo(b, ['phone', 'contact.phone']) || '');
  let nombre = String(campo(b, ['first_name', 'firstName', 'full_name', 'contact.firstName', 'contact.name']) || '');
  if ((!email && !telefono) && contactId) {
    const c = await contactoGhl(contactId).catch(function () { return null; });
    if (c) { email = c.email || ''; telefono = c.phone || ''; nombre = nombre || c.firstName || ''; }
  }

  // Identificador estable por hito: si GoHighLevel reintenta, Meta no lo cuenta dos veces
  const hito = String(campo(b, ['calendar.appointmentId', 'calendar.id', 'appointment.id', 'opportunity.id', 'opportunity_id']) ||
    campo(b, ['calendar.startTime', 'appointment.startTime', 'date_created']) || new Date().toISOString().slice(0, 10));
  const eventoId = ('ghl-' + evento.toLowerCase() + '-' + (contactId || email) + '-' + hito).replace(/[^a-z0-9-]/gi, '').slice(0, 96);

  const custom = {};
  if (evento === 'Purchase') {
    const valor = Number(String(campo(b, ['lead_value', 'monetaryValue', 'opportunity.monetaryValue', 'opportunity.lead_value', 'valor']) || '').replace(/[^\d.]/g, ''));
    custom.value = valor > 0 ? valor : 0;
    custom.currency = 'EUR';
    custom.content_name = 'cliente-qualivo';
  } else {
    custom.content_name = 'reunion-20-minutos';
  }

  const meta = await META.enviarEvento(evento, {
    email, telefono, nombre, contactId, eventoId, custom,
    accion: 'system_generated',
    url: 'https://qualivo.io/donde-se-rompe-tu-crecimiento/'
  }).catch(function (err) {
    console.error('[meta-evento] fallo', evento, String(err).slice(0, 200));
    return 'error';
  });

  console.log('[meta-evento]', evento, contactId || email, meta);
  return res.status(200).json({ ok: true, evento: evento, meta: meta });
};
