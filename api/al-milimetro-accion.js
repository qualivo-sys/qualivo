// Al Milímetro: los botones de los correos.
//   Sonia (aviso y resumen diario): contesto · visita · presupuesto · firmado · perdido
//   El lead (pie de cada correo):   baja
//
//   GET  /api/al-milimetro-accion?l=<lead>&a=<acción>&f=<firma>  → página con un botón de confirmar
//   POST (mismo enlace)                                           → aplica la acción
// El GET no cambia nada: los antivirus del correo abren los enlaces solos. La firma (AM_LINK_SECRET)
// impide inventarse enlaces. Cada acción para los envíos que ya no tocan.

const DB = require('./_am-db.js');
const C = require('./_am-correo.js');
const M = require('./_am-modelo.js');
const DIA = 864e5;

const ACCIONES = {
  contesto: { txt: 'Marcar que ha contestado', hecho: 'Hecho: ya no le saldrán los recordatorios de «sin respuesta».' },
  visita: { txt: 'Marcar visita técnica agendada', hecho: 'Hecho: pasa a «Visita técnica» y se paran los seguimientos de antes de la visita.' },
  presupuesto: { txt: 'Marcar presupuesto enviado', hecho: 'Hecho: tendrás los recordatorios de WhatsApp a los 2, 7, 14 y 21 días en tu resumen diario.' },
  mas_adelante: { txt: 'Marcar «más adelante»', hecho: 'Hecho: ya no le saldrán WhatsApp de seguimiento; sigue recibiendo los correos.' },
  parar: { txt: 'Parar todo lo automático con este contacto', hecho: 'Hecho: no le saldrá nada más, ni correos ni WhatsApp.' },
  firmado: { txt: 'Marcar obra firmada', hecho: '¡Enhorabuena! Pasa a «Firmado» y se para todo lo automático.' },
  perdido: { txt: 'Marcar como perdido', hecho: 'Hecho: pasa a «Perdido» y se para todo lo automático.' },
  baja: { txt: 'No quiero recibir más correos', hecho: 'Hecho. No vas a recibir más correos de Al Milímetro.' }
};

function pagina(res, codigo, titulo, cuerpo) {
  res.statusCode = codigo;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store');
  res.end('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Al Milímetro</title></head>' +
    '<body style="margin:0;background:#F5F4E7;color:#252525;font:17px/1.6 Georgia,serif"><main style="max-width:480px;margin:0 auto;padding:48px 20px">' +
    '<p style="font:700 13px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#C94A0A">Al Milímetro</p><h1 style="font-size:28px;line-height:1.15">' + C.esc(titulo) + '</h1>' + cuerpo + '</main></body></html>');
}

module.exports = async function handler(req, res) {
  const q = req.query || {};
  const id = String(q.l || ''), a = String(q.a || ''), f = String(q.f || '');
  if (!ACCIONES[a] || !/^[0-9a-f-]{36}$/.test(id) || !C.firmaValida(id, a, f)) return pagina(res, 400, 'Este enlace no es válido', '<p>Puede que esté incompleto. Si te ha llegado por correo, ábrelo desde el correo original.</p>');
  if (!DB.configurada()) return pagina(res, 503, 'Ahora mismo no está disponible', '<p>Prueba otra vez en unos minutos.</p>');
  await DB.asegurar();
  const filas = await DB.sql('SELECT row_to_json(l.*) AS j FROM am_leads l WHERE id = $1', [id]);
  if (!filas.length) return pagina(res, 404, 'No encuentro este contacto', '<p>Puede que se haya borrado.</p>');
  const L = M.vista(filas[0]);

  if (req.method !== 'POST') {
    const quien = a === 'baja' ? '' : '<p>' + C.esc(L.nombre) + ' · ' + C.esc(L.tipoLargo) + (L.mun ? ' en ' + C.esc(L.mun) : '') + ' · ahora en «' + C.esc(L.etapa) + '».</p>';
    const extra = a === 'visita' ? '<p><label for="cita">Fecha y hora de la visita (para el recordatorio por WhatsApp)</label><br><input id="cita" name="cita" type="datetime-local" style="width:100%;padding:10px;font:16px Arial;border:2px solid #252525;border-radius:10px"></p>'
      : a === 'perdido' ? '<p><label for="motivo">Motivo (opcional)</label><br><input id="motivo" name="motivo" style="width:100%;padding:10px;font:16px Arial;border:2px solid #252525;border-radius:10px"></p>' : '';
    return pagina(res, 200, ACCIONES[a].txt, quien + '<form method="post">' + extra +
      '<button type="submit" style="padding:14px 22px;border:2px solid #252525;border-radius:12px;background:#FDC023;font:700 16px Arial,sans-serif;box-shadow:4px 4px 0 #252525;cursor:pointer">' + C.esc(ACCIONES[a].txt) + '</button></form>');
  }

  const cuerpo = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : (req.body || {});
  const ahora = new Date().toISOString();
  const cancelar = function (pasos) { return DB.sql("UPDATE am_envios SET estado = 'cancelado', hecho = now(), detalle = $2 WHERE lead_id = $1 AND estado = 'pendiente' AND paso = ANY($3)", [id, 'parada: ' + a, pasos]); };
  const ANTES = ['W5', 'W6', 'E2', 'E3', 'E4'], DESPUES = ['W9', 'W10', 'W11', 'W12'], TODO = ANTES.concat(DESPUES, ['W8']);
  let tras = '';
  if (a === 'baja') {
    await DB.sql('UPDATE am_leads SET baja = true WHERE id = $1', [id]);
    await DB.sql("UPDATE am_envios SET estado = 'cancelado', hecho = now(), detalle = 'baja' WHERE lead_id = $1 AND estado = 'pendiente' AND canal = 'email'", [id]);
  } else if (a === 'contesto') {
    await DB.sql("UPDATE am_leads SET contesto = true, etapa = CASE WHEN etapa = 'nuevo' THEN 'contactado' ELSE etapa END, etapa_cambio = CASE WHEN etapa = 'nuevo' THEN now() ELSE etapa_cambio END WHERE id = $1", [id]);
    await cancelar(['W5', 'W6']);
  } else if (a === 'visita') {
    await DB.sql("UPDATE am_leads SET etapa = 'visita', etapa_cambio = now(), contesto = true WHERE id = $1", [id]);
    await cancelar(ANTES);
    // Con fecha y hora: confirmación W7 aquí mismo y recordatorio W8 al resumen del último día de trabajo antes
    const cita = String(cuerpo.cita || '');
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cita)) {
      const H = require('./_horario.js');
      const [fecha, hm] = cita.split('T'), [hh, mm] = hm.split(':').map(Number);
      const citaMs = H.msDeMadrid(fecha, hh * 60 + mm);
      await DB.sql('UPDATE am_leads SET cita = $2 WHERE id = $1', [id, new Date(citaMs).toISOString()]);
      L.cita = new Date(citaMs).toISOString();
      await DB.sql("INSERT INTO am_envios (lead_id, paso, canal, programado, estado, hecho) VALUES ($1,'W7','wa',now(),'avisado',now()) ON CONFLICT (lead_id, paso) DO UPDATE SET programado = now(), estado = 'avisado', hecho = now()", [id]);
      const w8 = C.vispera(citaMs, Date.now());
      if (w8) await DB.sql("INSERT INTO am_envios (lead_id, paso, canal, programado) VALUES ($1,'W8','wa',$2) ON CONFLICT (lead_id, paso) DO UPDATE SET programado = EXCLUDED.programado, estado = 'pendiente', hecho = NULL, detalle = NULL", [id, new Date(w8).toISOString()]);
      else await cancelar(['W8']);
      tras = '<p>Confírmasela ahora por WhatsApp:</p><p><a href="' + C.esc(C.waMe(L.telefono, C.WA.W7(L))) + '" style="display:inline-block;padding:12px 18px;border:2px solid #252525;border-radius:12px;background:#FDC023;color:#252525;font:700 16px Arial,sans-serif;text-decoration:none">Abrir WhatsApp con la confirmación</a></p>' +
        (w8 ? '<p>El recordatorio te saldrá en el resumen del ' + C.esc(new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric' }).format(new Date(w8))) + '.</p>' : '<p>La visita es demasiado pronto para un recordatorio aparte.</p>');
    }
  } else if (a === 'mas_adelante') {
    // Pasa a C: fuera los WhatsApp de seguimiento; los correos siguen (E4 pregunta justo eso)
    await DB.sql("UPDATE am_leads SET clase = 'C' WHERE id = $1", [id]);
    await cancelar(['W5', 'W6']);
  } else if (a === 'parar') {
    await DB.sql("UPDATE am_leads SET etapa = 'parado', etapa_cambio = now() WHERE id = $1", [id]);
    await DB.sql("UPDATE am_envios SET estado = 'cancelado', hecho = now(), detalle = 'parada: parar' WHERE lead_id = $1 AND estado = 'pendiente'", [id]);
  } else if (a === 'presupuesto') {
    await DB.sql("UPDATE am_leads SET etapa = 'presupuesto', etapa_cambio = now(), contesto = true WHERE id = $1", [id]);
    await cancelar(ANTES);
    for (const [paso, dias] of [['W9', 2], ['W10', 7], ['W11', 14], ['W12', 21]]) {
      await DB.sql("INSERT INTO am_envios (lead_id, paso, canal, programado) VALUES ($1,$2,'wa',$3) ON CONFLICT (lead_id, paso) DO UPDATE SET programado = EXCLUDED.programado, estado = 'pendiente', hecho = NULL", [id, paso, new Date(Date.now() + dias * DIA).toISOString()]);
    }
  } else if (a === 'firmado' || a === 'perdido') {
    await DB.sql('UPDATE am_leads SET etapa = $2, etapa_cambio = now(), motivo_perdido = $3 WHERE id = $1', [id, a, a === 'perdido' ? String(cuerpo.motivo || '').slice(0, 200) || null : null]);
    await cancelar(TODO);
  }
  await DB.evento(id, 'accion', { accion: a, t: ahora });
  return pagina(res, 200, ACCIONES[a].hecho.split(':')[0].replace(/\.$/, ''), '<p>' + C.esc(ACCIONES[a].hecho) + '</p>' + tras);
};
