// Aviso por correo cuando alguien reserva una cita en el calendario.
//
// Lo llama un workflow de GoHighLevel (disparador «Customer Booked Appointment»
// → acción «Webhook», POST a https://qualivo.io/api/cita/?k=AGENDA_SECRET).
// GoHighLevel ya manda su propia notificación al usuario asignado, pero este
// aviso llega aunque esa plantilla falle, lleva la hora en horario de Madrid y
// enlaza directo al contacto en el CRM.
//
// El cuerpo que envía el workflow no tiene un esquema fijo (cambia según la
// versión y los campos del contacto), así que se lee de forma defensiva.

const ZONA = 'Europe/Madrid';

function buscar(obj, claves) {
  // primer valor no vacío entre varias rutas «a.b.c» del cuerpo
  for (const ruta of claves) {
    let v = obj;
    for (const p of ruta.split('.')) { v = v && typeof v === 'object' ? v[p] : undefined; }
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}

function fechaLegible(valor) {
  if (!valor) return '';
  const d = new Date(valor);
  if (isNaN(d.getTime())) return String(valor);
  return d.toLocaleString('es-ES', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

function escapar(s) {
  return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
}

function fila(etiqueta, valor) {
  if (!valor) return '';
  return '<tr><td style="padding:6px 14px 6px 0;color:#7A7C82;font:13px system-ui;white-space:nowrap;vertical-align:top">' + etiqueta + '</td>' +
    '<td style="padding:6px 0;font:15px/1.5 system-ui;color:#101319">' + escapar(valor) + '</td></tr>';
}

async function enviar(asunto, html) {
  if (!process.env.RESEND_API_KEY) throw new Error('falta RESEND_API_KEY');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
      to: [process.env.CITA_NOTIFY_TO || process.env.LEAD_NOTIFY_TO || 'info@maikelechevarria.com'],
      subject: asunto, html: html
    })
  });
  if (!r.ok) throw new Error('resend ' + r.status + ': ' + (await r.text()).slice(0, 200));
}

module.exports = async function (req, res) {
  let recibido = (req.query && req.query.k) || req.headers['x-agenda-secret'] || '';
  if (!recibido && req.url) {
    const m = String(req.url).match(/[?&]k=([^&]+)/);
    if (m) recibido = decodeURIComponent(m[1]);
  }
  const esperado = process.env.AGENDA_SECRET;
  if (!esperado) return res.status(500).json({ ok: false, error: 'not_configured' });
  if (String(recibido) !== esperado) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }

  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }

  const nombre = [buscar(b, ['first_name', 'firstName', 'contact.first_name', 'contact.firstName']), buscar(b, ['last_name', 'lastName', 'contact.last_name', 'contact.lastName'])].join(' ').trim() || buscar(b, ['full_name', 'contact.name', 'name']);
  const email = buscar(b, ['email', 'contact.email']);
  const telefono = buscar(b, ['phone', 'contact.phone']);
  const empresa = buscar(b, ['company_name', 'companyName', 'contact.company_name', 'contact.companyName']);
  const inicio = buscar(b, ['calendar.startTime', 'appointment.startTime', 'startTime', 'calendar.start_time', 'appointment.start_time']);
  const fin = buscar(b, ['calendar.endTime', 'appointment.endTime', 'endTime']);
  const calendario = buscar(b, ['calendar.calendarName', 'calendar.name', 'appointment.calendarName', 'calendarName']);
  const estado = buscar(b, ['calendar.status', 'calendar.appointmentStatus', 'appointment.status', 'appointmentStatus']);
  const titulo = buscar(b, ['calendar.title', 'appointment.title', 'title']);
  const origen = buscar(b, ['contact_source', 'contact.source', 'source']);
  const contactoId = buscar(b, ['contact_id', 'contactId', 'contact.id', 'id']);
  const locationId = buscar(b, ['location.id', 'locationId']) || process.env.GHL_LOCATION_ID || '';
  const enlace = contactoId && locationId ? 'https://app.gohighlevel.com/v2/location/' + locationId + '/contacts/detail/' + contactoId : '';

  const cuando = fechaLegible(inicio);
  const asunto = 'Nueva cita' + (nombre ? ' · ' + nombre : '') + (cuando ? ' · ' + cuando : '');
  const html =
    '<div style="max-width:560px;margin:0 auto;padding:24px;font-family:system-ui">' +
    '<p style="font:12px system-ui;letter-spacing:.14em;text-transform:uppercase;color:#0E7C74;font-weight:800;margin:0 0 10px">Qualivo · cita reservada</p>' +
    '<h2 style="font:800 22px/1.2 system-ui;color:#101319;margin:0 0 18px">' + escapar(nombre || 'Alguien') + ' ha reservado' + (cuando ? ': ' + escapar(cuando) : '') + '</h2>' +
    '<table style="border-collapse:collapse">' +
    fila('Cuándo', cuando + (fin ? ' → ' + new Date(fin).toLocaleTimeString('es-ES', { timeZone: ZONA, hour: '2-digit', minute: '2-digit' }) : '')) +
    fila('Email', email) + fila('Teléfono', telefono) + fila('Empresa', empresa) + fila('Calendario', calendario || titulo) + fila('Estado', estado) + fila('Origen', origen) +
    '</table>' +
    (enlace ? '<p style="margin:22px 0 0"><a href="' + enlace + '" style="display:inline-block;background:#101319;color:#fff;text-decoration:none;font:700 14px system-ui;padding:12px 18px;border-radius:10px">Abrir el contacto en GoHighLevel</a></p>' : '') +
    '<p style="font:12px/1.5 system-ui;color:#7A7C82;margin:26px 0 0">Aviso automático de qualivo.io/api/cita. Hora en horario de Madrid.</p>' +
    '</div>';

  try {
    await enviar(asunto, html);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[cita]', e.message, JSON.stringify(b).slice(0, 500));
    return res.status(200).json({ ok: false, error: e.message });
  }
};
