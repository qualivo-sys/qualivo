// Al Milímetro: tarea programada (vercel.json → cada 10 minutos).
//   1. Envía los correos pendientes: E1 y avisos a cualquier hora (reintentos); E2-E4 solo dentro del horario
//      de Sonia (lunes a jueves 9-19 · viernes 9-15, hora de Madrid). Antes de cada envío comprueba las paradas.
//   2. De lunes a viernes, en la primera vuelta a partir de las 9:00: resumen diario a Sonia con los contactos A
//      sin contactar y los WhatsApp de seguimiento que tocan hoy (botón wa.me con el mensaje ya escrito).
// Vercel llama con «Authorization: Bearer CRON_SECRET».

const DB = require('./_am-db.js');
const C = require('./_am-correo.js');
const M = require('./_am-modelo.js');
const MAX = 40;
const ANTES_VISITA = ['nuevo', 'contactado'];

function parada(e, L, ahora) {
  if (L.etapa === 'firmado' || L.etapa === 'perdido' || L.etapa === 'parado') return 'cerrado';
  if (e.paso === 'W8' && (L.etapa !== 'visita' || (ahora && L.cita && Date.parse(L.cita) <= ahora.getTime()))) return 'la visita ya no está pendiente';
  if (e.canal === 'email' && L.baja) return 'baja';
  if (/^(E2|E3|E4)$/.test(e.paso) && (L.contesto || ANTES_VISITA.indexOf(L.etapa) < 0)) return 'ha contestado o avanza';
  if (/^(W5|W6)$/.test(e.paso) && (L.contesto || ANTES_VISITA.indexOf(L.etapa) < 0)) return 'ha contestado o avanza';
  if (/^W(9|1[0-2])$/.test(e.paso) && L.etapa !== 'presupuesto') return 'ya no está en presupuesto';
  return null;
}

// Caducidad: si el cron estuvo parado (o Sonia no abrió el resumen) y a un lead le tocan a la vez
// varios pasos de la misma secuencia, sale solo el último y los anteriores se cancelan. Así no le
// llegan E2 y E3 juntos. No se mide en horas: lo del fin de semana espera al lunes y es correcto.
const SECUENCIA = { E2: 'correo', E3: 'correo', E4: 'correo', W5: 'sin_respuesta', W6: 'sin_respuesta', W9: 'presupuesto', W10: 'presupuesto', W11: 'presupuesto', W12: 'presupuesto' };
const ORDEN = ['E2', 'E3', 'E4', 'W5', 'W6', 'W9', 'W10', 'W11', 'W12'];
function sustituidos(envios) {
  const ultimo = {};
  envios.forEach(function (e) {
    const s = SECUENCIA[e.paso]; if (!s) return;
    const k = e.lead_id + '|' + s;
    if (!ultimo[k] || ORDEN.indexOf(e.paso) > ORDEN.indexOf(ultimo[k])) ultimo[k] = e.paso;
  });
  const fuera = {};
  envios.forEach(function (e) {
    const s = SECUENCIA[e.paso];
    if (s && ultimo[e.lead_id + '|' + s] !== e.paso) fuera[e.id] = ultimo[e.lead_id + '|' + s];
  });
  return fuera;
}

async function vuelta(ahora) {
  await DB.asegurar();
  const informe = { enviados: 0, cancelados: 0, errores: 0, resumen: false };
  const horario = C.enHorario(ahora);
  const soloPrueba = process.env.AM_SOLO_PRUEBA === '1';

  // 1. Correos
  const pend = await DB.sql(
    `SELECT json_build_object('e', row_to_json(e.*), 'l', row_to_json(l.*)) AS j FROM am_envios e JOIN am_leads l ON l.id = e.lead_id
     WHERE e.estado = 'pendiente' AND e.canal = 'email' AND e.programado <= $1 AND ($2 OR e.paso IN ('E1','AVISO'))
       AND (NOT $3 OR l.prueba) ORDER BY e.programado LIMIT ${MAX}`, [ahora.toISOString(), horario, soloPrueba]);
  const viejos = sustituidos(pend.map(function (x) { return x.e; }));
  for (const x of pend) {
    const e = x.e, L = M.vista(x.l);
    const motivo = parada(e, L, ahora) || (viejos[e.id] ? 'caducado: lo sustituye ' + viejos[e.id] : null);
    if (motivo) { await DB.sql("UPDATE am_envios SET estado = 'cancelado', hecho = now(), detalle = $2 WHERE id = $1", [e.id, 'parada: ' + motivo]); informe.cancelados++; continue; }
    try {
      if (e.paso === 'AVISO') { if (!process.env.AM_AVISO_TO) throw new Error('Falta AM_AVISO_TO'); const c = C.avisoNuevo(L); await C.enviar(process.env.AM_AVISO_TO, c.asunto, c.html); }
      else { if (!L.email) throw new Error('sin email'); const c = C.CORREOS[e.paso](L); await C.enviar(L.email, c.asunto, c.html, { responder: process.env.AM_AVISO_TO, baja: C.enlaceAccion(L.id, 'baja') }); }
      await DB.sql("UPDATE am_envios SET estado = 'enviado', hecho = now(), detalle = NULL WHERE id = $1", [e.id]);
      informe.enviados++;
    } catch (err) {
      // Tres intentos como mucho; después queda en «error» para revisarlo a mano
      const intentos = (String(e.detalle || '').match(/^intento (\d)/) || [0, 0])[1] * 1 + 1;
      await DB.sql('UPDATE am_envios SET estado = $2, detalle = $3 WHERE id = $1', [e.id, intentos >= 3 ? 'error' : 'pendiente', 'intento ' + intentos + ': ' + err.message.slice(0, 250)]);
      informe.errores++;
    }
  }

  // 2. Resumen diario de Sonia
  const m = C.madrid(ahora);
  if (m.dia <= 5 && m.h >= 9 && process.env.AM_AVISO_TO) {
    const ya = await DB.sql("SELECT row_to_json(x.*) AS j FROM (SELECT id FROM am_eventos WHERE tipo = 'resumen' AND detalle->>'fecha' = $1 LIMIT 1) x", [m.fecha]);
    if (!ya.length) {
      const leads = (await DB.sql("SELECT row_to_json(l.*) AS j FROM am_leads l WHERE (NOT $1 OR prueba) AND etapa NOT IN ('firmado','perdido','parado')", [soloPrueba])).map(M.vista);
      const porId = {}; leads.forEach(function (L) { porId[L.id] = L; });
      const recientes = leads.filter(function (L) { return ahora - Date.parse(L.creado) < 864e5; });
      const fin = new Date(ahora.getTime() + 12 * 3600e3).toISOString();
      const wa = (await DB.sql("SELECT row_to_json(e.*) AS j FROM am_envios e WHERE estado = 'pendiente' AND canal = 'wa' AND programado <= $1", [fin]))
        .filter(function (e) { return porId[e.lead_id]; });
      const whatsapp = [];
      const waViejos = sustituidos(wa);
      for (const e of wa) {
        const L = porId[e.lead_id], motivo = parada(e, L, ahora) || (waViejos[e.id] ? 'caducado: lo sustituye ' + waViejos[e.id] : null);
        if (motivo) { await DB.sql("UPDATE am_envios SET estado = 'cancelado', hecho = now(), detalle = $2 WHERE id = $1", [e.id, 'parada: ' + motivo]); continue; }
        whatsapp.push({ L: L, paso: e.paso, id: e.id });
      }
      const datos = {
        fecha: m.fecha.split('-').reverse().join('/'), prueba: soloPrueba,
        ayer: { total: recientes.length, A: recientes.filter(function (L) { return L.clase === 'A'; }).length, B: recientes.filter(function (L) { return L.clase === 'B'; }).length, C: recientes.filter(function (L) { return L.clase === 'C'; }).length },
        sinContactar: leads.filter(function (L) { return L.clase === 'A' && L.etapa === 'nuevo' && !L.contesto; }),
        whatsapp: whatsapp
      };
      const c = C.resumen(datos);
      await C.enviar(process.env.AM_AVISO_TO, c.asunto, c.html);
      for (const w of whatsapp) await DB.sql("UPDATE am_envios SET estado = 'avisado', hecho = now() WHERE id = $1", [w.id]);
      await DB.evento(null, 'resumen', { fecha: m.fecha, whatsapp: whatsapp.length, sinContactar: datos.sinContactar.length });
      informe.resumen = true;
    }
  }
  return informe;
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (!DB.configurada()) return res.status(200).json({ ok: true, sin_bd: true });
  try {
    const informe = await vuelta(new Date());
    return res.status(200).json(Object.assign({ ok: true }, informe));
  } catch (err) {
    console.error('[am-cron]', err.message);
    return res.status(500).json({ ok: false, error: err.message.slice(0, 200) });
  }
};
module.exports.vuelta = vuelta;
