// Captura de lead magnets de /recursos/: crea/actualiza el contacto en
// GoHighLevel con el tag lm-<recurso>. Mismo patrón que api/lead.js —
// las claves viven en variables de entorno de Vercel, nunca en el navegador.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Solo recursos publicados: evita tags arbitrarios desde el cliente.
const RECURSOS = {
  'auditoria-funnel': 'Checklist · Auditoría de funnel en una tarde'
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[recurso] Faltan GHL_API_KEY o GHL_LOCATION_ID en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const recurso = String(b.recurso || '').trim();

  if (!EMAIL_RE.test(email) || !RECURSOS[recurso] || b.rgpd !== true) {
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
        name: nombre || undefined,
        email: email,
        source: 'qualivo.io — recurso ' + recurso,
        tags: ['qualivo-recursos', 'lm-' + recurso]
      })
    });
    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      console.error('[recurso] GHL upsert falló', upsertRes.status, detail.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const nota = [
        'Descarga de recurso — qualivo.io/recursos',
        '',
        'Recurso: ' + RECURSOS[recurso] + ' (' + recurso + ')',
        nombre ? 'Nombre: ' + nombre : null,
        'Consentimiento RGPD: sí · ' + new Date().toISOString()
      ].filter(Boolean).join('\n');
      const noteRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      });
      if (!noteRes.ok) {
        console.error('[recurso] Nota no creada', noteRes.status, (await noteRes.text()).slice(0, 300));
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[recurso] Error inesperado:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};
