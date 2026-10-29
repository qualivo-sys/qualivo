// Al Milímetro: textos de los pasos de api/_am-flujos.js. Solo copy; la lógica vive en
// _am-flujos.js y el envío en al-milimetro-cron.js. Fuente: propuestas-wip/sistema/mensajes.md
// (rama claude/al-milimetro-landing), borrador del 29-oct pendiente del OK de Sonia.
// Habla Sonia, de tú. W* son textos para que Sonia los mande con el botón wa.me.

const M = require('./_am-modelo.js');
const H = require('./_horario.js');

const F = '-apple-system,Segoe UI,Roboto,sans-serif';

function nombreCorto(nombre) {
  const n = String(nombre || '').trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : '';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Variables comunes de un lead (fila de am_leads con respuestas en jsonb).
function vars(lead) {
  const r = lead.respuestas || {};
  return {
    nombre: nombreCorto(lead.nombre) || 'hola',
    tipo: M.TIPO_TEXTO[r.tipo] || 'tu casa',
    zona: r.mun || r.cp || 'tu zona',
    m2: (M.OPCIONES.m2[r.m2] || '').replace(/ m²$/, ''),
    cuando: (M.OPCIONES.cuando[r.cuando] || '').toLowerCase(),
    dia: lead.cita ? new Intl.DateTimeFormat('es-ES', { timeZone: H.ZONA, weekday: 'long', day: 'numeric' }).format(new Date(lead.cita)) : '',
    hora: lead.cita ? H.horaTexto(lead.cita) : '',
    direccion: r.mun ? 'tu casa de ' + r.mun : 'tu casa'
  };
}

const WA = {
  W1: (v) => `Hola ${v.nombre}, soy Sonia, arquitecta de Al Milímetro. He recibido tu petición para reformar ${v.tipo} en ${v.zona}. Para darte una cifra más ajustada, ¿te viene bien que hablemos 10 minutos hoy o mañana? Si me mandas un par de fotos o el plano, mejor todavía.`,
  W3: (v) => `Hola ${v.nombre}, soy Sonia, de Al Milímetro. Gracias por contarme tu proyecto. Para saber si te puedo ayudar bien, ¿me cuentas en una frase qué te gustaría cambiar? Si me mandas 2 o 3 fotos, mejor.`,
  W5: (v) => `${v.nombre}, ¿pudiste ver mi mensaje de ayer? Cuando te venga bien, lo hablamos en 10 minutos y, si encaja, voy a ver tu casa esta semana. Sin compromiso.`,
  W6: (v) => `¿Sigues con la idea de reformar en los próximos meses, ${v.nombre}? Si ahora no es el momento, dímelo sin problema y te escribo más adelante.`,
  W7: (v) => `¡Perfecto, ${v.nombre}! Nos vemos el ${v.dia} a las ${v.hora} en ${v.direccion}. Si puedes, ten a mano planos o fotos de cómo está ahora y alguna idea de lo que te gusta. Cualquier cambio, me escribes por aquí.`,
  W8: (v) => `Hola ${v.nombre}, te recuerdo que el ${v.dia} a las ${v.hora} paso a ver tu casa. ¿Sigue en pie?`,
  W9: (v) => `${v.nombre}, ¿has podido ver el presupuesto? Si quieres, lo repasamos en 10 minutos y te resuelvo cualquier duda de partidas o plazos.`,
  W10: (v) => `Si estás comparando con otros presupuestos, ${v.nombre}, te paso las 3 cosas que yo miraría: que venga por partidas, que tenga fechas y qué pasa si algo cambia en obra. Así comparas igual con igual.`,
  W11: (v) => `¿Hay algo del presupuesto (el plazo, alguna partida, la forma de pago) que podamos ajustar para que te encaje, ${v.nombre}?`,
  W12: (v) => `${v.nombre}, no te escribo más para no agobiarte. Si más adelante retomas la idea, aquí estoy.`
};

// Para qué sirve cada tarea, en una línea, para el asunto del email a Sonia.
const TAREA = {
  W1: 'primer WhatsApp', W3: 'segundas preguntas', W5: 'seguimiento del día 1', W6: 'seguimiento del día 3',
  W7: 'confirmar la visita', W8: 'recordar la visita', W9: 'presupuesto +2 días', W10: 'presupuesto +7 días',
  W11: 'presupuesto +14 días', W12: 'presupuesto +21 días (último)'
};

function parrafos(lineas) {
  return lineas.map((l) => `<p style="margin:0 0 14px">${l}</p>`).join('');
}

// Emails al lead. pie(lead) lo pone el reloj (enlace de baja firmado).
const EMAIL = {
  E1: (v) => ({ asunto: 'Lo que pasa ahora con tu reforma', cuerpo: [
    `Hola ${esc(v.nombre)}:`,
    'Gracias por contarme tu proyecto. Te explico cómo trabajo para que sepas qué esperar.',
    'Primero voy a ver tu casa, mido y escucho lo que quieres. Reviso también lo que no se ve (instalaciones, bajantes, suelo), que es lo que suele disparar una reforma a mitad de obra.',
    'A los 7 días de la visita tienes el presupuesto por partidas, con materiales y plazo. Si decides seguir, coordino toda la obra: hablas solo conmigo, de la primera visita a la entrega.',
    'Si quieres reservar ya la visita, contesta a este correo' + (process.env.AM_WHATSAPP_NEGOCIO ? ' o escríbeme por WhatsApp al ' + esc(process.env.AM_WHATSAPP_NEGOCIO) : '') + '.',
    'Sonia · Al Milímetro<br>Tu reforma, sin agobios'] }),
  E2: (v) => ({ asunto: 'Lo que reviso antes de darte un precio', cuerpo: [
    `Hola ${esc(v.nombre)}:`,
    'El presupuesto que entra bajo y luego sube casi siempre falla en lo que no se ve. Antes de darte una cifra, miro cuatro cosas:',
    '• <b>La luz y el agua:</b> el cuadro, el cableado y las tuberías.<br>• <b>Las bajantes:</b> en pisos antiguos son la sorpresa más cara.<br>• <b>El suelo:</b> si se puede poner encima o hay que levantar.<br>• <b>Las ventanas:</b> si conviene cambiarlas, te lo digo ahora y no cuando ya está pintado.',
    'Si algo de esto hay que hacerlo, va en el presupuesto desde el principio. Así el precio no cambia a mitad de obra.',
    'Sonia'] }),
  E3: (v) => ({ asunto: 'Cómo comparar presupuestos sin equivocarte', cuerpo: [
    `Hola ${esc(v.nombre)}:`,
    'Si estás pidiendo varios presupuestos, dos con el mismo total pueden ser obras muy distintas. Yo miraría tres cosas:',
    '1. <b>Que venga por partidas.</b> Cada trabajo con su precio y su material. Un total sin desglose no se puede comparar.<br>2. <b>Que tenga fechas.</b> Cuándo empieza, cuánto dura y qué pasa si se retrasa.<br>3. <b>Qué pasa si algo cambia.</b> Cómo se valora un cambio en obra y si se aprueba por escrito antes de hacerlo.',
    'Aunque al final no lo hagas conmigo, con esto vas a elegir mejor.',
    'Sonia'] }),
  E4: (v) => ({ asunto: '¿Seguimos con tu reforma?', cuerpo: [
    `Hola ${esc(v.nombre)}:`,
    `Hace un par de semanas me contaste que querías reformar ${esc(v.tipo)} en ${esc(v.zona)}. ¿Sigue en pie la idea?`,
    'Si te viene bien, voy a verla esta semana o la que viene y en 7 días tienes el presupuesto por partidas. Y si ahora no es el momento, no pasa nada: contéstame «más adelante» y te escribo dentro de unos meses.',
    'Sonia'] })
};

function htmlEmail(cuerpo, pie) {
  return `<div style="font-family:${F};font-size:16px;line-height:1.6;color:#1d1d1f;max-width:560px">${parrafos(cuerpo)}` +
    (pie ? `<p style="margin:28px 0 0;font-size:12px;color:#888">${pie}</p>` : '') + '</div>';
}

function boton(href, texto, color) {
  return `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 16px;border-radius:10px;background:${color || '#25D366'};color:#fff;text-decoration:none;font-weight:600">${esc(texto)}</a>`;
}

module.exports = { vars, WA, TAREA, EMAIL, htmlEmail, boton, esc, nombreCorto };
