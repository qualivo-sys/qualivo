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

function aplanar(obj, prefijo, salida) {
  // {a:{b:1}} -> {'a.b':1}; también entra en customData, que es donde GHL deja los pares personalizados
  Object.keys(obj || {}).forEach(function (k) {
    const v = obj[k], ruta = prefijo ? prefijo + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) aplanar(v, ruta, salida); else salida[ruta] = v;
  });
  return salida;
}

function buscar(plano, patrones) {
  // primer valor no vacío cuya clave (sin la ruta) case con alguno de los patrones, en orden de preferencia
  for (const re of patrones) {
    for (const ruta of Object.keys(plano)) {
      const clave = ruta.split('.').pop();
      const v = plano[ruta];
      if (re.test(clave) && v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
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

  const plano = aplanar(b, '', {});
  const nombre = buscar(plano, [/^(contact_)?full_?name$/i, /^name$/i]) ||
    [buscar(plano, [/^(contact_)?first_?name$/i]), buscar(plano, [/^(contact_)?last_?name$/i])].join(' ').trim();
  const email = buscar(plano, [/^(contact_)?email$/i]);
  const telefono = buscar(plano, [/^(contact_)?phone$/i]);
  const empresa = buscar(plano, [/^(contact_)?company_?name$/i]);
  const inicio = buscar(plano, [/^(appointment_)?start(_?date)?(_?time)?$/i, /^startTime$/i]);
  const fin = buscar(plano, [/^(appointment_)?end(_?date)?(_?time)?$/i, /^endTime$/i]);
  const calendario = buscar(plano, [/^calendar_?name$/i, /^calendarName$/i]);
  const estado = buscar(plano, [/^(appointment_)?status$/i, /^appointmentStatus$/i]);
  const titulo = buscar(plano, [/^(appointment_)?title$/i]);
  const notas = buscar(plano, [/^(appointment_)?notes?$/i]);
  const lugar = buscar(plano, [/^(appointment_)?meeting_?location$/i, /^address$/i]);
  const origen = buscar(plano, [/^(contact_)?source$/i]);
  const contactoId = buscar(plano, [/^contact_?id$/i]) || (b.contact && b.contact.id) || '';
  const locationId = buscar(plano, [/^location_?id$/i]) || (b.location && b.location.id) || process.env.GHL_LOCATION_ID || '';
  const enlace = contactoId && locationId ? 'https://app.gohighlevel.com/v2/location/' + locationId + '/contacts/detail/' + contactoId : '';

  const cuando = fechaLegible(inicio);
  const asunto = 'Nueva cita' + (nombre ? ' · ' + nombre : '') + (cuando ? ' · ' + cuando : '');
  const html =
    '<div style="max-width:560px;margin:0 auto;padding:24px;font-family:system-ui">' +
    '<p style="font:12px system-ui;letter-spacing:.14em;text-transform:uppercase;color:#0E7C74;font-weight:800;margin:0 0 10px">Qualivo · cita reservada</p>' +
    '<h2 style="font:800 22px/1.2 system-ui;color:#101319;margin:0 0 18px">' + escapar(nombre || 'Alguien') + ' ha reservado' + (cuando ? ': ' + escapar(cuando) : '') + '</h2>' +
    '<table style="border-collapse:collapse">' +
    fila('Cuándo', cuando + (fin ? ' → ' + new Date(fin).toLocaleTimeString('es-ES', { timeZone: ZONA, hour: '2-digit', minute: '2-digit' }) : '')) +
    fila('Email', email) + fila('Teléfono', telefono) + fila('Empresa', empresa) + fila('Calendario', calendario || titulo) + fila('Dónde', lugar) + fila('Notas', notas) + fila('Estado', estado) + fila('Origen', origen) +
    '</table>' +
    (enlace ? '<p style="margin:22px 0 0"><a href="' + enlace + '" style="display:inline-block;background:#101319;color:#fff;text-decoration:none;font:700 14px system-ui;padding:12px 18px;border-radius:10px">Abrir el contacto en GoHighLevel</a></p>' : '') +
    '<p style="font:12px/1.5 system-ui;color:#7A7C82;margin:26px 0 0">Aviso automático de qualivo.io/api/cita. Hora en horario de Madrid.</p>' +
    '</div>';

  // El trato de Prospección pasa a «Reunión agendada» (se crea si no lo tenía,
  // p. ej. alguien que reserva directo desde /llamada/ sin haber pasado por un formulario).
  if (contactoId && process.env.GHL_API_KEY) {
    await require('./_cita.js').confirmarCita({
      contactId: contactoId, inicio: inicio, origen: 'Calendario', fuente: origen || 'Reserva en el calendario'
    });
  }

  try {
    await enviar(asunto, html);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[cita]', e.message, JSON.stringify(b).slice(0, 500));
    return res.status(200).json({ ok: false, error: e.message });
  }
};
