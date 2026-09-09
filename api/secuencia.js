// Cron diario (vercel.json → 08:00 UTC): envía a cada contacto del diagnóstico el
// correo de la secuencia que le toque (días 2, 5, 9, 14, 21 desde que dejó el correo).
// Estado en las etiquetas del contacto en GoHighLevel: sec-d2, sec-d5, sec-d9,
// sec-d14, sec-d21 (enviado), sec-baja (no quiere más). Un correo por contacto y día.

const crypto = require('crypto');
const S = require('./_secuencia');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const PASOS = [2, 5, 9, 14, 21];
const MAX_DIAS = 35;   // más antiguo que esto: no se le escribe, la secuencia caducó
const MAX_ENVIOS = 60; // tope por ejecución

function firma(contactId, secreto) {
  return crypto.createHmac('sha256', secreto).update(contactId).digest('hex').slice(0, 24);
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RADIOGRAFIA_FROM || process.env.LEAD_NOTIFY_FROM || 'Maikel de Qualivo <onboarding@resend.dev>';
  if (!apiKey || !locationId || !resendKey) {
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }
  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };

  // Todos los contactos del diagnóstico (paginado)
  const contactos = [];
  let page = 1;
  while (page <= 20) {
    const r = await fetch(GHL_BASE + '/contacts/search', {
      method: 'POST', headers: ghl,
      body: JSON.stringify({ locationId, page, pageLimit: 100,
        filters: [{ field: 'tags', operator: 'contains', value: 'diagnostico-crecimiento' }] })
    });
    if (!r.ok) {
      console.error('[secuencia] búsqueda falló', r.status, (await r.text()).slice(0, 300));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const d = await r.json();
    const lote = d.contacts || [];
    contactos.push.apply(contactos, lote);
    if (lote.length < 100) break;
    page++;
  }

  const ahora = Date.now();
  const resumen = { revisados: contactos.length, enviados: 0, saltados: 0, errores: 0 };

  for (const c of contactos) {
    if (resumen.enviados >= MAX_ENVIOS) break;
    const tags = (c.tags || []).map(String);
    const email = String(c.email || '');
    if (!email || tags.includes('sec-baja') || tags.includes('diagnostic-cualificado') || c.dnd === true) { resumen.saltados++; continue; }
    const cuello = (tags.find(function (t) { return t.startsWith('cuello-'); }) || '').slice(7);
    if (!cuello || !S.ORDEN.includes(cuello)) { resumen.saltados++; continue; }
    const segunda = (tags.find(function (t) { return t.startsWith('segunda-'); }) || '').slice(8);
    const creado = Date.parse(c.dateAdded || c.createdAt || '');
    if (!creado) { resumen.saltados++; continue; }
    const dias = (ahora - creado) / 86400000;
    if (dias > MAX_DIAS) { resumen.saltados++; continue; }

    // El primer paso vencido que no se haya enviado; solo uno por ejecución.
    const paso = PASOS.find(function (pz) { return dias >= pz && !tags.includes('sec-d' + pz); });
    if (!paso) { resumen.saltados++; continue; }

    const bajaUrl = 'https://qualivo.io/api/baja?c=' + encodeURIComponent(c.id) + '&t=' + firma(c.id, secreto);
    const m = S.correo(paso, c, cuello, segunda, bajaUrl);
    if (!m) { resumen.saltados++; continue; }

    try {
      const env = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: email, subject: m.asunto, html: m.html,
          reply_to: process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io',
          headers: { 'List-Unsubscribe': '<' + bajaUrl + '>' } })
      });
      if (!env.ok) throw new Error('Resend ' + env.status + ': ' + (await env.text()).slice(0, 200));
      // Marcar como enviado (si esto falla, mañana podría repetirse: se registra)
      const tg = await fetch(GHL_BASE + '/contacts/' + c.id + '/tags', {
        method: 'POST', headers: ghl, body: JSON.stringify({ tags: ['sec-d' + paso] })
      });
      if (!tg.ok) console.error('[secuencia] etiqueta no puesta', c.id, tg.status);
      resumen.enviados++;
    } catch (err) {
      resumen.errores++;
      console.error('[secuencia] fallo con', c.id, String(err).slice(0, 200));
    }
  }

  console.log('[secuencia]', JSON.stringify(resumen));
  return res.status(200).json(Object.assign({ ok: true }, resumen));
};
