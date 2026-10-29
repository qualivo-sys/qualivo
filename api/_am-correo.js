// Al Milímetro: horario de Sonia, enlaces firmados, envío con Resend y los textos de los correos.
// Los textos salen de propuestas-wip/sistema/mensajes.md (rama claude/al-milimetro-landing).
//
// Variables: RESEND_API_KEY · AM_EMAIL_FROM («Sonia · Al Milímetro <…@dominio verificado>»)
//            AM_AVISO_TO (correo donde Sonia recibe los avisos; en pruebas, uno interno de Qualivo)
//            AM_LINK_SECRET (firma de los enlaces de acción y de baja) · AM_BASE_URL (https://qualivo.io)

const crypto = require('crypto');

// ---------- Horario: lunes a jueves 9-19 · viernes 9-15 · hora de Madrid [C] ----------
function madrid(d) {
  const p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(d || new Date()).forEach(function (x) { p[x.type] = x.value; });
  const dias = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return { dia: dias[p.weekday], h: Number(p.hour) % 24 + Number(p.minute) / 60, fecha: p.year + '-' + p.month + '-' + p.day };
}
function enHorario(d) {
  const m = madrid(d);
  if (m.dia >= 1 && m.dia <= 4) return m.h >= 9 && m.h < 19;
  if (m.dia === 5) return m.h >= 9 && m.h < 15;
  return false;
}
// «mañana por la mañana» o «el lunes por la mañana» (W2)
function cuandoEscribo(d) {
  const m = madrid(d);
  if (m.dia >= 1 && m.dia <= 4 && m.h < 9) return 'esta mañana';
  if (m.dia >= 1 && m.dia <= 3) return 'mañana por la mañana';
  if (m.dia === 4) return m.h < 19 ? 'mañana por la mañana' : 'mañana viernes por la mañana';
  return 'el lunes por la mañana';
}

// ---------- Enlaces firmados (acciones de Sonia y baja del lead) ----------
function firma(txt) {
  const s = process.env.AM_LINK_SECRET;
  if (!s) throw new Error('Falta AM_LINK_SECRET');
  return crypto.createHmac('sha256', s).update(String(txt)).digest('hex').slice(0, 32);
}
function base() { return (process.env.AM_BASE_URL || 'https://qualivo.io').replace(/\/$/, ''); }
function enlaceAccion(leadId, accion) { return base() + '/api/al-milimetro-accion?l=' + leadId + '&a=' + accion + '&f=' + firma(leadId + '|' + accion); }
function firmaValida(leadId, accion, f) {
  try { const x = Buffer.from(firma(leadId + '|' + accion)), y = Buffer.from(String(f || '')); return x.length === y.length && crypto.timingSafeEqual(x, y); } catch (e) { return false; }
}
function waMe(telefono, texto) { return 'https://wa.me/' + String(telefono).replace(/\D/g, '') + '?text=' + encodeURIComponent(texto); }

// ---------- Visita: recordatorio W8 ----------
// A la apertura (9:00) del último día de trabajo de Sonia antes de la cita: cita el lunes → viernes,
// cita tras un festivo → el día laborable anterior. Si ese momento ya pasó cuando se agenda, no hay
// recordatorio: la confirmación (W7) sale en el momento y basta.
const H = require('./_horario.js');
function vispera(citaMs, desdeMs) {
  const dia = H.madrid(citaMs).fecha;
  const [y, mo, d] = dia.split('-').map(Number);
  for (let k = 1; k <= 7; k++) {
    const f = new Date(Date.UTC(y, mo - 1, d - k)).toISOString().slice(0, 10);
    const nueve = H.msDeMadrid(f, 9 * 60);
    const m = madrid(new Date(nueve));
    if (m.dia > 5 || H.esFestivo(nueve)) continue;
    return nueve >= desdeMs ? nueve : null;
  }
  return null;
}
// «jueves 5 a las 10:00» en hora de Madrid
function citaTexto(cita) {
  const d = new Date(cita);
  const dia = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric' }).format(d);
  return dia + ' a las ' + new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(d);
}

// ---------- Envío ----------
async function enviar(para, asunto, html, opciones) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Falta RESEND_API_KEY');
  const cuerpo = { from: process.env.AM_EMAIL_FROM || 'Sonia · Al Milímetro <onboarding@resend.dev>', to: para, subject: asunto, html: html };
  if (opciones && opciones.responder) cuerpo.reply_to = opciones.responder;
  if (opciones && opciones.baja) cuerpo.headers = { 'List-Unsubscribe': '<' + opciones.baja + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' };
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
  const t = await r.text();
  if (!r.ok) throw new Error('Resend ' + r.status + ' ' + t.slice(0, 200));
  return t ? JSON.parse(t) : {};
}

// ---------- Plantilla común ----------
const esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
function marco(cuerpo, pie) {
  return '<div style="font-family:Georgia,\'Times New Roman\',serif;max-width:560px;margin:0 auto;color:#252525;font-size:16px;line-height:1.6">' + cuerpo +
    '<p style="margin-top:28px;font-family:Arial,sans-serif;font-size:13px;color:#6A665E">' + (pie || '') + '</p></div>';
}
const firmaSonia = '<p>Sonia · Al Milímetro<br><span style="color:#C94A0A">Tu reforma, sin agobios</span></p>';
function pieLead(leadId) { return 'Te escribo porque pediste presupuesto en la página de Al Milímetro. <a href="' + enlaceAccion(leadId, 'baja') + '" style="color:#6A665E">No quiero recibir más correos</a>.'; }
const p = function (t) { return '<p>' + t + '</p>'; };

// ---------- Correos al lead (E1-E4) ----------
const CORREOS = {
  E1: function (L) {
    return { asunto: 'Lo que pasa ahora con tu reforma', html: marco(
      p('Hola ' + esc(L.nombre) + ':') +
      p('Gracias por contarme tu proyecto. Te explico cómo trabajo para que sepas qué esperar.') +
      p('Primero voy a ver tu casa, mido y escucho lo que quieres. Reviso también lo que no se ve (instalaciones, bajantes, suelo), que es lo que suele disparar una reforma a mitad de obra.') +
      p('A los 7 días de la visita tienes el presupuesto por partidas, con materiales y plazo. Si decides seguir, coordino toda la obra: hablas solo conmigo, de la primera visita a la entrega.') +
      p('Si quieres reservar ya la visita, contesta a este correo.') + firmaSonia, pieLead(L.id)) };
  },
  E2: function (L) {
    return { asunto: 'Lo que reviso antes de darte un precio', html: marco(
      p('Hola ' + esc(L.nombre) + ':') +
      p('El presupuesto que entra bajo y luego sube casi siempre falla en lo que no se ve. Antes de darte una cifra, miro cuatro cosas:') +
      '<ul><li><b>La luz y el agua:</b> el cuadro, el cableado y las tuberías.</li><li><b>Las bajantes:</b> en pisos antiguos son la sorpresa más cara.</li><li><b>El suelo:</b> si se puede poner encima o hay que levantar.</li><li><b>Las ventanas:</b> si conviene cambiarlas, te lo digo ahora y no cuando ya está pintado.</li></ul>' +
      p('Si algo de esto hay que hacerlo, va en el presupuesto desde el principio. Así el precio no cambia a mitad de obra.') + '<p>Sonia</p>', pieLead(L.id)) };
  },
  E3: function (L) {
    return { asunto: 'Cómo comparar presupuestos sin equivocarte', html: marco(
      p('Hola ' + esc(L.nombre) + ':') +
      p('Si estás pidiendo varios presupuestos, dos con el mismo total pueden ser obras muy distintas. Yo miraría tres cosas:') +
      '<ol><li><b>Que venga por partidas.</b> Cada trabajo con su precio y su material. Un total sin desglose no se puede comparar.</li><li><b>Que tenga fechas.</b> Cuándo empieza, cuánto dura y qué pasa si se retrasa.</li><li><b>Qué pasa si algo cambia.</b> Cómo se valora un cambio en obra y si se aprueba por escrito antes de hacerlo.</li></ol>' +
      p('Aunque al final no lo hagas conmigo, con esto vas a elegir mejor.') + '<p>Sonia</p>', pieLead(L.id)) };
  },
  E4: function (L) {
    return { asunto: '¿Seguimos con tu reforma?', html: marco(
      p('Hola ' + esc(L.nombre) + ':') +
      p('Hace un par de semanas me contaste que querías reformar ' + esc(L.tipoTexto) + (L.mun ? ' en ' + esc(L.mun) : '') + '. ¿Sigue en pie la idea?') +
      p('Si te viene bien, voy a verla esta semana o la que viene y en 7 días tienes el presupuesto por partidas. Y si ahora no es el momento, no pasa nada: contéstame «más adelante» y te escribo dentro de unos meses.') + '<p>Sonia</p>', pieLead(L.id)) };
  }
};

// ---------- WhatsApp que Sonia envía desde su número (fase 1: botón wa.me) ----------
const WA = {
  W1: function (L) { return 'Hola ' + L.nombre + ', soy Sonia, arquitecta de Al Milímetro. He recibido tu petición para reformar ' + L.tipoTexto + (L.mun ? ' en ' + L.mun : '') + '. Para darte una cifra más ajustada, ¿te viene bien que hablemos 10 minutos hoy o mañana? Si me mandas un par de fotos o el plano, mejor todavía.'; },
  W3: function (L) { return 'Hola ' + L.nombre + ', soy Sonia, de Al Milímetro. Gracias por contarme tu proyecto. Para saber si te puedo ayudar bien, ¿me cuentas en una frase qué te gustaría cambiar? Si me mandas 2 o 3 fotos, mejor.'; },
  W5: function (L) { return L.nombre + ', ¿pudiste ver mi mensaje de ayer? Cuando te venga bien, lo hablamos en 10 minutos y, si encaja, voy a ver tu casa esta semana. Sin compromiso.'; },
  W6: function (L) { return '¿Sigues con la idea de reformar en los próximos meses, ' + L.nombre + '? Si ahora no es el momento, dímelo sin problema y te escribo más adelante.'; },
  // W8 dice el día y no «mañana»: con cita en lunes, el recordatorio sale el viernes
  W7: function (L) { return '¡Perfecto, ' + L.nombre + '! Nos vemos el ' + citaTexto(L.cita) + ' en ' + (L.mun ? 'tu casa de ' + L.mun : 'tu casa') + '. Si puedes, ten a mano planos o fotos de cómo está ahora y alguna idea de lo que te gusta. Cualquier cambio, me escribes por aquí.'; },
  W8: function (L) { return 'Hola ' + L.nombre + ', te recuerdo que el ' + citaTexto(L.cita) + ' paso a ver tu casa. ¿Sigue en pie?'; },
  W9: function (L) { return L.nombre + ', ¿has podido ver el presupuesto? Si quieres, lo repasamos en 10 minutos y te resuelvo cualquier duda de partidas o plazos.'; },
  W10: function (L) { return 'Si estás comparando con otros presupuestos, ' + L.nombre + ', te paso las 3 cosas que yo miraría: que venga por partidas, que tenga fechas y qué pasa si algo cambia en obra. Así comparas igual con igual.'; },
  W11: function (L) { return '¿Hay algo del presupuesto (el plazo, alguna partida, la forma de pago) que podamos ajustar para que te encaje, ' + L.nombre + '?'; },
  W12: function (L) { return L.nombre + ', no te escribo más para no agobiarte. Si más adelante retomas la idea, aquí estoy.'; }
};
const WA_TITULO = { W7: 'Confirmar la visita', W8: 'Recordatorio de la visita', W5: 'Día 1 sin respuesta', W6: 'Día 3 sin respuesta', W9: 'Presupuesto + 2 días', W10: 'Presupuesto + 7 días', W11: 'Presupuesto + 14 días', W12: 'Presupuesto + 21 días' };

// ---------- Avisos a Sonia ----------
const ACCIONES = [['contesto', 'Ha contestado'], ['visita', 'Visita agendada'], ['presupuesto', 'Presupuesto enviado'], ['firmado', 'Firmado'], ['perdido', 'Perdido'], ['parar', 'Parar todo']];
const boton = function (href, txt, fondo) { return '<a href="' + esc(href) + '" style="display:inline-block;margin:4px 6px 4px 0;padding:10px 14px;border-radius:10px;border:2px solid #252525;background:' + (fondo || '#FBFAF3') + ';color:#252525;font:700 14px Arial,sans-serif;text-decoration:none">' + esc(txt) + '</a>'; };

function avisoNuevo(L) {
  const wa = L.revision ? WA.W3(L) : WA.W1(L);
  const titulo = (L.prueba ? '[PRUEBA] ' : '') + (L.revision ? '🟡 Revisar (menos de 15.000 € o dudoso) · ' : L.clase === 'A' ? '🟢 Contacto A: llámale hoy · ' : 'Nuevo contacto ' + L.clase + ' · ') + L.nombre + ' · ' + L.tipoLargo + (L.mun ? ' en ' + L.mun : '');
  const fila = function (k, v) { return v ? '<tr><td style="padding:4px 12px 4px 0;color:#6A665E;font-family:Arial,sans-serif;font-size:14px">' + k + '</td><td style="padding:4px 0">' + esc(v) + '</td></tr>' : ''; };
  return { asunto: titulo, html: marco(
    '<p style="font:700 13px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#C94A0A">Clase ' + esc(L.clase) + ' · ' + esc(L.puntos) + ' puntos' + (L.revision ? ' · segundas preguntas' : '') + '</p>' +
    '<table style="border-collapse:collapse">' + fila('Nombre', L.nombre) + fila('Teléfono', L.telefono) + fila('Email', L.email) + fila('Obra', L.tipoLargo + (L.m2Txt ? ' · ' + L.m2Txt : '')) +
      fila('Dónde', (L.mun || '') + ' (' + L.cp + ')') + fila('Cuándo', L.cuandoTxt) + fila('Presupuesto', L.pptoTxt) + fila('Vivienda', L.propiaTxt) + fila('Qué quiere cambiar', L.frase) + fila('Anuncio', L.origenTxt) + '</table>' +
    p('<b>' + (L.revision ? 'Pregúntale qué quiere cambiar.' : L.clase === 'A' ? 'Llámale hoy.' : 'Escríbele por WhatsApp.') + '</b> Este botón abre WhatsApp con el primer mensaje ya escrito, para que salga desde tu número:') +
    boton(waMe(L.telefono, wa), 'Abrir WhatsApp con el mensaje', '#FDC023') +
    p('Cuando avance, márcalo aquí (así se paran los correos automáticos que no tocan):') +
    ACCIONES.map(function (a) { return boton(enlaceAccion(L.id, a[0]), a[1]); }).join(''),
    'Aviso automático del sistema de Al Milímetro. Responder a este correo no le llega al contacto.') };
}

function resumen(d) {
  const linea = function (L, extra) { return '<li style="margin:8px 0"><b>' + esc(L.nombre) + '</b> · ' + esc(L.tipoLargo) + (L.mun ? ' en ' + esc(L.mun) : '') + ' · clase ' + esc(L.clase) + (extra || '') + '</li>'; };
  const bloques = [];
  bloques.push(p('Buenos días, Sonia. En las últimas 24 horas entraron <b>' + d.ayer.total + '</b> contactos (' + d.ayer.A + ' A, ' + d.ayer.B + ' B, ' + d.ayer.C + ' C).'));
  if (d.sinContactar.length) bloques.push('<h3 style="font-size:18px">Contactos A sin contactar</h3><ul>' + d.sinContactar.map(function (L) { return linea(L, '<br>' + boton(waMe(L.telefono, WA.W1(L)), 'WhatsApp') + boton(enlaceAccion(L.id, 'contesto'), 'Ha contestado')); }).join('') + '</ul>');
  if (d.whatsapp.length) bloques.push('<h3 style="font-size:18px">WhatsApp de seguimiento para hoy</h3><ul>' + d.whatsapp.map(function (x) { return linea(x.L, ' · ' + esc(WA_TITULO[x.paso]) + '<br>' + boton(waMe(x.L.telefono, WA[x.paso](x.L)), 'Abrir WhatsApp con el mensaje', '#FDC023') + boton(enlaceAccion(x.L.id, 'contesto'), 'Ha contestado') + (x.paso === 'W6' ? boton(enlaceAccion(x.L.id, 'mas_adelante'), 'Dice «más adelante»') : '')); }).join('') + '</ul>');
  if (!d.sinContactar.length && !d.whatsapp.length) bloques.push(p('Hoy no tienes seguimientos pendientes.'));
  return { asunto: (d.prueba ? '[PRUEBA] ' : '') + 'Tu día en Al Milímetro · ' + d.fecha, html: marco(bloques.join(''), 'Resumen automático de lunes a viernes a las 9:00.') };
}

module.exports = { vispera: vispera, citaTexto: citaTexto, madrid: madrid, enHorario: enHorario, cuandoEscribo: cuandoEscribo, enlaceAccion: enlaceAccion, firmaValida: firmaValida, waMe: waMe,
  enviar: enviar, CORREOS: CORREOS, WA: WA, WA_TITULO: WA_TITULO, avisoNuevo: avisoNuevo, resumen: resumen, marco: marco, esc: esc };
