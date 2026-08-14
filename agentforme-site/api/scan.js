// Recibe el resultado del Company Scan de agentforme.io y crea/actualiza el
// contacto en GoHighLevel con el empleado recomendado y las respuestas.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const EMPLEADOS = ['sdr-digital', 'sales-manager-digital', 'support-digital', 'collection-digital', 'cfo-digital', 'marketing-analyst', 'content-creator', 'customer-success-digital', 'operations-digital'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });

  const b = req.body || {};
  if (b.website2) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const empresa = String(b.empresa || '').trim();
  const recomendado = String(b.recomendado || '').trim();
  const horasMes = Number(b.horas_mes) || 0;
  const eurosMes = Number(b.euros_mes) || 0;
  const detalle = Array.isArray(b.detalle) ? b.detalle.slice(0, 15) : [];

  if (!nombre || !empresa || !EMAIL_RE.test(email) || !EMPLEADOS.includes(recomendado)) {
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
        source: 'agentforme.io — Company Scan',
        tags: ['atm-scan', 'origen-agentforme', 'scan-' + recomendado]
      })
    });
    if (!upsertRes.ok) {
      console.error('[afm-scan] upsert falló', upsertRes.status, (await upsertRes.text()).slice(0, 400));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        'Company Scan — agentforme.io',
        '',
        'Empleado recomendado: ' + recomendado,
        'Trabajo repetitivo estimado: ~' + horasMes + ' h/mes ≈ ' + eurosMes + ' €/mes',
        '',
        'Respuestas:',
        detalle.map(function (d) { return '· ' + String(d).slice(0, 140); }).join('\n'),
        '',
        new Date().toISOString()
      ].join('\n');
      await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      }).catch(function () {});
    }

    await notify({ nombre, email, empresa, recomendado, horasMes, eurosMes, contactId, locationId })
      .catch(function (e) { console.error('[afm-scan] email falló:', e); });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[afm-scan] error:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

async function notify(x) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'info@maikelechevarria.com';
  const from = process.env.LEAD_NOTIFY_FROM || 'Agent for Me <onboarding@resend.dev>';
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + x.locationId + '/contacts/detail/' + x.contactId;
  const html = '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    '<h2 style="margin:0 0 4px">Company Scan completado</h2>' +
    '<p style="margin:0 0 14px;color:#0FA968;font-weight:700">' + x.recomendado + ' · ~' + x.eurosMes + ' €/mes en juego</p>' +
    '<p style="margin:0">' + x.nombre + ' · ' + x.empresa + ' · ' + x.email + '</p>' +
    (x.contactId ? '<p style="margin:16px 0 0"><a href="' + ghlUrl + '">Ver en GoHighLevel →</a></p>' : '') +
    '</div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: to, subject: '🧭 Company Scan: ' + x.empresa + ' → ' + x.recomendado, html: html, reply_to: x.email })
  });
  if (!r.ok) throw new Error('Resend ' + r.status);
}
