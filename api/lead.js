// Recibe el formulario de qualivo.io y crea/actualiza el contacto en
// GoHighLevel. La clave de la API vive en variables de entorno de Vercel
// (GHL_API_KEY, GHL_LOCATION_ID) y nunca llega al navegador.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

const FACT_VALORES = ['0', '1', '2', '3', '4'];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[lead] Faltan GHL_API_KEY o GHL_LOCATION_ID en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};

  // Honeypot también en servidor: respuesta de éxito falsa, sin crear nada.
  if (b.website) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const empresa = String(b.empresa || '').trim();
  const factValor = String(b.facturacion_valor || '');
  const facturacion = String(b.facturacion || '').trim();
  const quien = String(b.quien_capta || '').trim();
  const hipotesis = String(b.hipotesis || '').trim();

  if (!nombre || !empresa || !quien || !hipotesis ||
      !EMAIL_RE.test(email) || !FACT_VALORES.includes(factValor) ||
      b.rgpd !== true) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const cualificado = factValor !== '0';
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
        source: 'qualivo.io — formulario diagnóstico',
        tags: [
          'qualivo-landing',
          cualificado ? 'diagnostic-cualificado' : 'diagnostic-fuera-de-alcance'
        ]
      })
    });
    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      console.error('[lead] GHL upsert falló', upsertRes.status, detail.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        'Solicitud de diagnóstico — qualivo.io',
        '',
        'Nombre y cargo: ' + nombre,
        'Empresa y web: ' + empresa,
        'Facturación anual: ' + facturacion,
        'Quién lleva la captación: ' + quien,
        'Cualificado: ' + (cualificado ? 'sí' : 'no (menos de 500k)'),
        '',
        'Hipótesis del principal problema:',
        hipotesis,
        '',
        'Consentimiento RGPD: sí · ' + new Date().toISOString()
      ].join('\n');
      const noteRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      });
      // La nota es complementaria: si falla, el lead ya está en el CRM.
      if (!noteRes.ok) {
        console.error('[lead] Nota no creada', noteRes.status, (await noteRes.text()).slice(0, 300));
      }
    }

    // Aviso por email vía Resend (opcional: solo si hay RESEND_API_KEY).
    // Si falla, el lead ya está en el CRM — se registra y no rompe nada.
    await notifyByEmail({
      nombre, email, empresa, facturacion, quien, hipotesis,
      cualificado, contactId, locationId
    }).catch(function (err) {
      console.error('[lead] Aviso por email falló:', err);
    });

    return res.status(200).json({ ok: true, cualificado: cualificado });
  } catch (err) {
    console.error('[lead] Error inesperado:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

async function notifyByEmail(lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io';
  const from = process.env.LEAD_NOTIFY_FROM || 'Qualivo Landing <onboarding@resend.dev>';

  const esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  const fila = function (k, v) {
    return '<tr><td style="padding:6px 14px 6px 0;color:#5A5E66;white-space:nowrap;vertical-align:top">' +
      k + '</td><td style="padding:6px 0;color:#101319">' + esc(v) + '</td></tr>';
  };
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + lead.locationId +
    '/contacts/detail/' + lead.contactId;

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    '<h2 style="margin:0 0 4px">Nuevo lead en qualivo.io</h2>' +
    '<p style="margin:0 0 16px;color:' + (lead.cualificado ? '#0E7C74' : '#C2410C') + ';font-weight:700">' +
    (lead.cualificado ? 'Cualificado' : 'Fuera de alcance (menos de 500k)') + '</p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Nombre y cargo', lead.nombre) +
    fila('Email', lead.email) +
    fila('Empresa y web', lead.empresa) +
    fila('Facturación', lead.facturacion) +
    fila('Captación', lead.quien) +
    fila('Hipótesis', lead.hipotesis) +
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
      subject: '🔔 Lead qualivo.io: ' + lead.nombre + ' · ' + lead.facturacion +
        (lead.cualificado ? '' : ' (fuera de alcance)'),
      html: html,
      reply_to: lead.email
    })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}
