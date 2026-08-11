// Recibe el resultado del auto-diagnóstico express y crea/actualiza el
// contacto en GoHighLevel con su puntuación por etapa. Mismo esquema de
// credenciales que /api/lead (variables de entorno de Vercel).

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ETAPAS = ['captacion', 'conversion', 'cualificacion', 'venta', 'retencion'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[dx] Faltan GHL_API_KEY o GHL_LOCATION_ID en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const etapaDebil = String(b.etapa_debil || '').trim();
  const scores = b.scores || {};
  const fugas = Array.isArray(b.fugas) ? b.fugas.slice(0, 15).map(String) : [];

  const scoresOk = ETAPAS.every(function (e) {
    return Number.isInteger(scores[e]) && scores[e] >= 0 && scores[e] <= 6;
  });
  if (!nombre || !EMAIL_RE.test(email) || b.rgpd !== true || !scoresOk || !etapaDebil) {
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
        source: 'qualivo.io — auto-diagnóstico express',
        tags: ['qualivo-landing', 'autodiagnostico', 'debil-' + etapaDebil.toLowerCase()]
      })
    });
    if (!upsertRes.ok) {
      console.error('[dx] GHL upsert falló', upsertRes.status, (await upsertRes.text()).slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    const resumen = ETAPAS.map(function (e) {
      return '· ' + e.charAt(0).toUpperCase() + e.slice(1) + ': ' + scores[e] + '/6';
    }).join('\n');

    if (contactId) {
      const nota = [
        'Auto-diagnóstico express — qualivo.io',
        '',
        'Etapa más débil: ' + etapaDebil,
        '',
        'Puntuación:',
        resumen,
        '',
        fugas.length ? 'Respuestas con fuga (no / no lo sé):\n' + fugas.map(function (f) { return '· ' + f; }).join('\n') : '',
        '',
        'Consentimiento RGPD: sí · ' + new Date().toISOString()
      ].join('\n');
      const noteRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      });
      if (!noteRes.ok) {
        console.error('[dx] Nota no creada', noteRes.status, (await noteRes.text()).slice(0, 300));
      }
    }

    await notifyByEmail({
      nombre, email, etapaDebil, scores, contactId, locationId
    }).catch(function (err) {
      console.error('[dx] Aviso por email falló:', err);
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[dx] Error inesperado:', err);
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
    return '<tr><td style="padding:6px 14px 6px 0;color:#5A5E66;white-space:nowrap">' + k +
      '</td><td style="padding:6px 0;color:#101319">' + esc(v) + '</td></tr>';
  };
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + lead.locationId +
    '/contacts/detail/' + lead.contactId;

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    '<h2 style="margin:0 0 4px">Auto-diagnóstico completado en qualivo.io</h2>' +
    '<p style="margin:0 0 16px;color:#E8590C;font-weight:700">Etapa más débil: ' + esc(lead.etapaDebil) + '</p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Nombre', lead.nombre) +
    fila('Email', lead.email) +
    fila('Captación', lead.scores.captacion + '/6') +
    fila('Conversión', lead.scores.conversion + '/6') +
    fila('Cualificación', lead.scores.cualificacion + '/6') +
    fila('Venta', lead.scores.venta + '/6') +
    fila('Retención', lead.scores.retencion + '/6') +
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
      subject: '📊 Auto-diagnóstico: ' + lead.nombre + ' · débil en ' + lead.etapaDebil,
      html: html,
      reply_to: lead.email
    })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}
