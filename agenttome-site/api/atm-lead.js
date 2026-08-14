// Registra en GoHighLevel los leads de las herramientas de IA de Agent to Me
// ("convierte-una-tarea" y "contratarias"): quién es y qué ha respondido la
// herramienta. Mismas variables de entorno que api/scan.js.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const FUENTES = {
  'convierte-una-tarea': { tag: 'convierte-una-tarea', nombre: 'Convierte una tarea en un puesto' },
  'contratarias': { tag: 'contratarias', nombre: '¿Contratarías a esta persona?' }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const empresa = String(b.empresa || '').trim();
  const email = String(b.email || '').trim();
  const fuente = FUENTES[b.fuente];
  const input = String(b.input || '').slice(0, 600);
  const resumen = String(b.resumen || '').slice(0, 2000);

  if (!nombre || !empresa || !EMAIL_RE.test(email) || !fuente || !input) {
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
        source: 'agenttome.io — ' + fuente.nombre,
        tags: ['atm-tool', 'origen-' + fuente.tag]
      })
    });
    if (!upsertRes.ok) {
      console.error('[atm-lead] upsert falló', upsertRes.status, (await upsertRes.text()).slice(0, 400));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        fuente.nombre + ' — agenttome.io',
        '',
        'Lo que ha descrito:',
        input,
        '',
        'Resultado:',
        resumen,
        '',
        new Date().toISOString()
      ].join('\n');
      await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      }).catch(function () {});
    }

    await notify({ nombre, empresa, email, fuente, input, resumen, contactId, locationId })
      .catch(function (e) { console.error('[atm-lead] email falló:', e); });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[atm-lead] error:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

async function notify(x) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'info@maikelechevarria.com';
  const from = process.env.LEAD_NOTIFY_FROM || 'Agent to Me <onboarding@resend.dev>';
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + x.locationId + '/contacts/detail/' + x.contactId;
  const esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
  const html = '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    '<h2 style="margin:0 0 4px">' + esc(x.fuente.nombre) + ' completado</h2>' +
    '<p style="margin:0 0 14px">' + esc(x.nombre) + ' · ' + esc(x.empresa) + ' · ' + esc(x.email) + '</p>' +
    '<p style="margin:0 0 8px;color:#5A6472"><strong>Ha descrito:</strong><br>' + esc(x.input) + '</p>' +
    '<p style="margin:0;color:#5A6472"><strong>Resultado:</strong><br>' + esc(x.resumen).replace(/\n/g, '<br>') + '</p>' +
    (x.contactId ? '<p style="margin:16px 0 0"><a href="' + ghlUrl + '">Ver en GoHighLevel →</a></p>' : '') +
    '</div>';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: to, subject: '🤖 ' + x.fuente.nombre + ': ' + x.nombre + ' · ' + x.empresa, html: html, reply_to: x.email })
  });
  if (!r.ok) throw new Error('Resend ' + r.status);
}
