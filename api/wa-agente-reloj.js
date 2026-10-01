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
  // Pausa general (api/_pausa.js): esta vuelta no hace nada.
  if (require('./_pausa.js').PAUSA_TOTAL) return res.status(200).json({ ok: true, pausa_total: true });
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(200).json({ ok: false, error: 'sin_modelo' });
  if (!A.enVentana('whatsapp')) return res.status(200).json({ ok: true, esperando: 'fuera de horario' });

  const resumen = { miradas: 0, atendidas: 0, acciones: {} };
  // 1-oct-2026 (Bloque 1): los A/B retenidos salen solos a los 10 minutos si
  // Maikel no ha escrito ni ha puesto wa1-cancelar. Va aquí porque este reloj
  // corre cada 2 minutos; api/activacion.js lo repite cada 10 de respaldo.
  try { resumen.retenidos = await A.soltarRetenidos(); delete resumen.retenidos.detalle; }
  catch (e) { console.error('[wa-agente-reloj] soltar retenidos:', e && e.message); }
  try {
    const r = await fetch(A.GHL_BASE + '/conversations/search?locationId=' + encodeURIComponent(process.env.GHL_LOCATION_ID) +
      '&limit=' + (A.ahoraMadrid().minutos < 8 * 60 + 30 ? 50 : 20) + '&sortBy=last_message_date&sort=desc', { headers: A.cabeceras() });
    const d = r.ok ? await r.json() : {};
    // A primera hora (8:00-8:30) se miran también las respuestas de la noche:
    // de 21:30 a 8:00 no se contesta, y sin esto se quedaban sin respuesta.
    const temprano = A.ahoraMadrid().minutos < 8 * 60 + 30;
    const desde = Date.now() - (temprano ? 11 * 60 : VENTANA_MIN) * 60000;
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
