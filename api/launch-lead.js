// Formulario de qualivo.io/launch/ → contacto en GHL con tag launch-interes.

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
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });

  const b = req.body || {};
  if (b.website3) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const empresa = String(b.empresa || '').trim();
  const idea = String(b.idea || '').trim();
  if (!nombre || !idea || !EMAIL_RE.test(email)) {
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
        companyName: empresa || undefined,
        source: 'qualivo.io/launch — cuéntanos tu idea',
        tags: ['qualivo-landing', 'launch-interes']
      })
    });
    if (!upsertRes.ok) {
      console.error('[launch] upsert falló', upsertRes.status, (await upsertRes.text()).slice(0, 400));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        'Interés en Qualivo Launch — qualivo.io/launch',
        '',
        'Nombre: ' + nombre,
        'Empresa: ' + (empresa || '—'),
        '',
        'Qué quiere lanzar:',
        idea,
        '',
        new Date().toISOString()
      ].join('\n');
      await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      }).catch(function () {});
    }

    await notify({ nombre, email, empresa, idea, contactId, locationId })
      .catch(function (e) { console.error('[launch] email falló:', e); });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[launch] error:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

async function notify(x) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'info@maikelechevarria.com';
  const from = process.env.LEAD_NOTIFY_FROM || 'Qualivo Landing <onboarding@resend.dev>';
  const esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + x.locationId + '/contacts/detail/' + x.contactId;
  const html = '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    '<h2 style="margin:0 0 4px">Lead de Qualivo Launch 🚀</h2>' +
    '<p style="margin:0 0 14px;color:#0E7C74;font-weight:700">' + esc(x.nombre) + ' · ' + esc(x.empresa || 'sin empresa') + ' · ' + esc(x.email) + '</p>' +
    '<p style="margin:0;white-space:pre-wrap">' + esc(x.idea) + '</p>' +
    (x.contactId ? '<p style="margin:16px 0 0"><a href="' + ghlUrl + '">Ver en GoHighLevel →</a></p>' : '') +
    '</div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: to, subject: '🚀 Launch: ' + x.nombre + ' quiere lanzar algo', html: html, reply_to: x.email })
  });
  if (!r.ok) throw new Error('Resend ' + r.status);
}
