// Reenganche de conversaciones paradas (regla de Maikel, 21-sep-2026):
//
//   «Los que han contestado pero se ha quedado ahí la cosa: contestar siempre
//   en su contexto, que el sistema intente generar cita sin ser invasivo ni
//   pesado, y si tras varios intentos no hay manera, se descarta.»
//
// Quién entra: leads que contestaron (act-respondio) y cuyo último mensaje
// de WhatsApp es nuestro, sin cita y sin que Maikel lleve el hilo. Tres
// intentos como mucho, cada uno más espaciado que el anterior, escritos por
// el agente de WhatsApp leyendo toda la conversación (api/_agente.js), nunca
// una plantilla. Tras el tercero sin respuesta, el lead pasa a descartado:
// etiqueta act-descartado, trato perdido y nota.
//
//   intento 1 → 1 día después de nuestro último mensaje
//   intento 2 → 3 días después del intento 1
//   intento 3 → 5 días después del intento 2 (despedida, sin pedir nada)
//   descarte  → 5 días después del intento 3
//
// Ritmo: lo llama el reloj de activación cada diez minutos y manda UNO por
// vuelta, solo entre semana, de 9:30 a 13:30 y de 16:00 a 19:30, nunca en
// punto. Así nada sale en tanda ni parece automático.

const A = require('./_activacion');

const DIAS = [1, 3, 5];       // espera antes de cada intento
const DIAS_DESCARTE = 5;      // tras el tercero
const ETIQUETAS = ['reeng-1', 'reeng-2', 'reeng-3'];

function enVentanaReenganche(t) {
  if (t.dia === 0 || t.dia === 6) return false;
  if (t.minuto === 0) return false;
  const manana = t.minutos >= 9 * 60 + 30 && t.minutos <= 13 * 60 + 30;
  const tarde = t.minutos >= 16 * 60 && t.minutos <= 19 * 60 + 30;
  return manana || tarde;
}

function intentosHechos(c) {
  return ETIQUETAS.filter(function (e) { return A.tiene(c, e); }).length;
}

// Última conversación de WhatsApp (oficial o pasarela) del contacto según el
// índice de GHL: { direccion, fecha } o null. Una sola llamada.
async function ultimaConversacion(contactId) {
  try {
    const r = await fetch(A.GHL_BASE + '/conversations/search?locationId=' + encodeURIComponent(process.env.GHL_LOCATION_ID) + '&contactId=' + contactId, { headers: A.cabeceras() });
    if (!r.ok) return null;
    const d = await r.json().catch(function () { return {}; });
    const convs = (d.conversations || []).filter(function (c) { return /WHATSAPP|CUSTOM_SMS/i.test(String(c.lastMessageType || '')); })
      .sort(function (a, b) { return Number(b.lastMessageDate || 0) - Number(a.lastMessageDate || 0); });
    if (!convs.length) return null;
    return { direccion: String(convs[0].lastMessageDirection || ''), fecha: Number(convs[0].lastMessageDate || 0) };
  } catch (e) { return null; }
}

async function descartar(c, motivo) {
  await A.etiquetar(c.id, ['act-descartado']);
  try {
    const T = require('./_tratos.js');
    const op = await T.abierto(c.id);
    if (op && op.id) {
      await fetch(A.GHL_BASE + '/opportunities/' + op.id, {
        method: 'PUT', headers: A.cabeceras(),
        body: JSON.stringify({ status: 'lost' })
      }).catch(function () {});
    }
  } catch (e) { /* el trato no bloquea el descarte */ }
  await A.nota(c.id, 'DESCARTADO · ' + new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) + '\n' + motivo).catch(function () {});
  try {
    await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
      accion: 'Descartado tras tres intentos sin respuesta', texto: motivo, origen: 'Reenganche' });
  } catch (e) { /* no bloquea */ }
}

// Una vuelta del reloj. Devuelve { mirados, enviados, descartados, detalle }.
// opciones.seco: no envía ni etiqueta, solo dice qué haría.
async function vuelta(opciones) {
  opciones = opciones || {};
  const seco = !!opciones.seco;
  const resumen = { mirados: 0, candidatos: 0, enviados: 0, descartados: 0, detalle: [] };
  const t = A.ahoraMadrid();
  if (!seco && !enVentanaReenganche(t)) { resumen.esperando = 'fuera de ventana'; return resumen; }
  if (!process.env.ANTHROPIC_API_KEY) { resumen.esperando = 'sin_modelo'; return resumen; }

  let lista;
  try { lista = await A.buscarPorEtiqueta('act-respondio', 300); } catch (e) { resumen.error = 'crm'; return resumen; }
  const AGENTE = require('./_agente.js');
  const ahora = Date.now();

  for (const c of lista) {
    resumen.mirados++;
    if (!A.tiene(c, 'paid')) continue;                       // el agente solo escribe a leads del sistema
    if (A.tiene(c, 'act-descartado') || A.tiene(c, 'act-baja')) continue;
    if (A.tiene(c, 'wa-humano') || A.tiene(c, 'wa-agente-off')) continue;
    if (A.tiene(c, 'act-agendado') || A.tiene(c, 'act-cita-confirmada')) continue;
    if (c.dnd === true) continue;
    // Regla de Maikel (22-sep): tratos en Negociación, Oferta, Piloto o Cliente, nunca sin su aprobación.
    const opN = await require('./_tratos.js').abierto(c.id).catch(function () { return null; });
    if (opN) { const T2 = require('./_tratos.js'); const et = Object.keys(T2.ETAPAS).find(function (k) { return T2.ETAPAS[k] === opN.pipelineStageId; }); if (['seguimiento', 'oferta', 'piloto', 'cliente'].indexOf(et) > -1) continue; }
    const n = intentosHechos(c);

    // Filtro barato antes de leer el hilo entero: la conversación de GHL ya
    // dice de quién es el último mensaje y de cuándo.
    const cabeza = await ultimaConversacion(c.id);
    if (!cabeza) continue;
    if (cabeza.direccion !== 'outbound') continue;
    if ((ahora - cabeza.fecha) / 86400000 < (n >= 3 ? DIAS_DESCARTE : DIAS[n])) continue;

    let mensajes;
    try { mensajes = await A.mensajesDe(c.id); } catch (e) { continue; }
    const wa = mensajes.filter(function (m) { return A.esWhatsApp(m) && String(m.status || '').toLowerCase() !== 'failed' && String(m.body || '').trim(); });
    const ultimo = wa[wa.length - 1];
    if (!ultimo || String(ultimo.direction) !== 'outbound') continue;   // el último es suyo: eso lo lleva el agente al contestar
    if (!wa.some(function (m) { return String(m.direction) === 'inbound'; })) continue;
    if (ultimo.userId) continue;                                         // lo último lo escribió Maikel: su hilo
    const dias = (ahora - Date.parse(ultimo.dateAdded || 0)) / 86400000;

    if (n >= 3) {
      if (dias >= DIAS_DESCARTE) {
        resumen.candidatos++;
        resumen.detalle.push({ contacto: c.id, nombre: c.contactName || c.firstName || '', accion: 'descartar', dias: Math.round(dias) });
        if (!seco) await descartar(c, 'Tres reenganches sin respuesta; el último hace ' + Math.round(dias) + ' días.');
        resumen.descartados++;
      }
      continue;
    }
    if (dias < DIAS[n]) continue;
    if (await A.tieneCitaGHL(c.id)) continue;

    resumen.candidatos++;
    const fila = { contacto: c.id, nombre: c.contactName || c.firstName || '', accion: 'intento ' + (n + 1), dias: Math.round(dias) };
    try {
      const d = await AGENTE.reenganchar({ contacto: c, mensajes: mensajes, intento: n + 1, dias: Math.round(dias) });
      fila.texto = d.texto || '';
      fila.motivo = d.motivo || '';
      if (!d.texto) { resumen.detalle.push(fila); continue; }
      if (seco) { resumen.detalle.push(fila); resumen.enviados++; break; }
      const env = await A.enviarMensaje(c.id, d.texto);
      fila.canal = env.canal;
      await A.etiquetar(c.id, [ETIQUETAS[n]]);
      await A.nota(c.id, 'REENGANCHE ' + (n + 1) + ' de 3 · ' + new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) +
        '\nLlevaba ' + Math.round(dias) + ' días sin contestar.\nYo: «' + d.texto + '»' + (env.canal ? '\nPor: ' + env.canal : '')).catch(function () {});
      try {
        await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
          accion: 'Reenganche ' + (n + 1) + ' de 3 (llevaba ' + Math.round(dias) + ' días callado)', texto: d.texto, origen: 'Agente de WhatsApp' });
      } catch (e) { /* no bloquea */ }
      resumen.enviados++;
      resumen.detalle.push(fila);
      break;                                                             // uno por vuelta
    } catch (err) {
      fila.error = String((err && err.message) || err).slice(0, 120);
      resumen.detalle.push(fila);
    }
  }
  return resumen;
}

module.exports = { vuelta: vuelta, enVentanaReenganche: enVentanaReenganche, DIAS: DIAS, DIAS_DESCARTE: DIAS_DESCARTE };
