// Registro por cita (Bloque 2, Maikel 1-oct-2026: «el identificador de control
// debe ser la cita, no el contacto»).
//
// Hasta hoy el candado era la etiqueta act-cita-confirmada del CONTACTO, que no
// se quitaba nunca: una reagenda, una segunda reunión o una cita nueva meses
// después no recibían confirmación, ni aviso, ni movían el trato. Ahora cada
// cita tiene su propio registro, guardado en UNA nota del contacto que se
// actualiza en sitio (no hay base de datos y no se acumulan etiquetas):
//
//   appointment_id, contact_id, calendar_id, tipo, start_at, status,
//   confirmation_sent_at, confirmation_start_at, reminder_sent_at{vispera,h2},
//   resultado, reprogrammed_from[], historial[]
//
// Tipos: 'diagnostico' (calendario de diagnóstico y sin reunión previa),
// 'segunda' (calendario «Segunda reunión» o título «Segunda reunión…») y
// 'otro' (cualquier otra cosa, o un «diagnóstico» de alguien que ya tuvo
// reunión). Regla de Maikel: mejor silencio que un mensaje incorrecto, así que
// solo el diagnóstico recibe automatismos hoy.
//
// Nada de aquí lanza.

const A = require('./_activacion');

const ZONA = 'Europe/Madrid';
const CAL_DIAGNOSTICO = process.env.AGENDA_CALENDARIO || 'zBlsw8BEKA2zah81YlOl';
const CAL_SEGUNDA = process.env.AGENDA_SEGUNDA || '';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
const MARCA = '##QV-CITA##';
// Las citas reservadas o movidas antes de esta hora ya se confirmaron con el
// sistema anterior: se registran sin mandar nada.
const REGISTRO_DESDE = Date.parse(process.env.CITAS_REGISTRO_DESDE || '2026-10-01T11:00:00Z');
// Señales de que el contacto ya tuvo una reunión con nosotros.
const PREVIA = /^(reunion-celebrada|segunda-reunion|cliente|cliente-.+|piloto|piloto-.+)$/;
const VIVA = function (s) { return !/cancel|noshow|no_show|invalid/i.test(String(s || '')); };

// ---------- Fechas ----------
function desfaseMadridMin(d) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(d).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - d.getTime()) / 60000);
}
// /contacts/{id}/appointments da «2026-10-02 11:00:00» sin zona (hora de Madrid);
// /calendars/events la da en ISO con desfase.
function fecha(v) {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  const s = String(v).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/);
  if (m) {
    const bruto = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    const d1 = new Date(bruto - desfaseMadridMin(new Date(bruto)) * 60000);
    return new Date(bruto - desfaseMadridMin(d1) * 60000);
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function iso(v) { const d = fecha(v); return d ? d.toISOString() : ''; }
function legible(v) {
  const d = fecha(v); if (!d) return '?';
  return new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d);
}

// ---------- Tipo ----------
function tipoDe(ev, contacto, registro) {
  if (registro && registro.tipo_manual) return { tipo: registro.tipo_manual, motivo: 'marcado a mano' };
  const titulo = String((ev && ev.title) || '');
  const cal = String((ev && ev.calendarId) || '');
  if ((CAL_SEGUNDA && cal === CAL_SEGUNDA) || /segunda\s+reuni/i.test(titulo)) return { tipo: 'segunda', motivo: CAL_SEGUNDA && cal === CAL_SEGUNDA ? 'calendario de segunda reunión' : 'título «Segunda reunión»' };
  if (cal !== CAL_DIAGNOSTICO) return { tipo: 'otro', motivo: cal ? 'otro calendario' : 'evento sin calendario de GHL' };
  const previa = ((contacto && contacto.tags) || []).map(String).filter(function (t) { return PREVIA.test(t); })[0];
  if (previa) return { tipo: 'otro', motivo: 'ya tuvo reunión (' + previa + '): tipo por confirmar' };
  return { tipo: 'diagnostico', motivo: 'calendario de diagnóstico' };
}

// ---------- Almacén: una nota por cita ----------
async function notasDe(contactId) {
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/notes', { headers: A.cabeceras() });
    if (!r.ok) return null;
    return ((await r.json().catch(function () { return {}; })).notes) || [];
  } catch (e) { return null; }
}
function leerRegistros(notas) {
  const out = {};
  (notas || []).forEach(function (n) {
    const b = String((n && n.body) || '');
    const i = b.indexOf(MARCA);
    if (i === -1) return;
    try {
      const d = JSON.parse(b.slice(i + MARCA.length).trim());
      if (d && d.appointment_id && !out[d.appointment_id]) out[d.appointment_id] = Object.assign(d, { _nota: n.id });
    } catch (e) { /* nota rota: se ignora */ }
  });
  return out;
}
async function registrosDe(contactId) {
  const n = await notasDe(contactId);
  return n === null ? null : leerRegistros(n);
}

const NOMBRE_TIPO = { diagnostico: 'Diagnóstico', segunda: 'Segunda reunión', otro: 'Otra cita (sin automatismos)' };
function cuerpo(reg) {
  const limpio = Object.assign({}, reg); delete limpio._nota;
  const rec = reg.reminder_sent_at || {};
  const lineas = [
    '📅 CITA · ' + (NOMBRE_TIPO[reg.tipo] || reg.tipo) + ' · ' + legible(reg.start_at) + ' · ' + (reg.status || '?'),
    'Confirmación: ' + (reg.confirmation_sent_at ? (reg.confirmation_sent_at === 'anterior' ? 'con el sistema anterior' : legible(reg.confirmation_sent_at) + (reg.confirmation_canal ? ' (' + reg.confirmation_canal + ')' : '')) : '—') +
      ' · Víspera: ' + (rec.vispera ? legible(rec.vispera) : '—') + ' · H-2: ' + (rec.h2 ? legible(rec.h2) : '—') +
      ' · Resultado: ' + (reg.resultado || '—'),
    'Tipo: ' + reg.tipo + ' (' + (reg.tipo_motivo || '') + ')' + (reg.reprogrammed_from && reg.reprogrammed_from.length ? ' · Reprogramada desde: ' + reg.reprogrammed_from.map(function (x) { return x.appointment_id && x.appointment_id !== reg.appointment_id ? 'otra cita ' + legible(x.start_at) : legible(x.start_at); }).join(', ') : ''),
    'Historial: ' + (reg.historial || []).map(function (h) { return legible(h.t) + ' ' + h.ev; }).join(' · '),
    '',
    'No editar la línea de abajo: es el registro que leen los automatismos.',
    MARCA + ' ' + JSON.stringify(limpio)
  ];
  return lineas.join('\n');
}
async function guardar(reg) {
  reg.updated_at = new Date().toISOString();
  const body = JSON.stringify({ body: cuerpo(reg) });
  try {
    if (reg._nota) {
      const r = await fetch(A.GHL_BASE + '/contacts/' + reg.contact_id + '/notes/' + reg._nota, { method: 'PUT', headers: A.cabeceras(), body: body });
      if (r.ok) return true;
    }
    const r = await fetch(A.GHL_BASE + '/contacts/' + reg.contact_id + '/notes', { method: 'POST', headers: A.cabeceras(), body: body });
    if (!r.ok) return false;
    const d = await r.json().catch(function () { return {}; });
    reg._nota = (d.note && d.note.id) || d.id || reg._nota;
    return true;
  } catch (e) { console.error('[citas] guardar:', e && e.message); return false; }
}
function apuntar(reg, ev) {
  reg.historial = (reg.historial || []).concat([{ t: new Date().toISOString(), ev: ev }]).slice(-15);
}

function nuevoRegistro(ev, contacto, tipo) {
  return {
    v: 1,
    appointment_id: ev.id,
    contact_id: ev.contactId,
    calendar_id: ev.calendarId || '',
    titulo: String(ev.title || '').slice(0, 80),
    tipo: tipo.tipo, tipo_motivo: tipo.motivo, tipo_manual: null,
    start_at: iso(ev.startTime),
    status: String(ev.appointmentStatus || ev.status || 'confirmed'),
    created_at: new Date().toISOString(),
    booked_at: iso(ev.dateAdded) || null,
    confirmation_sent_at: null, confirmation_start_at: null, confirmation_canal: null,
    reminder_sent_at: { vispera: null, dia: null, h2: null },
    resultado: null,
    reprogrammed_from: [],
    historial: []
  };
}

// ¿Qué hay que hacer con esta cita? Puro: no toca nada. Devuelve el registro
// actualizado y la acción pendiente ('confirmar' | 'reconfirmar' | null).
function decidir(ev, contacto, registros, ahora) {
  ahora = ahora || Date.now();
  const previo = registros[ev.id];
  const tipo = tipoDe(ev, contacto, previo);
  const reg = previo ? JSON.parse(JSON.stringify(previo)) : nuevoRegistro(ev, contacto, tipo);
  if (previo) reg._nota = previo._nota;
  const cambios = [];
  const inicio = iso(ev.startTime);
  const estado = String(ev.appointmentStatus || ev.status || reg.status || 'confirmed');
  const movida = Date.parse(ev.rescheduledAt || 0) || 0;
  const reservada = Date.parse(ev.dateAdded || 0) || 0;

  if (!previo) {
    cambios.push('nuevo');
    apuntar(reg, 'registrada (' + tipo.tipo + ')');
    // Reservada o movida antes de que existiera el registro: ya la confirmó el
    // sistema anterior (o es histórica). Se apunta sin mandar nada.
    if (Math.max(reservada, movida) && Math.max(reservada, movida) < REGISTRO_DESDE) {
      reg.confirmation_sent_at = 'anterior'; reg.confirmation_start_at = inicio;
    }
    // ¿Sustituye a otra cita viva del mismo tipo? (reagenda creando una cita nueva)
    const otra = Object.keys(registros).map(function (k) { return registros[k]; }).filter(function (r) {
      return r.appointment_id !== ev.id && r.tipo === tipo.tipo && VIVA(r.status) && !r.resultado && Date.parse(r.start_at) > ahora - 3600 * 1000;
    })[0];
    if (otra) { reg.reprogrammed_from = [{ appointment_id: otra.appointment_id, start_at: otra.start_at, t: new Date(ahora).toISOString() }]; cambios.push('sustituye'); reg._sustituye = otra.appointment_id; }
  } else if (reg.tipo !== tipo.tipo && !reg.tipo_manual) {
    apuntar(reg, 'tipo ' + reg.tipo + ' → ' + tipo.tipo); reg.tipo = tipo.tipo; reg.tipo_motivo = tipo.motivo; cambios.push('tipo');
  }
  if (previo && inicio && reg.start_at !== inicio) {
    reg.reprogrammed_from = (reg.reprogrammed_from || []).concat([{ start_at: reg.start_at, t: new Date(ahora).toISOString() }]).slice(-5);
    apuntar(reg, 'movida de ' + legible(reg.start_at) + ' a ' + legible(inicio));
    reg.start_at = inicio;
    reg.reminder_sent_at = { vispera: null, dia: null, h2: null };
    cambios.push('movida');
  }
  if (estado !== reg.status) { apuntar(reg, 'estado ' + reg.status + ' → ' + estado); reg.status = estado; cambios.push('estado'); }

  let accion = null;
  const futura = Date.parse(reg.start_at) > ahora;
  if (reg.tipo === 'diagnostico' && VIVA(reg.status) && futura && !reg.resultado && reg.confirmation_start_at !== reg.start_at) {
    accion = reg.confirmation_start_at || (reg.reprogrammed_from || []).length ? 'reconfirmar' : 'confirmar';
  }
  return { reg: reg, accion: accion, cambios: cambios, tipo: tipo };
}

// Citas de la agenda de Maikel y del calendario de diagnóstico entre dos
// instantes, con contacto. Incluye canceladas (para registrar el cambio).
async function citasAgenda(iniMs, finMs) {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const urls = [
    A.GHL_BASE + '/calendars/events?locationId=' + loc + '&userId=' + USUARIO_MAIKEL + '&startTime=' + iniMs + '&endTime=' + finMs,
    A.GHL_BASE + '/calendars/events?locationId=' + loc + '&calendarId=' + CAL_DIAGNOSTICO + '&startTime=' + iniMs + '&endTime=' + finMs
  ].concat(CAL_SEGUNDA ? [A.GHL_BASE + '/calendars/events?locationId=' + loc + '&calendarId=' + CAL_SEGUNDA + '&startTime=' + iniMs + '&endTime=' + finMs] : []);
  const vistos = {}, lista = [];
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: A.cabeceras() });
      if (!r.ok) continue;
      const d = await r.json().catch(function () { return {}; });
      (d.events || []).forEach(function (e) {
        if (!e || !e.id || vistos[e.id] || !e.contactId || e.deleted) return;
        vistos[e.id] = true;
        lista.push(e);
      });
    } catch (err) { /* siguiente fuente */ }
  }
  return lista.sort(function (a, b) { return Date.parse(a.startTime) - Date.parse(b.startTime); });
}

async function contactoPorId(id) {
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/' + id, { headers: A.cabeceras() });
    if (!r.ok) return null;
    return ((await r.json().catch(function () { return {}; })).contact) || null;
  } catch (e) { return null; }
}

// Lee el registro de una cita (o null).
async function registroDe(contactId, appointmentId) {
  const regs = await registrosDe(contactId);
  return regs ? regs[appointmentId] || null : null;
}

// Marca un recordatorio enviado en el registro de la cita.
async function marcarRecordatorio(contactId, appointmentId, cual) {
  const regs = await registrosDe(contactId);
  const reg = regs && regs[appointmentId];
  if (!reg) return false;
  reg.reminder_sent_at = Object.assign({ vispera: null, dia: null, h2: null }, reg.reminder_sent_at || {});
  reg.reminder_sent_at[cual] = new Date().toISOString();
  apuntar(reg, 'recordatorio ' + cual);
  return guardar(reg);
}

module.exports = {
  MARCA: MARCA, CAL_DIAGNOSTICO: CAL_DIAGNOSTICO, CAL_SEGUNDA: CAL_SEGUNDA, REGISTRO_DESDE: REGISTRO_DESDE, VIVA: VIVA,
  fecha: fecha, iso: iso, legible: legible, tipoDe: tipoDe, decidir: decidir, apuntar: apuntar,
  registrosDe: registrosDe, registroDe: registroDe, leerRegistros: leerRegistros, guardar: guardar, cuerpo: cuerpo,
  citasAgenda: citasAgenda, contactoPorId: contactoPorId, marcarRecordatorio: marcarRecordatorio
};
