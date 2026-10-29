// Al Milímetro: el reloj de las secuencias. Vercel Cron cada 10 minutos.
//
//   GET /api/al-milimetro-cron   (Authorization: Bearer CRON_SECRET, como el resto de crons)
//
// En cada vuelta, para cada lead activo, pregunta a api/_am-flujos.js qué toca ya y:
//   E1-E4     → email al lead por Resend, con enlace de baja firmado.
//   W*        → email a Sonia con el texto ya escrito y el botón wa.me (lo envía ella desde su
//               móvil) y los botones «Ha contestado» / «Parar».
//   AVISO_A   → email a Sonia: contacto A nuevo, con su ficha y el botón wa.me del primer mensaje.
//   LLAMAR_A  → email a Sonia: lleva 2 h sin contestar, llámale hoy.
//   PERDIDO   → email a Sonia: márcalo como ganado o perdido.
// Antes de enviar, reserva el paso en la base de datos (índice único): dos vueltas
// solapadas no mandan lo mismo dos veces. Si el envío falla, suelta la reserva.
//
// Variables (Vercel; nunca en el repo):
//   CRON_SECRET          el de todos los crons; firma también los enlaces de Sonia y de baja
//   AM_DATABASE_URL      ver api/_am-db.js
//   RESEND_API_KEY       el de todo qualivo.io
//   AM_FROM              remite de Sonia, p. ej. «Sonia · Al Milímetro <sonia@almilimetroreformas.com>».
//                        Sin él no sale ningún email al lead (el dominio tiene que estar verificado en Resend).
//   AM_REPLY_TO          (opcional) a dónde llegan las respuestas de los leads
//   AM_SONIA_EMAIL       a quién van las tareas y los avisos. MIENTRAS SE PRUEBA, un email interno de Qualivo.
//   AM_AVISOS_FROM       (opcional) remite de las tareas; por defecto, AM_FROM
//   AM_SOLO_PRUEBA       todo lo que no sea «0» = solo leads de prueba. Por defecto, solo prueba.
//   AM_PAUSA             «1» = la vuelta no hace nada
//   AM_WHATSAPP_NEGOCIO  (opcional) número que se cita en E1

const crypto = require('crypto');
const F = require('./_am-flujos.js');
const T = require('./_am-textos.js');
const DB = require('./_am-db.js');

const BASE = 'https://qualivo.io';

function firma(leadId, accion) {
  return crypto.createHmac('sha256', process.env.CRON_SECRET || '').update(leadId + '|' + accion).digest('hex').slice(0, 24);
}
function enlace(leadId, accion) {
  return BASE + '/api/al-milimetro-marca?l=' + encodeURIComponent(leadId) + '&a=' + accion + '&t=' + firma(leadId, accion);
}

async function resend(correo) {
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'sin_resend' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(correo)
  });
  return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status };
}

function ficha(lead) {
  const r = lead.respuestas || {};
  const v = T.vars(lead);
  return [`<b>${T.esc(lead.nombre)}</b> · clase ${T.esc(lead.clase)}${lead.revision ? ' (revisión)' : ''}`,
    `${T.esc(v.tipo)} en ${T.esc(v.zona)}${v.m2 ? ', ' + T.esc(v.m2) + ' m²' : ''}${v.cuando ? ', quiere empezar ' + T.esc(v.cuando) : ''}`,
    `Tel. ${T.esc(lead.telefono)}${lead.email ? ' · ' + T.esc(lead.email) : ''}`,
    r.frase ? `Lo que contó: «${T.esc(r.frase)}»` : ''].filter(Boolean).join('<br>');
}

function botonesMarca(lead) {
  return T.boton(enlace(lead.id, 'respondio'), 'Ha contestado', '#0E7C74') +
    T.boton(enlace(lead.id, 'visita'), 'Ha reservado visita', '#0E7C74') +
    T.boton(enlace(lead.id, 'presupuesto'), 'Presupuesto enviado', '#0E7C74') +
    T.boton(enlace(lead.id, 'mas_adelante'), 'Más adelante', '#8a8a8a') +
    T.boton(enlace(lead.id, 'stop'), 'Parar con este contacto', '#8a8a8a');
}

// Construye el email de un paso. Devuelve null si no se puede (falta un dato).
function correoDe(paso, lead) {
  const v = T.vars(lead);
  const sonia = process.env.AM_SONIA_EMAIL;
  const deAvisos = process.env.AM_AVISOS_FROM || process.env.AM_FROM;
  const prefijo = lead.prueba ? '[PRUEBA] ' : '';

  if (paso.canal === 'email') {
    if (!lead.email || !process.env.AM_FROM) return null;
    const e = T.EMAIL[paso.clave](v);
    const pie = 'Si no quieres recibir más correos, <a href="' + enlace(lead.id, 'baja') + '">pulsa aquí</a>.';
    const c = { from: process.env.AM_FROM, to: [lead.email], subject: prefijo + e.asunto, html: T.htmlEmail(e.cuerpo, pie) };
    if (process.env.AM_REPLY_TO) c.reply_to = process.env.AM_REPLY_TO;
    return c;
  }
  if (!sonia || !deAvisos) return null;
  let asunto, cuerpo;
  if (paso.canal === 'wa' || paso.clave === 'AVISO_A') {
    const clave = paso.clave === 'AVISO_A' ? 'W1' : paso.clave;
    const texto = T.WA[clave](v);
    asunto = paso.clave === 'AVISO_A'
      ? `Nuevo contacto A: ${lead.nombre}, ${v.tipo} en ${v.zona}. Escríbele hoy`
      : `WhatsApp para ${lead.nombre}: ${T.TAREA[clave]}`;
    cuerpo = [ficha(lead), 'Texto (puedes cambiarlo antes de enviar):', `<i>${T.esc(texto)}</i>`,
      T.boton(F.waEnlace(lead.telefono, texto), 'Abrir WhatsApp con el texto'), botonesMarca(lead)];
  } else if (paso.clave === 'LLAMAR_A') {
    asunto = `${lead.nombre} (A) lleva 2 h sin contestar. Llámale hoy`;
    cuerpo = [ficha(lead), T.boton('tel:' + String(lead.telefono || '').replace(/\s/g, ''), 'Llamar', '#0E7C74'), botonesMarca(lead)];
  } else if (paso.clave === 'PERDIDO') {
    asunto = `${lead.nombre}: 3 semanas desde el presupuesto. ¿Ganado o perdido?`;
    cuerpo = [ficha(lead), T.boton(enlace(lead.id, 'ganado'), 'Ganado', '#0E7C74') + T.boton(enlace(lead.id, 'perdido'), 'Perdido', '#8a8a8a')];
  } else return null;
  return { from: deAvisos, to: [sonia], subject: prefijo + asunto, html: T.htmlEmail(cuerpo) };
}

// Una vuelta. deps permite probarla sin red: { leads, reservar, soltar, enviar, ahora }.
async function vuelta(deps) {
  const d = Object.assign({ ahora: Date.now(), enviar: resend }, deps);
  const resumen = { leads: 0, enviados: 0, caducados: 0, sin_datos: 0, ocupados: 0, errores: 0, pasos: [] };
  const leads = await d.leads();
  resumen.leads = leads.length;
  for (const lead of leads) {
    for (const paso of F.debidos(lead, d.ahora)) {
      const etiqueta = lead.id + ':' + paso.clave;
      if (paso.caducado) {
        if (await d.reservar(lead.id, paso.clave, { caducado: true })) resumen.caducados++;
        continue;
      }
      const correo = correoDe(paso, lead);
      if (!correo) { resumen.sin_datos++; resumen.pasos.push(etiqueta + ' sin_datos'); continue; }
      if (!(await d.reservar(lead.id, paso.clave, { canal: paso.canal }))) { resumen.ocupados++; continue; }
      let r;
      try { r = await d.enviar(correo); } catch (e) { r = { ok: false, motivo: String(e.message || e).slice(0, 80) }; }
      if (r.ok) { resumen.enviados++; resumen.pasos.push(etiqueta); }
      else { resumen.errores++; resumen.pasos.push(etiqueta + ' ' + r.motivo); await d.soltar(lead.id, paso.clave); }
    }
  }
  return resumen;
}

async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (process.env.AM_PAUSA === '1') return res.status(200).json({ ok: true, pausa: true });
  const soloPrueba = process.env.AM_SOLO_PRUEBA !== '0';
  try {
    const resumen = await vuelta({
      leads: () => DB.leadsActivos(soloPrueba),
      reservar: (id, clave, datos) => DB.reservar(id, clave, datos),
      soltar: (id, clave) => DB.soltar(id, clave)
    });
    if (resumen.errores || resumen.sin_datos) console.error('[al-milimetro-cron]', JSON.stringify(resumen));
    return res.status(200).json(Object.assign({ ok: true, solo_prueba: soloPrueba }, resumen));
  } catch (e) {
    console.error('[al-milimetro-cron] falló:', e.message);
    return res.status(502).json({ ok: false, error: 'db_error' });
  }
}

module.exports = handler;
module.exports.vuelta = vuelta;
module.exports.correoDe = correoDe;
module.exports.firma = firma;
