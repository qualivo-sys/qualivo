// Recibe el formulario de agenttome.io y crea/actualiza el contacto en
// GoHighLevel. Las claves viven en variables de entorno de Vercel
// (GHL_API_KEY, GHL_LOCATION_ID) y nunca llegan al navegador.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[atm-lead] Faltan GHL_API_KEY o GHL_LOCATION_ID en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};

  // Honeypot en servidor: éxito falso, sin crear nada.
  if (b.website2) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const empresa = String(b.empresa || '').trim();
  const web = String(b.web || '').trim();
  const trabajo = String(b.trabajo || '').trim();

  if (!nombre || !empresa || !trabajo || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const ghlHeaders = {
    Authorization: 'Bearer ' + apiKey,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };

  try {
    const upsertRes = await fetch(GHL_BASE + '/contacts/upsert', {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId: locationId,
        name: nombre,
        email: email,
        companyName: empresa,
        website: web || undefined,
        source: 'agenttome.io — formulario analizar mi empresa',
        tags: ['agenttome-landing', 'origen-agenttome']
      })
    });
    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      console.error('[atm-lead] GHL upsert falló', upsertRes.status, detail.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        'Solicitud de análisis — agenttome.io',
        '',
        'Nombre: ' + nombre,
        'Empresa: ' + empresa,
        'Web: ' + (web || '—'),
        '',
        'Trabajo repetitivo que quiere dejar de hacer:',
        trabajo,
        '',
        new Date().toISOString()
      ].join('\n');
      const noteRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      });
      if (!noteRes.ok) {
        console.error('[atm-lead] Nota no creada', noteRes.status, (await noteRes.text()).slice(0, 300));
      }
    }

    await notifyByEmail({ nombre, email, empresa, web, trabajo, contactId, locationId })
      .catch(function (err) { console.error('[atm-lead] Aviso por email falló:', err); });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[atm-lead] Error inesperado:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

async function notifyByEmail(lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'info@maikelechevarria.com';
  const from = process.env.LEAD_NOTIFY_FROM || 'Agent to Me <onboarding@resend.dev>';

  const esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  const fila = function (k, v) {
    return '<tr><td style="padding:6px 14px 6px 0;color:#5A6472;white-space:nowrap;vertical-align:top">' +
      k + '</td><td style="padding:6px 0;color:#08090C">' + esc(v) + '</td></tr>';
  };
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + lead.locationId +
    '/contacts/detail/' + lead.contactId;

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    '<h2 style="margin:0 0 4px">Nuevo lead en agenttome.io</h2>' +
    '<p style="margin:0 0 16px;color:#0FA968;font-weight:700">Quiere analizar su empresa</p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Nombre', lead.nombre) +
    fila('Email', lead.email) +
    fila('Empresa', lead.empresa) +
    fila('Web', lead.web || '—') +
    fila('Trabajo a digitalizar', lead.trabajo) +
    '</table>' +
    (lead.contactId
      ? '<p style="margin:18px 0 0"><a href="' + ghlUrl + '">Ver contacto en GoHighLevel →</a></p>'
      : '') +
    '</div>';

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from,
      to: to,
      subject: '🤖 Lead agenttome.io: ' + lead.nombre + ' · ' + lead.empresa,
      html: html,
      reply_to: lead.email
    })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}
