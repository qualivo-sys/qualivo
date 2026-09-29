// Captura de lead magnets de /recursos/: crea/actualiza el contacto en
// GoHighLevel con el tag lm-<recurso>. Mismo patrón que api/lead.js —
// las claves viven en variables de entorno de Vercel, nunca en el navegador.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Solo recursos publicados: evita tags arbitrarios desde el cliente.
const RECURSOS = {
  'auditoria-funnel': 'Checklist · Auditoría de funnel en una tarde',
  'simulador-embudo': 'Simulador del embudo + guía de las 5 fugas'
};
// Preguntas de cualificación opcionales (hoy solo las manda /recursos/simulador-embudo/).
// Valor del formulario → [tag en GHL, texto para la nota]. Lo que no esté aquí se ignora,
// así un recurso que no las mande sigue funcionando igual.
const INVERSION = {
  'nada': ['lm-inversion-nada', 'Nada todavía'],
  'menos-600': ['lm-inversion-menos-600', 'Menos de 600 €'],
  '600-2000': ['lm-inversion-600-2000', '600–2.000 €'],
  'mas-2000': ['lm-inversion-mas-2000', 'Más de 2.000 €']
};
const VOLUMEN = {
  'menos-20': ['lm-volumen-menos-20', 'Menos de 20'],
  '20-50': ['lm-volumen-20-50', '20–50'],
  '50-150': ['lm-volumen-50-150', '51–150'],
  'mas-150': ['lm-volumen-mas-150', 'Más de 150'],
  'no-lo-se': ['lm-volumen-no-lo-se', 'No lo sé']
};

// Solo claves propias del objeto (que «constructor» o «toString» no cuelen).
function elegir(mapa, clave) {
  return Object.prototype.hasOwnProperty.call(mapa, clave) ? mapa[clave] : null;
}

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
  const inversion = elegir(INVERSION, String(b.inversion || '').trim());
  const volumen = elegir(VOLUMEN, String(b.volumen || '').trim());

  if (!EMAIL_RE.test(email) || !elegir(RECURSOS, recurso) || b.rgpd !== true) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const ghlHeaders = {
    Authorization: 'Bearer ' + apiKey,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };

  const etiquetas = ['qualivo-recursos', 'lm-' + recurso]
    .concat(inversion ? [inversion[0]] : [], volumen ? [volumen[0]] : []);
  try {
    const upsertRes = await fetch(GHL_BASE + '/contacts/upsert', {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId: locationId,
        name: nombre || undefined,
        email: email,
        source: 'qualivo.io — recurso ' + recurso
        // 30-sep: sin «tags» en el upsert: si el contacto ya existía, GHL SUSTITUYE sus etiquetas (se perdían nivel, paid, meta-lead…). Se añaden después con el endpoint que suma.
      })
    });
    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      console.error('[recurso] GHL upsert falló', upsertRes.status, detail.slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;
    if (contactId && etiquetas.length) {
      const tg = await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', { method: 'POST', headers: ghlHeaders, body: JSON.stringify({ tags: etiquetas }) });
      if (!tg.ok) console.error('[recurso] etiquetas no se pusieron', contactId, tg.status);
    }

    if (contactId) {
      const nota = [
        'Descarga de recurso — qualivo.io/recursos',
        '',
        'Recurso: ' + RECURSOS[recurso] + ' (' + recurso + ')',
        nombre ? 'Nombre: ' + nombre : null,
        inversion ? 'Inversión al mes en anuncios: ' + inversion[1] : null,
        volumen ? 'Solicitudes de información al mes: ' + volumen[1] : null,
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
