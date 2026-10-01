// Simulación del Bloque 2 (booked → show) contra un CRM falso en memoria.
// No toca GHL, Meta ni Google: intercepta fetch y el reloj.
// Uso: node herramientas/simular-bloque2.js
'use strict';
process.env.GHL_API_KEY = 'x'; process.env.GHL_LOCATION_ID = 'loc'; process.env.CRON_SECRET = 's';
process.env.RESEND_API_KEY = 'x'; process.env.META_CAPI_TOKEN = 'x'; process.env.CANDADO_MS = '30';
process.env.GATEWAY_MAX_DIA = '999'; process.env.ENRIQUECER = '0';
process.env.CITAS_REGISTRO_DESDE = '2026-10-01T12:00:00Z';

// ---- Reloj falso ----
const RealDate = Date;
let AHORA = RealDate.parse('2026-10-05T08:00:00Z');
global.Date = class extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(AHORA); }
  static now() { return AHORA; }
};
global.Date.UTC = RealDate.UTC; global.Date.parse = RealDate.parse;
const fijar = function (iso) { AHORA = RealDate.parse(iso); };
const avanzar = function (min) { AHORA += min * 60000; };

// ---- CRM falso ----
const DIAG = 'zBlsw8BEKA2zah81YlOl', OTRO_CAL = 'otroCal', MOVIL = 'DgkPLaw6fzy4z1bs8HsB';
const ST = { reunion: 'd491f3eb-2b82-468b-aab9-60e9cdc7368f', noPresentado: 'd04755f9-f94c-4c56-ac14-2c6b6356e1d6', conversacion: '2f7569b8-d95b-4bfe-8120-0a4d206907ce', segunda: 'b853294d-a4fe-4ce8-8fed-e46723ab4540', desconocida: 'zzz-desconocida' };
let C, CITAS, OPS, enviados, avisos, meta, seq;
function nuevoCRM() { C = {}; CITAS = {}; OPS = {}; enviados = []; avisos = []; meta = []; seq = 0; }
function contacto(id, tags, extra) {
  C[id] = Object.assign({ id: id, firstName: 'Laura', companyName: 'Academia Delta', phone: '+34600000' + String(Object.keys(C).length).padStart(3, '0'),
    email: id + '@ejemplo.es', tags: (tags || []).slice(), notes: [], msgs: [], dateAdded: new RealDate(AHORA).toISOString() }, extra || {});
  return C[id];
}
// Hora de Madrid «2026-10-07 11:00» → ISO con desfase, como /calendars/events.
function madrid(local) {
  const [d, h] = local.split(' ');
  for (const off of ['+02:00', '+01:00']) {
    const t = new RealDate(d + 'T' + h + ':00' + off);
    const s = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(t);
    if (s === h) return d + 'T' + h + ':00' + off;
  }
  throw new Error('hora imposible ' + local);
}
function cita(id, contactId, local, o) {
  o = o || {};
  CITAS[id] = { id: id, contactId: contactId, calendarId: o.cal || DIAG, title: o.titulo || 'Diagnóstico de crecimiento · Laura', startTime: madrid(local),
    appointmentStatus: o.estado || 'confirmed', dateAdded: o.reservada || new RealDate(AHORA).toISOString(), address: o.enlace === undefined ? 'https://meet.google.com/abc-' + id : o.enlace, deleted: false };
  return CITAS[id];
}
function mover(id, local) { CITAS[id].startTime = madrid(local); CITAS[id].rescheduledAt = new RealDate(AHORA).toISOString(); }
function sinZona(isoOff) { const t = new RealDate(isoOff); const p = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(t); return p.replace('T', ' '); }
const ok = function (b) { return Promise.resolve({ ok: true, status: 200, json: async () => b, text: async () => JSON.stringify(b) }); };
global.fetch = async function (url, opt) {
  url = String(url); opt = opt || {}; const met = opt.method || 'GET'; const body = opt.body ? JSON.parse(opt.body) : {};
  let m;
  if (url.indexOf('graph.facebook.com') > -1) { (body.data || []).forEach(function (e) { meta.push({ ev: e.event_name, id: e.event_id }); }); return ok({}); }
  if (url.indexOf('resend.com') > -1) return ok({ id: 'r' });
  if (url.indexOf('/contacts/search') > -1) {
    const tag = ((body.filters || [])[0] || {}).value;
    return ok({ contacts: (body.page || 1) === 1 ? Object.values(C).filter(function (c) { return c.tags.indexOf(tag) > -1; }) : [] });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/tags$/))) {
    const c = C[m[1]]; if (!c) return ok({});
    if (met === 'DELETE') c.tags = c.tags.filter(function (t) { return (body.tags || []).indexOf(t) === -1; });
    else (body.tags || []).forEach(function (t) { t = String(t).toLowerCase(); if (c.tags.indexOf(t) === -1) c.tags.push(t); });
    return ok({ tags: c.tags });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/notes\/([^/?]+)$/)) && met === 'PUT') {
    const n = (C[m[1]].notes || []).filter(function (x) { return x.id === m[2]; })[0]; if (n) n.body = body.body; return ok({ note: n });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/notes$/))) {
    const c = C[m[1]]; if (!c) return ok({ notes: [] });
    if (met === 'POST') { const n = { id: 'n' + (++seq), body: body.body, dateAdded: new RealDate(AHORA).toISOString() }; c.notes.push(n); return ok({ note: n }); }
    return ok({ notes: c.notes.slice().reverse() });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/appointments$/))) {
    return ok({ events: Object.values(CITAS).filter(function (e) { return e.contactId === m[1]; }).map(function (e) { return Object.assign({}, e, { startTime: sinZona(e.startTime) }); }) });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/tasks$/))) return ok({ id: 'task' });
  if ((m = url.match(/\/contacts\/([^/?]+)$/))) { const c = C[m[1]]; return ok({ contact: c ? JSON.parse(JSON.stringify(c)) : null }); }
  if ((m = url.match(/\/calendars\/events\/appointments\/([^/?]+)$/))) return ok({ appointment: CITAS[m[1]] || null });
  if (url.indexOf('/calendars/events?') > -1) {
    const q = new URL(url).searchParams; const ini = +q.get('startTime'), fin = +q.get('endTime'); const cal = q.get('calendarId');
    return ok({ events: Object.values(CITAS).filter(function (e) {
      const t = RealDate.parse(e.startTime); if (t < ini || t > fin) return false;
      return cal ? e.calendarId === cal : true;
    }).map(function (e) { return Object.assign({}, e); }) });
  }
  if (url.indexOf('/opportunities/search') > -1) { const id = new URL(url).searchParams.get('contact_id'); return ok({ opportunities: OPS[id] ? [OPS[id]] : [] }); }
  if ((m = url.match(/\/opportunities\/([^/?]+)$/)) && met === 'PUT') { const o = Object.values(OPS).filter(function (x) { return x.id === m[1]; })[0]; if (o) o.pipelineStageId = body.pipelineStageId; return ok({}); }
  if (url.match(/\/opportunities\/$/) && met === 'POST') { OPS[body.contactId] = { id: 'op-' + body.contactId, pipelineStageId: body.pipelineStageId }; return ok({ opportunity: OPS[body.contactId] }); }
  if (url.indexOf('/conversations/search') > -1) { const id = (url.match(/contactId=([^&]+)/) || [])[1]; return ok({ conversations: C[id] ? [{ id: 'conv-' + id }] : [] }); }
  if ((m = url.match(/\/conversations\/conv-([^/]+)\/messages/))) return ok({ messages: { messages: (C[m[1]] || { msgs: [] }).msgs } });
  if (url.match(/\/conversations\/messages$/) && met === 'POST') {
    if (body.contactId === MOVIL) { avisos.push(body.message); return ok({ messageId: 'mv' }); }
    enviados.push({ id: body.contactId, t: AHORA, texto: body.message });
    C[body.contactId].msgs.push({ id: 'm' + (++seq), direction: 'outbound', body: body.message, messageType: 'TYPE_CUSTOM_SMS', conversationProviderId: '67ad23a0cf352d8f5809f0ca', status: 'delivered', dateAdded: new RealDate(AHORA).toISOString() });
    return ok({ messageId: 'm' + seq });
  }
  if (url.indexOf('/conversations/messages/') > -1) return ok({ message: { status: 'delivered' } });
  return ok({});
};
function entrante(id, texto) { C[id].msgs.push({ id: 'm' + (++seq), direction: 'inbound', body: texto, messageType: 'TYPE_CUSTOM_SMS', conversationProviderId: '67ad23a0cf352d8f5809f0ca', status: 'delivered', dateAdded: new RealDate(AHORA).toISOString() }); }

const CITA = require('../api/_cita.js');
const CI = require('../api/_citas.js');
const R = require('../api/_recordatorios.js');
const T = require('../api/_tratos.js');

const a = function (id) { return enviados.filter(function (e) { return e.id === id; }); };
const reg = function (cid, aid) { return CI.leerRegistros(C[cid].notes)[aid]; };
const schedules = function () { return meta.filter(function (x) { return x.ev === 'Schedule'; }).length; };
const rastreo = function () { return CITA.revisarCitas({ presupuestoMs: 60000 }); };

const resultados = [];
async function caso(nombre, fn) {
  nuevoCRM();
  try { const r = await fn(); resultados.push([r === true ? 'OK ' : 'FALLO', nombre, r === true ? '' : r]); }
  catch (e) { resultados.push(['ERROR', nombre, e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e]); }
}

(async function () {
  // ---------- Fase 1 ----------
  await caso('Diagnóstico nuevo (+2 días): una confirmación, registro, Schedule, trato y aviso', async function () {
    fijar('2026-10-05T08:00:00Z'); // lun 10:00
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo();
    const e = a('c1'); if (e.length !== 1) return 'envíos ' + e.length;
    if (!/Confirmado: hablamos el miércoles, 7 de octubre a las 11:00/.test(e[0].texto)) return 'texto: ' + e[0].texto;
    if (!/meet\.google\.com\/abc-a1/.test(e[0].texto)) return 'sin enlace';
    const r = reg('c1', 'a1'); if (!r || r.tipo !== 'diagnostico' || r.confirmation_start_at !== r.start_at || !r.confirmation_sent_at) return 'registro ' + JSON.stringify(r);
    if (schedules() !== 1) return 'Schedule ' + schedules();
    if (!OPS.c1 || OPS.c1.pipelineStageId !== ST.reunion) return 'trato';
    if (!avisos.some(function (x) { return /HA COGIDO HORA/.test(x); })) return 'sin aviso';
    if (C.c1.notes.filter(function (n) { return n.body.indexOf(CI.MARCA) > -1; }).length !== 1) return 'notas de registro: ' + C.c1.notes.length;
    return true;
  });
  await caso('Reloj doble y en paralelo: 0 duplicados', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 11:00');
    await Promise.all([rastreo(), rastreo()]);
    await rastreo(); avanzar(10); await rastreo();
    if (a('c1').length !== 1) return 'envíos ' + a('c1').length;
    if (schedules() !== 1) return 'Schedule ' + schedules();
    if (C.c1.notes.filter(function (n) { return n.body.indexOf(CI.MARCA) > -1; }).length !== 1) return 'registros duplicados';
    return true;
  });
  await caso('Reserva por Raquel/agente + rastreo después: una confirmación', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'activacion']); cita('a1', 'c1', '2026-10-06 12:00');
    await CITA.confirmarCita({ contactId: 'c1', inicio: CITAS.a1.startTime, origen: 'Agente de WhatsApp', evento: { id: 'a1' } });
    await rastreo();
    if (a('c1').length !== 1) return 'envíos ' + a('c1').length;
    if (!/mañana, martes, 6 de octubre a las 12:00/.test(a('c1')[0].texto)) return 'texto: ' + a('c1')[0].texto;
    if (C.c1.tags.indexOf('activacion') > -1) return 'cadencia sigue';
    return true;
  });
  await caso('Webhook con solo la hora: encuentra la cita por hora', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-08 16:30');
    await CITA.confirmarCita({ contactId: 'c1', inicio: CITAS.a1.startTime, origen: 'Calendario' });
    await rastreo();
    return a('c1').length === 1 && !!reg('c1', 'a1') ? true : 'envíos ' + a('c1').length;
  });
  await caso('Mismo día (+3 h): dice «hoy»', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-05 13:00');
    await rastreo();
    return a('c1').length === 1 && /hablamos hoy, lunes, 5 de octubre a las 13:00/.test(a('c1')[0].texto) ? true : JSON.stringify(a('c1'));
  });
  await caso('Reserva a menos de 2 h (a mano): confirma una vez con enlace', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-05 11:30');
    await rastreo();
    return a('c1').length === 1 && /hoy.*11:30.*meet\.google/.test(a('c1')[0].texto) ? true : JSON.stringify(a('c1'));
  });
  await caso('Reserva a +7 días: confirmación con fecha completa', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-12 10:00');
    await rastreo();
    return a('c1').length === 1 && /el lunes, 12 de octubre a las 10:00/.test(a('c1')[0].texto) ? true : JSON.stringify(a('c1'));
  });
  await caso('Cambio de hora de la MISMA cita: un «Cambiada», sin Schedule nuevo, recordatorios a cero', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo();
    avanzar(60); mover('a1', '2026-10-08 17:00');
    await rastreo(); await rastreo();
    const e = a('c1'); if (e.length !== 2) return 'envíos ' + e.length;
    if (!/Cambiada: ahora hablamos el jueves, 8 de octubre a las 17:00/.test(e[1].texto)) return 'texto: ' + e[1].texto;
    if (schedules() !== 1) return 'Schedule ' + schedules();
    const r = reg('c1', 'a1'); if (r.reprogrammed_from.length !== 1 || r.reminder_sent_at.vispera) return 'registro ' + JSON.stringify(r);
    return true;
  });
  await caso('Doble reagenda: un mensaje por cada cambio, nada repetido', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo(); avanzar(30); mover('a1', '2026-10-08 17:00'); await rastreo(); avanzar(30); mover('a1', '2026-10-09 10:00'); await rastreo(); await rastreo();
    const e = a('c1'); if (e.length !== 3) return 'envíos ' + e.length;
    if (!/9 de octubre a las 10:00/.test(e[2].texto)) return 'último: ' + e[2].texto;
    return reg('c1', 'a1').reprogrammed_from.length === 2 ? true : 'historial';
  });
  await caso('Reagenda creando OTRA cita con la vieja viva: aviso de dos citas, confirma la nueva una vez', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo(); avanzar(60); cita('a2', 'c1', '2026-10-09 12:00');
    await rastreo(); await rastreo();
    const e = a('c1'); if (e.length !== 2) return 'envíos ' + e.length;
    if (!/Cambiada: ahora hablamos el viernes, 9 de octubre a las 12:00/.test(e[1].texto)) return 'texto: ' + e[1].texto;
    if (!avisos.some(function (x) { return /DOS CITAS VIVAS/.test(x); })) return 'sin aviso de dos citas';
    if (schedules() !== 1) return 'Schedule ' + schedules();
    return reg('c1', 'a2').reprogrammed_from[0].appointment_id === 'a1' ? true : 'reprogrammed_from';
  });
  await caso('No-show que vuelve a reservar: confirmación nueva, trato vuelve a Reunión, sin Schedule ni Qualified', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'meta-lead-123', 'act-agendado', 'act-cita-confirmada', 'no-presentado']);
    OPS.c1 = { id: 'op-c1', pipelineStageId: ST.noPresentado };
    cita('a0', 'c1', '2026-10-01 11:00', { estado: 'noshow', reservada: '2026-09-28T08:00:00Z' });
    cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo(); await rastreo();
    const e = a('c1'); if (e.length !== 1) return 'envíos ' + e.length;
    if (!/Confirmado: hablamos/.test(e[0].texto)) return 'texto: ' + e[0].texto;
    if (OPS.c1.pipelineStageId !== ST.reunion) return 'trato no sube';
    if (meta.length) return 'Meta: ' + JSON.stringify(meta);
    if (!avisos.some(function (x) { return /VUELVE A COGER HORA/.test(x); })) return 'aviso: ' + avisos.join(' / ');
    return true;
  });
  await caso('Dos citas del mismo contacto (diagnóstico pasado con show + segunda reunión): la segunda no recibe nada', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'act-cita-confirmada', 'reunion-celebrada']);
    OPS.c1 = { id: 'op-c1', pipelineStageId: ST.segunda };
    cita('a0', 'c1', '2026-09-29 12:00', { estado: 'showed', reservada: '2026-09-25T08:00:00Z' });
    cita('a1', 'c1', '2026-10-07 12:00', { titulo: 'Segunda reunión · Laura (Academia Delta)' });
    await rastreo();
    if (a('c1').length) return 'envió: ' + a('c1')[0].texto;
    if (reg('c1', 'a1').tipo !== 'segunda') return 'tipo ' + reg('c1', 'a1').tipo;
    if (meta.length) return 'Meta';
    if (OPS.c1.pipelineStageId !== ST.segunda) return 'trato movido';
    return true;
  });
  await caso('«Diagnóstico» de alguien que ya tuvo reunión (caso Sergi): tipo otro, silencio', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['reunion-celebrada']); cita('a1', 'c1', '2026-10-07 10:00', { titulo: 'Sergi · Diagnóstico Qualivo (15 min)' });
    await rastreo();
    if (a('c1').length) return 'envió';
    return reg('c1', 'a1').tipo === 'otro' ? true : 'tipo ' + reg('c1', 'a1').tipo;
  });
  await caso('Cita en otro calendario / evento de Google: tipo otro, silencio', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 10:00', { cal: OTRO_CAL, titulo: 'Llamada' });
    await rastreo();
    return !a('c1').length && reg('c1', 'a1').tipo === 'otro' ? true : 'envíos ' + a('c1').length;
  });
  await caso('Cita anterior al registro: se registra sin mandar nada', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'act-cita-confirmada']); cita('a1', 'c1', '2026-10-07 10:00', { reservada: '2026-09-29T08:00:00Z' });
    await rastreo();
    const r = reg('c1', 'a1');
    return !a('c1').length && r && r.confirmation_sent_at === 'anterior' ? true : 'envíos ' + a('c1').length;
  });
  await caso('Cita anterior al registro que se mueve después: sale el «Cambiada»', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'act-cita-confirmada']); cita('a1', 'c1', '2026-10-07 10:00', { reservada: '2026-09-29T08:00:00Z' });
    await rastreo(); avanzar(20); mover('a1', '2026-10-07 16:00'); await rastreo();
    return a('c1').length === 1 && /Cambiada/.test(a('c1')[0].texto) ? true : JSON.stringify(a('c1'));
  });
  await caso('Cancelada: estado registrado, sin mensaje y sin víspera', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-08 11:00');
    await rastreo(); avanzar(30); CITAS.a1.appointmentStatus = 'cancelled'; await rastreo();
    if (reg('c1', 'a1').status !== 'cancelled') return 'estado';
    fijar('2026-10-07T16:30:00Z'); const r = await R.vuelta('vispera');
    return a('c1').length === 1 && r.enviados === 0 ? true : 'envíos ' + a('c1').length + ' víspera ' + r.enviados;
  });
  await caso('Baja: no se confirma', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'act-baja']); cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo();
    return !a('c1').length ? true : 'envió';
  });
  await caso('Freno de 3 sin respuesta: la confirmación sale igual (transaccional)', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']);
    ['uno', 'dos', 'tres'].forEach(function (t) { C.c1.msgs.push({ id: 'x' + t, direction: 'outbound', body: t, messageType: 'TYPE_CUSTOM_SMS', conversationProviderId: '67ad23a0cf352d8f5809f0ca', status: 'delivered', dateAdded: new RealDate(AHORA - 3600e3).toISOString() }); });
    cita('a1', 'c1', '2026-10-07 11:00');
    await rastreo();
    return a('c1').length === 1 ? true : 'envíos ' + a('c1').length;
  });
  await caso('Sin enlace en la cita: texto limpio, sin «Este es el enlace: en la invitación…»', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-07 11:00', { enlace: '' });
    await rastreo();
    const t = (a('c1')[0] || {}).texto || '';
    return /el enlace está en la invitación/.test(t) && !/Este es el enlace: en/.test(t) ? true : t;
  });
  await caso('Cambio horario (cita el 26-oct, ya en invierno): la hora sale bien', async function () {
    fijar('2026-10-23T08:00:00Z'); // viernes, horario de verano
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-26 10:00');
    await rastreo();
    return a('c1').length === 1 && /el lunes, 26 de octubre a las 10:00/.test(a('c1')[0].texto) ? true : JSON.stringify(a('c1'));
  });
  await caso('Víspera: solo diagnóstico, una vez por cita; segunda reunión y «otro» no', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-08 11:00');
    contacto('c2', ['reunion-celebrada']); cita('a2', 'c2', '2026-10-08 12:00', { titulo: 'Segunda reunión · Ana' });
    contacto('c3', ['reunion-celebrada']); cita('a3', 'c3', '2026-10-08 13:00', { titulo: 'Diagnóstico (15 min)' });
    await rastreo();
    fijar('2026-10-07T16:30:00Z'); await R.vuelta('vispera'); await R.vuelta('vispera');
    const v = a('c1').filter(function (e) { return /Sigue en pie/.test(e.texto); });
    if (v.length !== 1) return 'vísperas c1 ' + v.length;
    if (a('c2').length || a('c3').length) return 'segunda/otro recibieron algo';
    return reg('c1', 'a1').reminder_sent_at.vispera ? true : 'no registrada';
  });
  await caso('Víspera tras mover la cita: la del día viejo no sale, la del nuevo sí (una)', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid']); cita('a1', 'c1', '2026-10-08 11:00');
    await rastreo(); avanzar(30); mover('a1', '2026-10-09 11:00'); await rastreo();
    fijar('2026-10-07T16:30:00Z'); await R.vuelta('vispera');
    if (a('c1').some(function (e) { return /Sigue en pie/.test(e.texto); })) return 'salió para el día viejo';
    fijar('2026-10-08T16:30:00Z'); await R.vuelta('vispera'); await R.vuelta('vispera');
    return a('c1').filter(function (e) { return /Sigue en pie/.test(e.texto); }).length === 1 ? true : 'vísperas ' + a('c1').length;
  });
  await caso('Trato en etapa desconocida o en Segunda reunión: el agente no lo baja a Conversación', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', []); OPS.c1 = { id: 'op-c1', pipelineStageId: ST.segunda };
    contacto('c2', []); OPS.c2 = { id: 'op-c2', pipelineStageId: ST.desconocida };
    const r1 = await T.mover('c1', 'conversacion'); const r2 = await T.mover('c2', 'conversacion');
    return OPS.c1.pipelineStageId === ST.segunda && OPS.c2.pipelineStageId === ST.desconocida ? true : JSON.stringify([r1, r2]);
  });
  await caso('Cita pasada sin cerrar: no se confirma ni bloquea la cadencia', async function () {
    fijar('2026-10-05T08:00:00Z');
    contacto('c1', ['paid', 'activacion']); cita('a0', 'c1', '2026-10-02 11:00', { reservada: '2026-10-01T13:00:00Z' });
    await rastreo();
    const ev = await CITA.primeraCita('c1');
    return !a('c1').length && !ev && C.c1.tags.indexOf('activacion') > -1 ? true : 'envíos ' + a('c1').length + ' ev ' + JSON.stringify(ev);
  });

  let fallos = 0;
  resultados.forEach(function (r) { if (r[0] !== 'OK ') fallos++; console.log(r[0] + ' · ' + r[1] + (r[2] ? '\n      → ' + r[2] : '')); });
  console.log('\n' + (resultados.length - fallos) + '/' + resultados.length + ' OK');
  process.exit(fallos ? 1 : 0);
})();
