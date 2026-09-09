// Cron diario (vercel.json → 08:00 UTC): envía a cada contacto de la radiografía el
// correo que le toque (días 1, 3 y 7 desde que dejó el correo; el día 1 solo si no dejó
// WhatsApp, porque entonces la pregunta va por WhatsApp). Tras el día 7: etiqueta sec-tibio
// y, si existe, etapa «Tibio» en el pipeline (toque a 30 días por el SDR, sin día 14 automático).
// Estado en etiquetas: sec-d1, sec-d3, sec-d7 (enviado), sec-tibio, sec-baja (no quiere más),
// respondio (contestó: se para todo). Un correo por contacto y día.

const crypto = require('crypto');
const S = require('./_secuencia');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const PASOS = [1, 3, 7];
const PIPELINE_ID = '980j4DzvOwp7aDmkk2ZA';
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
    // Fuera de la secuencia: baja, tibio, contestó, reunión reservada, cliente, cualificado a mano o DND
    const PARAR = ['sec-baja', 'sec-tibio', 'respondio', 'reunion-reservada', 'cliente-ganado', 'diagnostic-cualificado'];
    if (!email || PARAR.some(function (t) { return tags.includes(t); }) || c.dnd === true) { resumen.saltados++; continue; }
    const cuello = (tags.find(function (t) { return t.startsWith('cuello-'); }) || '').slice(7);
    if (!cuello || !S.ORDEN.includes(cuello)) { resumen.saltados++; continue; }
    const segunda = (tags.find(function (t) { return t.startsWith('segunda-'); }) || '').slice(8);
    // Fecha del diagnóstico: etiqueta dx-YYYYMMDD (la más reciente); si no la hay, el alta del contacto
    const dx = tags.filter(function (t) { return /^dx-\d{8}$/.test(t); }).sort().pop();
    const creado = dx ? Date.parse(dx.slice(3, 7) + '-' + dx.slice(7, 9) + '-' + dx.slice(9, 11) + 'T08:00:00Z') : Date.parse(c.dateAdded || c.createdAt || '');
    if (!creado) { resumen.saltados++; continue; }
    const dias = (ahora - creado) / 86400000;
    if (dias > MAX_DIAS) { resumen.saltados++; continue; }

    // El primer paso vencido que no se haya enviado; solo uno por ejecución.
    // Día 1 solo sin WhatsApp (con número, la pregunta la hace Maikel por WhatsApp).
    const conWhatsApp = !!c.phone || tags.includes('con-whatsapp');
    const paso = PASOS.find(function (pz) { return dias >= pz && !tags.includes('sec-d' + pz) && !(pz === 1 && conWhatsApp); });
    if (!paso) {
      if (dias >= 8 && tags.includes('sec-d7')) await marcarTibio(c, ghl, locationId).catch(function (err) { console.error('[secuencia] tibio', c.id, String(err).slice(0, 120)); });
      resumen.saltados++; continue;
    }
    const puntos = puntosCuello(c, cuello);

    const bajaUrl = 'https://qualivo.io/api/baja/?c=' + encodeURIComponent(c.id) + '&t=' + firma(c.id, secreto);
    const m = S.correo(paso, c, cuello, segunda, bajaUrl, puntos);
    if (!m) { resumen.saltados++; continue; }

    try {
      const env = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: email, subject: m.asunto, html: m.html,
          reply_to: process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io',
          headers: { 'List-Unsubscribe': '<' + bajaUrl + '>' },
          tags: [{ name: 'paso', value: 'd' + paso }, { name: 'contacto', value: String(c.id) }] })
      });
      if (!env.ok) throw new Error('Resend ' + env.status + ': ' + (await env.text()).slice(0, 200));
      // Marcar como enviado (si esto falla, mañana podría repetirse: se registra)
      const tg = await fetch(GHL_BASE + '/contacts/' + c.id + '/tags', {
        method: 'POST', headers: ghl, body: JSON.stringify({ tags: ['sec-d' + paso] })
      });
      if (!tg.ok) console.error('[secuencia] etiqueta no puesta', c.id, tg.status);
      if (paso === 7) await marcarTibio(c, ghl, locationId).catch(function (err) { console.error('[secuencia] tibio', c.id, String(err).slice(0, 120)); });
      resumen.enviados++;
    } catch (err) {
      resumen.errores++;
      console.error('[secuencia] fallo con', c.id, String(err).slice(0, 200));
    }
  }

  console.log('[secuencia]', JSON.stringify(resumen));
  return res.status(200).json(Object.assign({ ok: true }, resumen));
};

// Puntuación del cuello (0-100) leída de la última nota de la radiografía; si no, null.
function puntosCuello(c, cuello) {
  const nombre = { captacion: 'Captación', conversion: 'Conversión', seguimiento: 'Seguimiento', dependencia: 'Dependencia', control: 'Control' }[cuello];
  const t = (c.tags || []).map(String).find(function (x) { return x.indexOf('puntos-' + cuello + '-') === 0; });
  if (t) { const n = parseInt(t.split('-').pop(), 10); if (Number.isInteger(n)) return n; }
  void nombre;
  return null;
}

// Fin de la secuencia automática: etiqueta sec-tibio y etapa «Tibio» si existe en el pipeline.
async function marcarTibio(c, ghl, locationId) {
  const tags = (c.tags || []).map(String);
  if (tags.includes('sec-tibio')) return;
  await fetch(GHL_BASE + '/contacts/' + c.id + '/tags', { method: 'POST', headers: ghl, body: JSON.stringify({ tags: ['sec-tibio'] }) });
  const pr = await fetch(GHL_BASE + '/opportunities/pipelines?locationId=' + locationId, { headers: ghl });
  if (!pr.ok) return;
  const pl = ((await pr.json()).pipelines || []).filter(function (x) { return x.id === PIPELINE_ID; })[0];
  const etapa = ((pl && pl.stages) || []).filter(function (st) { return /tibio/i.test(st.name); })[0];
  if (!etapa) return;
  const sr = await fetch(GHL_BASE + '/opportunities/search?location_id=' + locationId + '&contact_id=' + c.id + '&pipeline_id=' + PIPELINE_ID, { headers: ghl });
  if (!sr.ok) return;
  const op = ((await sr.json()).opportunities || []).filter(function (o) { return o.status === 'open'; })[0];
  if (!op) return;
  await fetch(GHL_BASE + '/opportunities/' + op.id, { method: 'PUT', headers: ghl, body: JSON.stringify({ pipelineStageId: etapa.id }) });
}
