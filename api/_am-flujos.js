// Al Milímetro: lógica de los flujos (qué toca, cuándo, y cuándo se para todo).
// Sin red ni base de datos: recibe el lead con su historial y devuelve los pasos.
// Lo usa el reloj (cron cada 10 min) y lo prueban scripts/al-milimetro/probar-flujos.js.
// Textos: propuestas-wip/sistema/mensajes.md (rama claude/al-milimetro-landing).
//
// Sistema propio (Chief of Staff, 29-oct): base de datos de qualivo.io, emails por Resend
// y WhatsApp con botón wa.me. Eso cambia una cosa respecto a mensajes.md: los WhatsApp
// NO salen solos. Cada W es una TAREA para Sonia con el texto ya escrito y el enlace
// wa.me; ella pulsa y lo envía desde su móvil. Por eso:
//   · Todo WhatsApp cae dentro del horario de Sonia (si no, nadie lo manda).
//   · W2 («fuera de horario») deja de tener sentido: fuera de horario sale E1 al
//     momento y W1 queda para la apertura siguiente.
//   · Que alguien ha contestado por WhatsApp lo marca Sonia (botón «Ha contestado»).
//
// Horario de Sonia [C]: de lunes a jueves de 9:00 a 19:00 y los viernes de 9:00 a 15:00,
// hora de Madrid, sin festivos nacionales (los de _horario.js).
//
// Lead que entra:
//   { id, clase: 'A'|'B'|'C', revision: bool, creado: ms, cita?: ms, eventos: [{ tipo, en, clave? }] }
// Tipos de evento (los escribe el sistema o Sonia desde su panel):
//   enviado {clave}     · un paso ya hecho (email enviado o tarea de WhatsApp marcada como enviada)
//   respondio           · contestó por cualquier canal → para seguimiento y recuperación
//   visita {en = fecha de la cita}  · reservó visita → para el seguimiento, abre W7/W8
//   visita_cancelada    · se anula W8
//   presupuesto         · Sonia envió el presupuesto → abre W9-W12
//   mas_adelante        · botón de W6 → pasa a C: solo emails
//   etapa_manual        · Sonia lo movió a mano → para el seguimiento automático
//   stop · ganado · perdido · baja   · se para todo (baja = solo los emails)

const H = require('./_horario.js');

const HORA = 3600 * 1000, DIA = 24 * HORA;
// [desde, hasta) en minutos, por día de la semana (0 domingo … 6 sábado)
const FRANJA = { 1: [540, 1140], 2: [540, 1140], 3: [540, 1140], 4: [540, 1140], 5: [540, 900] };

function enHorario(ms) {
  const t = H.madrid(ms);
  const f = FRANJA[t.dia];
  return !!f && !H.esFestivo(ms) && t.minutos >= f[0] && t.minutos < f[1];
}

// Primer instante dentro del horario de Sonia a partir de ms (el propio si ya vale).
function siguienteApertura(ms) {
  if (enHorario(ms)) return ms;
  const t0 = H.madrid(ms);
  for (let k = 0; k < 15; k++) {
    const fecha = sumarDias(t0.fecha, k);
    const medio = H.msDeMadrid(fecha, 720);
    const f = FRANJA[H.madrid(medio).dia];
    if (!f || H.esFestivo(medio)) continue;
    const ini = H.msDeMadrid(fecha, f[0]), fin = H.msDeMadrid(fecha, f[1]);
    if (ms < fin) return Math.max(ms, ini);
  }
  return null;
}

function sumarDias(fecha, n) {
  const [y, m, d] = String(fecha).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// Recordatorio de la visita: a la apertura del último día de trabajo antes de la cita
// (cita el lunes → el viernes). Si ese momento ya pasó cuando se reservó, a la apertura
// siguiente, siempre que quede al menos 2 h para la cita; si no da tiempo, no hay recordatorio.
function vispera(citaMs, desdeMs) {
  const dia = H.madrid(citaMs).fecha;
  let ms = null;
  for (let k = 1; k <= 7 && ms == null; k++) {
    const fecha = sumarDias(dia, -k);
    const medio = H.msDeMadrid(fecha, 720);
    const f = FRANJA[H.madrid(medio).dia];
    if (f && !H.esFestivo(medio)) ms = H.msDeMadrid(fecha, f[0]);
  }
  if (ms == null || ms < desdeMs) ms = siguienteApertura(desdeMs);
  return ms != null && ms < citaMs - 2 * HORA ? ms : null;
}

// Los pasos de mensajes.md. canal: 'email' (Resend, sale solo) · 'wa' (tarea wa.me para
// Sonia) · 'aviso' (aviso a Sonia, sin mensaje al lead) · 'tarea' (algo que decide ella).
// para: clases a las que aplica. base: desde qué evento se cuenta.
const PASOS = [
  // Seguimiento desde la entrada
  { clave: 'E1', canal: 'email', base: 'entrada', tras: 0, para: 'ABC', cualquierHora: true },
  { clave: 'W1', canal: 'wa', base: 'entrada', tras: 0, para: 'AB', soloSi: (l) => !l.revision },
  { clave: 'W3', canal: 'wa', base: 'entrada', tras: 0, para: 'ABC', soloSi: (l) => !!l.revision },
  { clave: 'AVISO_A', canal: 'aviso', base: 'entrada', tras: 0, para: 'A' },
  { clave: 'LLAMAR_A', canal: 'aviso', base: 'entrada', tras: 2 * HORA, para: 'A' },
  { clave: 'W5', canal: 'wa', base: 'entrada', tras: 1 * DIA, para: 'AB' },
  { clave: 'W6', canal: 'wa', base: 'entrada', tras: 3 * DIA, para: 'AB' },
  { clave: 'E2', canal: 'email', base: 'entrada', tras: 3 * DIA, para: 'ABC' },
  { clave: 'E3', canal: 'email', base: 'entrada', tras: 7 * DIA, para: 'ABC' },
  { clave: 'E4', canal: 'email', base: 'entrada', tras: 14 * DIA, para: 'BC' },
  // Visita (desde que se reserva)
  { clave: 'W7', canal: 'wa', base: 'visita', tras: 0, para: 'ABC' },
  { clave: 'W8', canal: 'wa', base: 'vispera', tras: 0, para: 'ABC' },
  // Recuperación del presupuesto (desde que Sonia lo envía)
  { clave: 'W9', canal: 'wa', base: 'presupuesto', tras: 2 * DIA, para: 'ABC' },
  { clave: 'W10', canal: 'wa', base: 'presupuesto', tras: 7 * DIA, para: 'ABC' },
  { clave: 'W11', canal: 'wa', base: 'presupuesto', tras: 14 * DIA, para: 'ABC' },
  { clave: 'W12', canal: 'wa', base: 'presupuesto', tras: 21 * DIA, para: 'ABC' },
  { clave: 'PERDIDO', canal: 'tarea', base: 'presupuesto', tras: 22 * DIA, para: 'ABC' }
];

function ultimo(eventos, tipo) {
  let r = null;
  (eventos || []).forEach(function (e) { if (e.tipo === tipo && (r == null || e.en > r.en)) r = e; });
  return r;
}

// Todos los pasos que quedan pendientes, con su hora. No mira «ahora»: para eso, debidos().
function plan(lead) {
  const ev = lead.eventos || [];
  const hecho = new Set(ev.filter((e) => e.tipo === 'enviado').map((e) => e.clave));
  const cierre = ultimo(ev, 'stop') || ultimo(ev, 'ganado') || ultimo(ev, 'perdido');
  if (cierre) return [];

  const clase = ultimo(ev, 'mas_adelante') ? 'C' : lead.clase;
  const visita = ultimo(ev, 'visita');
  const cancelada = ultimo(ev, 'visita_cancelada');
  const visitaViva = visita && !(cancelada && cancelada.en > visita.en);
  const ppto = ultimo(ev, 'presupuesto');
  const respondio = ultimo(ev, 'respondio');
  const manual = ultimo(ev, 'etapa_manual');
  const baja = ultimo(ev, 'baja');

  // Hasta cuándo vale cada secuencia: la primera parada la cierra.
  const finSeguimiento = Math.min.apply(null, [respondio, manual, visita, ppto, ultimo(ev, 'mas_adelante')]
    .filter(Boolean).map((e) => e.en).concat([Infinity]));
  const respTrasPpto = ppto && ev.some((e) => e.tipo === 'respondio' && e.en > ppto.en);

  const out = [];
  PASOS.forEach(function (p) {
    if (hecho.has(p.clave)) return;
    if (p.para.indexOf(clase) < 0) return;
    if (p.soloSi && !p.soloSi(lead)) return;
    if (p.canal === 'email' && baja) return;

    let base, limite = Infinity;
    if (p.base === 'entrada') {
      base = lead.creado; limite = finSeguimiento;
      // «Más adelante» deja seguir los emails (pasa a C), pero no los WhatsApp ni los avisos.
      const ma = ultimo(ev, 'mas_adelante');
      if (ma && p.canal === 'email') limite = Math.min.apply(null, [respondio, manual, visita, ppto].filter(Boolean).map((e) => e.en).concat([Infinity]));
    } else if (p.base === 'visita') {
      if (!visitaViva) return; base = visita.en;
    } else if (p.base === 'vispera') {
      if (!visitaViva || !lead.cita) return;
      base = vispera(lead.cita, visita.en); if (base == null) return;
    } else if (p.base === 'presupuesto') {
      if (!ppto || respTrasPpto) return; base = ppto.en;
    }

    // Los días cuentan en calendario de Madrid (el cambio de hora no mueve la hora del mensaje).
    const dias = Math.floor(p.tras / DIA), t = H.madrid(base);
    let en = dias ? H.msDeMadrid(sumarDias(t.fecha, dias), t.minutos) + (p.tras - dias * DIA) : base + p.tras;
    if (!p.cualquierHora) en = siguienteApertura(en);
    if (en == null || en >= limite) return;
    out.push({ clave: p.clave, canal: p.canal, en: en });
  });
  return out.sort((a, b) => a.en - b.en);
}

// Lo que toca hacer ya. El reloj lo ejecuta y apunta cada paso como evento «enviado».
// Un paso con más de 36 h de retraso (el reloj estuvo parado, o Sonia no marcó la
// tarea) sale como caducado: el reloj lo apunta como «enviado» sin mandarlo, para
// no disparar de golpe una tanda de mensajes atrasados.
const CADUCA = 36 * HORA;
function debidos(lead, ahora) {
  ahora = ahora == null ? Date.now() : ahora;
  return plan(lead).filter((p) => p.en <= ahora)
    .map((p) => Object.assign(p, { caducado: ahora - p.en > CADUCA }));
}

// Enlace wa.me con el texto ya escrito, para el botón de la tarea de Sonia.
function waEnlace(telefono, texto) {
  let n = String(telefono || '').replace(/\D/g, '');
  if (n.length === 9) n = '34' + n;
  return 'https://wa.me/' + n + '?text=' + encodeURIComponent(texto || '');
}

module.exports = { FRANJA, enHorario, siguienteApertura, vispera, PASOS, plan, debidos, waEnlace };
