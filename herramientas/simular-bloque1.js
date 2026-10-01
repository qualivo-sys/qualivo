// Simulación del Bloque 1 (speed-to-lead) contra un CRM falso en memoria.
// No toca GHL, Meta, Vapi ni Anthropic: intercepta fetch y el reloj.
// Uso: node herramientas/simular-bloque1.js
'use strict';
process.env.GHL_API_KEY = 'x'; process.env.GHL_LOCATION_ID = 'loc'; process.env.CRON_SECRET = 's';
process.env.ANTHROPIC_API_KEY = 'x'; process.env.RESEND_API_KEY = 'x'; process.env.VAPI_API_KEY = 'x'; process.env.VAPI_ASSISTANT_ID = 'x';
process.env.ENRIQUECER = '0'; process.env.CANDADO_MS = '30'; process.env.WA_AGENTE_ESPERA_MS = '0'; process.env.GATEWAY_MAX_DIA = '999';

// ---- Reloj falso ----
const RealDate = Date;
let AHORA = RealDate.parse('2026-10-02T09:00:00Z');
global.Date = class extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(AHORA); }
  static now() { return AHORA; }
};
global.Date.UTC = RealDate.UTC; global.Date.parse = RealDate.parse;
const fijar = function (iso) { AHORA = RealDate.parse(iso); };
const avanzar = function (min) { AHORA += min * 60000; };
const realSetTimeout = setTimeout;

// ---- CRM falso ----
let C = {}; let enviados = []; let llamadas = []; let tareas = []; let avisosMovil = []; let seq = 0;
const MOVIL = 'DgkPLaw6fzy4z1bs8HsB';
function nuevoCRM() { C = {}; enviados = []; llamadas = []; tareas = []; avisosMovil = []; }
function contacto(id, o) {
  C[id] = Object.assign({ id: id, firstName: o.nombre || 'Laura', companyName: o.empresa || 'Academia Delta', phone: '+34600000' + String(Object.keys(C).length).padStart(3, '0'),
    email: id + '@ejemplo.es', tags: [], notes: [], msgs: [], dateAdded: new RealDate(AHORA).toISOString(), customFields: [] }, o.extra || {});
  C[id].tags = o.tags.slice(); return C[id];
}
function msg(id, dir, body, extra) {
  C[id].msgs.push(Object.assign({ id: 'm' + (++seq), direction: dir, body: body, messageType: 'TYPE_CUSTOM_SMS', conversationProviderId: '67ad23a0cf352d8f5809f0ca', status: 'delivered', dateAdded: new RealDate(AHORA).toISOString() }, extra || {}));
}
const ok = function (b) { return Promise.resolve({ ok: true, status: 200, json: async () => b, text: async () => JSON.stringify(b) }); };
global.fetch = async function (url, opt) {
  url = String(url); opt = opt || {}; const met = opt.method || 'GET'; const body = opt.body ? JSON.parse(opt.body) : {};
  let m;
  if (url.indexOf('api.anthropic.com') > -1) {
    const sys = String(body.system || '');
    if (/primer WhatsApp que Maikel/.test(sys)) {
      const arr = /Anoche nos dejaste|Esta mañana nos dejaste/.test(sys) ? (sys.match(/Exactamente: «([^»]+)»/) || [])[1] : /acabas de dejarnos/.test(sys) ? (sys.match(/Exactamente: «([^»]+)»/) || [])[1] : 'Hola Laura, soy Maikel, de Qualivo. Imagino que estarás liada, así que te cuento por aquí.';
      const op = (sys.match(/exactamente: «(¿Te viene mejor [^»]+)»/) || [])[1] || '¿Te viene mejor esta tarde o mañana por la tarde?';
      const txt = arr.replace('[nombre]', 'Laura') + '\n\n' + 'Comentabas que cuesta responder rápido cuando entra un contacto nuevo, y es algo que vemos bastante en formación: alguien pregunta por un curso y la respuesta se retrasa hasta el día siguiente, cuando ya ha preguntado en otro sitio. '.repeat(1) +
        '\n\nNosotros trabajamos justo ese recorrido: que cada persona tenga una respuesta rápida y un siguiente paso, y que el seguimiento se haga solo cuando tenga sentido.\n\nEn la llamada dibujamos vuestro recorrido actual y te enseño cómo lo resolveríamos en Academia Delta.\n\n' + op;
      return ok({ content: [{ type: 'text', text: txt }] });
    }
    // agente de WhatsApp: si el lead pide descuento, escala; si no, contesta
    const ultimo = JSON.stringify(body.messages || []).toLowerCase();
    if (/descuento/.test(ultimo) && !/tool_result/.test(ultimo)) return ok({ content: [{ type: 'tool_use', id: 't1', name: 'pasar_a_maikel', input: { motivo: 'pide descuento' } }] });
    if (/tool_result/.test(ultimo)) return ok({ content: [{ type: 'text', text: 'Esto prefiero mirarlo con calma; te digo algo en cuanto pueda.' }] });
    return ok({ content: [{ type: 'text', text: 'Perfecto, gracias. ¿Cuántas solicitudes os llegan a la semana, más o menos?' }] });
  }
  if (url.indexOf('api.vapi.ai') > -1) { llamadas.push({ t: AHORA, body: body }); return ok({ id: 'call' + llamadas.length }); }
  if (url.indexOf('resend.com') > -1 || url.indexOf('graph.facebook.com') > -1) return ok({ id: 'x' });
  if (url.indexOf('/contacts/search') > -1) {
    const tag = ((body.filters || [])[0] || {}).value; const pag = body.page || 1;
    const l = Object.values(C).filter(function (c) { return c.tags.indexOf(tag) > -1; });
    return ok({ contacts: pag === 1 ? l.map(function (c) { return JSON.parse(JSON.stringify(c)); }) : [] });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/tags$/))) {
    const c = C[m[1]]; if (!c) return ok({});
    if (met === 'DELETE') c.tags = c.tags.filter(function (t) { return (body.tags || []).indexOf(t) === -1; });
    else (body.tags || []).forEach(function (t) { t = String(t).toLowerCase(); if (c.tags.indexOf(t) === -1) c.tags.push(t); });
    return ok({ tags: c.tags });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/notes$/))) {
    const c = C[m[1]]; if (!c) return ok({ notes: [] });
    if (met === 'POST') { c.notes.push({ body: body.body, dateAdded: new RealDate(AHORA).toISOString() }); return ok({}); }
    return ok({ notes: c.notes });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/tasks$/))) { tareas.push({ id: m[1], t: body }); return ok({ id: 'task' }); }
  if ((m = url.match(/\/contacts\/([^/?]+)\/appointments$/))) return ok({ events: [] });
  if ((m = url.match(/\/contacts\/([^/?]+)$/))) { const c = C[m[1]]; return ok({ contact: c ? JSON.parse(JSON.stringify(c)) : null }); }
  if (url.indexOf('/conversations/search') > -1) { const id = (url.match(/contactId=([^&]+)/) || [])[1]; return ok({ conversations: C[id] ? [{ id: 'conv-' + id }] : [] }); }
  if ((m = url.match(/\/conversations\/conv-([^/]+)\/messages/))) return ok({ messages: { messages: (C[m[1]] || { msgs: [] }).msgs } });
  if (url.match(/\/conversations\/messages$/) && met === 'POST') {
    if (body.contactId === MOVIL) { avisosMovil.push({ t: AHORA, texto: body.message }); return ok({ messageId: 'mv' }); }
    enviados.push({ id: body.contactId, t: AHORA, texto: body.message, tipo: body.type });
    msg(body.contactId, 'outbound', body.message);
    return ok({ messageId: 'm' + seq });
  }
  if (url.indexOf('/conversations/messages/') > -1) return ok({ message: { status: 'delivered' } });
  if (url.indexOf('/free-slots') > -1) return ok({});
  if (url.indexOf('/opportunities') > -1 || url.indexOf('/calendars/events') > -1) return ok({ opportunities: [], events: [] });
  return ok({});
};

const A = require('../api/_activacion.js');
const activacion = require('../api/activacion.js');
const reloj = require('../api/wa-agente-reloj.js');
const AGENTE = require('../api/_agente.js');
const H = require('../api/_horario.js');

const resp = function () { return { status: function () { return { json: function (j) { return j; } }; } }; };
const req = { headers: { authorization: 'Bearer s' } };
async function cron() { return activacion(req, resp()); }
async function cronAgente() { return reloj(req, resp()); }
const enviadosA = function (id) { return enviados.filter(function (e) { return e.id === id; }); };
const tieneTag = function (id, re) { return C[id].tags.some(function (t) { return re.test(t); }); };

// Lead B: formación, invierte 500-2000, 20-50 solicitudes, «tiempo de respuesta», con empresa.
const TAGS_B = ['paid', 'leadform', 'activacion', 'sector-formacion', 'inv-entre-500-y-2-000', 'vol-20-50', 'fuga-en-el-tiempo-de-respuesta-al'];
const TAGS_C = ['paid', 'leadform', 'activacion', 'sector-formacion', 'inv-menos-de-500', 'vol-menos20', 'fuga-no-lo-se-eso-es-lo-que-quiero'];
function entrar(id, tags) { contacto(id, { tags: tags.concat(['act-ini-' + H.sello()]) }); }

const resultados = [];
async function caso(nombre, fn) {
  nuevoCRM();
  try { const r = await fn(); resultados.push([r === true ? 'OK ' : 'FALLO', nombre, r === true ? '' : r]); }
  catch (e) { resultados.push(['ERROR', nombre, e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e]); }
}
const md = function (ms) { return new RealDate(ms).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }); };

(async function () {
  // 1. A/B en supervisión, Maikel no interviene → sale solo a los 10 min, una vez.
  await caso('A/B en supervisión sin intervención: sale solo a los 10 min', async function () {
    fijar('2026-10-02T08:00:00Z'); // vie 10:00
    entrar('b1', TAGS_B);
    const r = await A.primerWhatsAppCompleto('b1', C.b1.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead', origen: 'leadform' });
    if (r.canal !== 'espera_maikel') return 'no retuvo: ' + JSON.stringify(r);
    if (!avisosMovil.some(function (a) { return /Sale automáticamente a las 10:10 si no haces nada/.test(a.texto); })) return 'aviso sin hora: ' + JSON.stringify(avisosMovil.map(function (a) { return a.texto.slice(0, 80); }));
    avanzar(4); await cronAgente(); if (enviadosA('b1').length) return 'salió antes de tiempo';
    avanzar(6); await cronAgente(); await cron();
    const e = enviadosA('b1');
    if (e.length !== 1) return 'envíos: ' + e.length;
    if (!tieneTag('b1', /^act-wa1-modo-auto10$/) || tieneTag('b1', /^act-espera-maikel/)) return 'etiquetas: ' + C.b1.tags.join(' ');
    avanzar(2); await cronAgente(); await cron(); if (enviadosA('b1').length !== 1) return 'doble envío';
    return true;
  });
  // 2. A/B en supervisión y Maikel escribe antes → no sale el automático.
  await caso('A/B en supervisión, Maikel escribe antes: no sale el automático', async function () {
    fijar('2026-10-02T08:00:00Z');
    entrar('b2', TAGS_B);
    await A.primerWhatsAppCompleto('b2', C.b2.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead' });
    avanzar(3); msg('b2', 'outbound', 'Hola Laura, soy Maikel. Te escribo yo directamente…', { userId: 'maikel' });
    avanzar(8); await cronAgente(); await cron();
    if (enviados.filter(function (e) { return e.id === 'b2'; }).length) return 'salió el automático';
    if (!tieneTag('b2', /^act-wa1-modo-humano$/) || !tieneTag('b2', /^act-wa1$/)) return 'etiquetas: ' + C.b2.tags.join(' ');
    return true;
  });
  // 3. wa1-cancelar.
  await caso('wa1-cancelar: no sale nada y se para la cadencia', async function () {
    fijar('2026-10-02T08:00:00Z');
    entrar('b3', TAGS_B);
    await A.primerWhatsAppCompleto('b3', C.b3.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead' });
    avanzar(2); C.b3.tags.push('wa1-cancelar');
    avanzar(10); await cronAgente(); await cron(); avanzar(200); await cron();
    if (enviadosA('b3').length) return 'salió';
    if (!tieneTag('b3', /^act-wa1-cancelado$/) || tieneTag('b3', /^activacion$/)) return 'etiquetas: ' + C.b3.tags.join(' ');
    return true;
  });
  // 4. A/B fuera de supervisión pero en hora de WhatsApp (vie 20:00) → al momento, arranque «fuera».
  await caso('A/B fuera de supervisión (vie 20:00): sale al momento', async function () {
    fijar('2026-10-02T18:00:00Z');
    entrar('b4', TAGS_B);
    const r = await A.primerWhatsAppCompleto('b4', C.b4.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead' });
    const e = enviadosA('b4');
    if (e.length !== 1) return 'envíos ' + e.length + ' ' + JSON.stringify(r);
    if (!/acabas de dejarnos tus datos/.test(e[0].texto)) return 'arranque: ' + e[0].texto.slice(0, 120);
    if (!tieneTag('b4', /^wa1-ctx-fuera$/) || !tieneTag('b4', /^act-wa1-modo-auto$/)) return 'etiquetas: ' + C.b4.tags.join(' ');
    return true;
  });
  // 5. 21:29 sale; 21:31 se programa para las 8:00 con quiet_hours y sale con «Anoche».
  await caso('Lead a las 21:29: sale', async function () {
    fijar('2026-10-01T19:29:00Z'); entrar('n1', TAGS_C);
    await A.primerWhatsAppCompleto('n1', C.n1.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé, eso es lo que quiero averiguar' });
    return enviadosA('n1').length === 1 ? true : 'no salió';
  });
  await caso('Lead a las 21:31: programado 8:00, sale «Anoche…» una sola vez', async function () {
    fijar('2026-10-01T19:31:00Z'); entrar('n2', TAGS_C);
    const r = await A.primerWhatsAppCompleto('n2', C.n2.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé, eso es lo que quiero averiguar' });
    if (r.motivo !== 'quiet_hours' || enviadosA('n2').length) return 'salió de noche';
    const prog = C.n2.tags.filter(function (t) { return /^act-wa1-prog-/.test(t); })[0];
    if (!prog || md(H.msDeSello(prog)) !== '2/10/2026, 8:00:00' || !tieneTag('n2', /^act-wa1-motivo-quiet$/)) return 'programación: ' + prog;
    for (let i = 0; i < 6; i++) { avanzar(90); await cron(); }   // pasa la noche
    if (enviadosA('n2').length) return 'salió antes de las 8: ' + md(enviadosA('n2')[0].t);
    fijar('2026-10-02T06:00:00Z'); await cron(); fijar('2026-10-02T06:10:00Z'); await cron();
    const e = enviadosA('n2');
    if (e.length !== 1) return 'envíos ' + e.length;
    if (!/Anoche nos dejaste tus datos/.test(e[0].texto)) return 'arranque: ' + e[0].texto.slice(0, 100);
    return true;
  });
  // 6. Lead nocturno A/B a las 3:00 de un martes → 8:00 está fuera de supervisión → sale sin esperar.
  await caso('A/B nocturno (mar 3:00): a las 8:00 sale sin retener', async function () {
    fijar('2026-10-06T01:00:00Z'); entrar('n3', TAGS_B);
    await A.primerWhatsAppCompleto('n3', C.n3.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead' });
    fijar('2026-10-06T06:00:00Z'); await cron();
    const e = enviadosA('n3');
    if (e.length !== 1 || tieneTag('n3', /^act-espera-maikel$/)) return 'envíos ' + e.length + ' ' + C.n3.tags.join(' ');
    return /Anoche nos dejaste|Esta mañana nos dejaste/.test(e[0].texto) ? true : 'arranque: ' + e[0].texto.slice(0, 100);
  });
  // 7-9. Sábado, domingo y festivo: WA al momento sin retención; Raquel no llama y se programa.
  for (const [nombre, iso, sigVoz] of [['sábado 12:00', '2026-10-03T10:00:00Z', '5/10/2026, 9:30:00'], ['domingo 12:00', '2026-10-04T10:00:00Z', '5/10/2026, 9:30:00'], ['festivo 12-oct 12:00', '2026-10-12T10:00:00Z', '13/10/2026, 9:30:00']]) {
    await caso('A/B en ' + nombre + ': WA al momento, Raquel programada para ' + sigVoz, async function () {
      fijar(iso); entrar('w1', TAGS_B);
      await A.primerWhatsAppCompleto('w1', C.w1.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead' });
      if (enviadosA('w1').length !== 1 || tieneTag('w1', /^act-espera-maikel$/)) return 'WA: ' + enviadosA('w1').length;
      // nivel C para que toque Raquel: quitamos inversión
      C.w1.tags = C.w1.tags.filter(function (t) { return !/^inv-/.test(t); }).concat(['inv-menos-de-500']);
      avanzar(151); await cron();
      if (llamadas.length) return 'llamó en ' + nombre;
      const prog = C.w1.tags.filter(function (t) { return /^act-voz1-prog-/.test(t); })[0];
      if (!prog) return 'sin programar: ' + C.w1.tags.join(' ');
      if (md(H.msDeSello(prog)) !== sigVoz) return 'programada para ' + md(H.msDeSello(prog));
      fijar(new RealDate(H.msDeSello(prog)).toISOString()); await cron();
      return llamadas.length === 1 ? true : 'llamadas al llegar la ventana: ' + llamadas.length;
    });
  }
  // 10. Respuesta del lead fuera de supervisión: el agente contesta solo; si pide descuento, escala con tarea.
  await caso('Responde el sábado: el agente contesta solo', async function () {
    fijar('2026-10-03T10:00:00Z'); entrar('r1', TAGS_C);
    await A.primerWhatsAppCompleto('r1', C.r1.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé' });
    avanzar(20); msg('r1', 'inbound', 'Hola, pues unas 30 al mes', { messageType: 'TYPE_CUSTOM_SMS' });
    const h = await AGENTE.atender('r1');
    if (h.accion !== 'responder' || enviadosA('r1').length !== 2) return JSON.stringify(h) + ' envíos ' + enviadosA('r1').length;
    return true;
  });
  await caso('Responde el sábado pidiendo descuento: escala, tarea para el lunes 9:00', async function () {
    fijar('2026-10-03T10:00:00Z'); entrar('r2', TAGS_C);
    await A.primerWhatsAppCompleto('r2', C.r2.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé' });
    avanzar(20); msg('r2', 'inbound', '¿Me haríais descuento si empezamos ya?');
    const h = await AGENTE.atender('r2');
    const t = tareas.filter(function (x) { return x.id === 'r2'; })[0];
    if (h.accion !== 'pasar' || !t) return JSON.stringify(h);
    if (md(RealDate.parse(t.t.dueDate)) !== '5/10/2026, 9:00:00') return 'vence ' + md(RealDate.parse(t.t.dueDate));
    if (!/prefiero mirarlo con calma/.test(enviadosA('r2').slice(-1)[0].texto)) return 'puente: ' + enviadosA('r2').slice(-1)[0].texto;
    return true;
  });
  await caso('Respuesta a las 23:00: no contesta de noche, sí a las 8:00', async function () {
    fijar('2026-10-02T19:00:00Z'); entrar('r3', TAGS_C);
    await A.primerWhatsAppCompleto('r3', C.r3.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé' });
    fijar('2026-10-02T21:00:00Z'); msg('r3', 'inbound', 'Hola, unas 20 al mes');
    const h1 = await AGENTE.atender('r3'); if (h1.accion !== 'callar') return 'contestó de noche';
    fijar('2026-10-03T06:02:00Z');
    // el reloj de 8:00 debe mirar las de la noche
    const orig = global.fetch;
    global.fetch = async function (url, opt) {
      if (String(url).indexOf('/conversations/search?locationId=loc&limit') > -1) return ok({ conversations: [{ contactId: 'r3', lastMessageDirection: 'inbound', lastMessageDate: RealDate.parse('2026-10-02T21:00:00Z'), lastMessageType: 'TYPE_CUSTOM_SMS' }] });
      return orig(url, opt);
    };
    await cronAgente(); global.fetch = orig;
    return enviadosA('r3').length === 2 ? true : 'envíos ' + enviadosA('r3').length;
  });
  // 11. Doble ejecución del job y carrera webhook + rescate.
  await caso('Webhook + rescate + reloj a la vez: un solo WhatsApp', async function () {
    fijar('2026-10-02T18:00:00Z'); entrar('c1', TAGS_C);
    const d = { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé' };
    const rs = await Promise.all([A.primerWhatsAppCompleto('c1', C.c1.phone, d), A.primerWhatsAppCompleto('c1', C.c1.phone, d), cron()]);
    return enviadosA('c1').length === 1 ? true : 'envíos ' + enviadosA('c1').length + ' ' + JSON.stringify(rs.slice(0, 2).map(function (x) { return x && (x.motivo || x.canal); }));
  });
  await caso('Doble reloj de salida a los 10 min a la vez: un solo WhatsApp', async function () {
    fijar('2026-10-02T08:00:00Z'); entrar('c2', TAGS_B);
    await A.primerWhatsAppCompleto('c2', C.c2.phone, { nombre: 'Laura', sector: 'Formación o academia', fuga: 'En el tiempo de respuesta al lead' });
    avanzar(11);
    await Promise.all([cronAgente(), cron(), A.soltarRetenidos()]);
    return enviadosA('c2').length === 1 ? true : 'envíos ' + enviadosA('c2').length;
  });
  // 12. Cambio de hora (25-oct-2026, 3:00 → 2:00): lead a las 23:00 del 24 sale a las 8:00 de invierno.
  await caso('Cambio de hora: lead sáb 24-oct 23:00 sale dom 25-oct 8:00 (UTC 7:00)', async function () {
    fijar('2026-10-24T21:00:00Z'); entrar('d1', TAGS_C);
    await A.primerWhatsAppCompleto('d1', C.d1.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé' });
    fijar('2026-10-25T06:30:00Z'); await cron(); if (enviadosA('d1').length) return 'salió a las 7:30 hora local';
    fijar('2026-10-25T07:00:00Z'); await cron();
    return enviadosA('d1').length === 1 ? true : 'no salió a las 8:00 de invierno';
  });
  // 13. Retenido antiguo sin sello (Anna): se sella y no se envía de golpe.
  await caso('Retenido de antes (sin sello): no sale de golpe, empieza a contar', async function () {
    fijar('2026-10-02T08:00:00Z'); entrar('v1', TAGS_B.concat(['act-espera-maikel']));
    await A.soltarRetenidos(); if (enviadosA('v1').length || !tieneTag('v1', /^act-espera-maikel-h-/)) return 'mal';
    return true;
  });
  await caso('Retenido de antes que ya tenía WhatsApp (Anna): solo se limpia', async function () {
    fijar('2026-10-02T08:00:00Z'); entrar('v2', TAGS_B.concat(['act-espera-maikel', 'act-wa1']));
    await A.soltarRetenidos();
    return (!enviadosA('v2').length && !tieneTag('v2', /^act-espera-maikel$/)) ? true : 'mal';
  });
  // 15. C/D en supervisión: sale al momento, sin esperar.
  await caso('C/D en supervisión (vie 10:00): sale al momento', async function () {
    fijar('2026-10-02T08:00:00Z'); entrar('k1', TAGS_C);
    await A.primerWhatsAppCompleto('k1', C.k1.phone, { nombre: 'Jorge', sector: 'Formación o academia', fuga: 'No lo sé' });
    return (enviadosA('k1').length === 1 && tieneTag('k1', /^wa1-ctx-supervision$/)) ? true : 'envíos ' + enviadosA('k1').length;
  });
  // 16. Clasificación con las respuestas reales de los últimos leads de Meta.
  await caso('Clasificación con respuestas reales (Anna → B, Izaskun → D, Antonio reformas → B)', async function () {
    const S = require('../api/_scoring.js'); const niv = function (tags) { const c = { tags: tags, companyName: 'X' }; return S.nivel(S.tipologia(c).puntos, S.comportamiento(c, []).puntos, c); };
    const a = niv(['sector-formacion', 'inv-mas-de-5-000', 'vol-50-100', 'fuga-no-lo-se-eso-es-lo-que-quiero']);
    const i = niv(['sector-formacion', 'inv-menos-de-500', 'vol-menos20', 'fuga-no-lo-se-eso-es-lo-que-quiero']);
    const t = niv(['sector-reformas', 'inv-entre-500-y-2-000', 'vol-15-30', 'fuga-en-el-seguimiento-y-los-pre']);
    return (a === 'B' && i === 'D' && t === 'B') ? true : [a, i, t].join(' ');
  });
  // 14. Textos: corto y largo con el arranque del contexto; corto entre 40 y 60 palabras.
  await caso('Las 45 combinaciones del corto (15 × 3 arranques): máximo 60 palabras y una sola pregunta', async function () {
    const M = require('../api/_mensajes.js'); const malos = []; let minimo = 999, maximo = 0;
    for (const s of ['Formación o academia', 'Salud, clínica o bienestar', 'Servicios profesionales'])
      for (const f of ['En el tiempo de respuesta al lead', 'En el seguimiento y los presupuestos', 'En los anuncios y la captación', 'En la web y los formularios', 'No lo sé'])
        for (const ctx of [{ ctx: 'supervision' }, { ctx: 'fuera' }, { ctx: 'noche', cuando: 'anoche' }]) {
          const t = M.whatsappCorto({ nombre: 'Laura', sector: s, fuga: f }, ctx); const n = t.split(/\s+/).length;
          if (n > 60 || (t.match(/\?/g) || []).length !== 1) malos.push(n + ' ' + t); minimo = Math.min(minimo, n); maximo = Math.max(maximo, n);
        }
    console.log('Palabras del corto: de ' + minimo + ' a ' + maximo);
    return malos.length ? malos.join('\n') : true;
  });

  console.log('\nRESULTADOS');
  resultados.forEach(function (r) { console.log(r[0], '·', r[1], r[2] ? '\n      → ' + r[2] : ''); });
  console.log('\n' + resultados.filter(function (r) { return r[0] === 'OK '; }).length + ' de ' + resultados.length + ' correctos');
})();
