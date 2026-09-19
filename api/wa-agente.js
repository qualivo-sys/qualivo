// Entrada del agente de WhatsApp (api/_agente.js). La llama un workflow de
// GHL con el activador «el cliente ha respondido» por WhatsApp, acción
// Webhook (POST) a https://qualivo.io/api/wa-agente/?k=<AGENDA_SECRET>.
//
// Del cuerpo solo se usa el id del contacto: la conversación se relee entera
// desde GHL, así da igual qué campos mande el workflow. Con {"simular":true}
// hace todo menos enviar y devuelve lo que habría contestado: es la forma de
// probar el tono con un contacto real sin que le llegue nada.

const AGENTE = require('./_agente.js');

module.exports = async function handler(req, res) {
  let recibido = (req.query && req.query.k) || req.headers['x-agenda-secret'] || '';
  if (!recibido && req.url) {
    const m = String(req.url).match(/[?&]k=([^&]+)/);
    if (m) recibido = decodeURIComponent(m[1]);
  }
  const esperado = process.env.WA_AGENTE_SECRET || process.env.AGENDA_SECRET;
  if (!esperado) return res.status(500).json({ ok: false, error: 'not_configured' });
  if (String(recibido) !== esperado) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  // GHL manda contact_id; por si acaso se aceptan las otras formas habituales.
  const contactId = String(b.contact_id || b.contactId || (b.contact && b.contact.id) || b.id || '').trim();
  if (!contactId) return res.status(400).json({ ok: false, error: 'sin_contact_id' });
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[wa-agente] falta ANTHROPIC_API_KEY: no se contesta a ' + contactId);
    return res.status(200).json({ ok: false, error: 'sin_modelo' });
  }
  // En simulación se puede pasar una conversación inventada (mensajes con
  // direction/body) para probar el tono sin que nadie escriba de verdad.
  const opciones = { simular: !!b.simular };
  if (b.simular && Array.isArray(b.mensajes) && b.mensajes.length) {
    const ahora = Date.now();
    opciones.mensajes = b.mensajes.map(function (m, i) {
      return { messageType: 'TYPE_WHATSAPP', direction: m.direction || (i % 2 ? 'inbound' : 'outbound'), status: 'delivered',
        dateAdded: new Date(ahora - (b.mensajes.length - i) * 60000).toISOString(), body: String(m.body || m.texto || '') };
    });
  }
  const r = await AGENTE.atender(contactId, opciones);
  return res.status(200).json(Object.assign({ ok: r.accion !== 'error' }, r));
};
