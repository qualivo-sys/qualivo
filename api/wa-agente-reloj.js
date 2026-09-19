// Reloj del agente de WhatsApp (cron cada 2 min). Mira las conversaciones con
// último mensaje ENTRANTE de WhatsApp reciente y le pasa cada una al agente
// (api/_agente.js), que decide si contesta, reserva o se lo pasa a Maikel.
//
// Existe para no depender de un workflow de GHL que avise por webhook: GHL
// no lo tiene bien resuelto y cada vuelta aquí cuesta dos llamadas a su API.
// El agente lleva su propio candado y no contesta dos veces al mismo mensaje.

const A = require('./_activacion');
const AGENTE = require('./_agente.js');

const VENTANA_MIN = 30; // mensajes entrantes de hace más de esto se ignoran (ya los vio otra vuelta o Maikel)

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(200).json({ ok: false, error: 'sin_modelo' });
  if (!A.enVentana('whatsapp')) return res.status(200).json({ ok: true, esperando: 'fuera de horario' });

  const resumen = { miradas: 0, atendidas: 0, acciones: {} };
  try {
    const r = await fetch(A.GHL_BASE + '/conversations/search?locationId=' + encodeURIComponent(process.env.GHL_LOCATION_ID) +
      '&limit=20&sortBy=last_message_date&sort=desc', { headers: A.cabeceras() });
    const d = r.ok ? await r.json() : {};
    const desde = Date.now() - VENTANA_MIN * 60000;
    for (const conv of (d.conversations || [])) {
      resumen.miradas++;
      if (String(conv.lastMessageDirection) !== 'inbound') continue;
      if (Number(conv.lastMessageDate || 0) < desde) continue;
      const tipo = String(conv.lastMessageType || '');
      if (!/WHATSAPP|CUSTOM_SMS/i.test(tipo)) continue;
      if (!conv.contactId) continue;
      const h = await AGENTE.atender(conv.contactId);
      resumen.atendidas++;
      resumen.acciones[h.accion || '?'] = (resumen.acciones[h.accion || '?'] || 0) + 1;
    }
  } catch (e) {
    console.error('[wa-agente-reloj]', e && e.message);
    return res.status(200).json({ ok: false, error: e && e.message, resumen: resumen });
  }
  return res.status(200).json({ ok: true, resumen: resumen });
};
