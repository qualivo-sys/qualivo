// Simulación del nurturing por correo (api/_nurturing.js) contra un CRM falso.
// No toca GHL ni Resend. Uso: node herramientas/simular-nurturing.js
'use strict';
process.env.GHL_API_KEY = 'x'; process.env.GHL_LOCATION_ID = 'loc'; process.env.RESEND_API_KEY = 'x';
process.env.CANDADO_MS = '20'; process.env.NURTURING_DESDE = '2026-10-01T00:00:00Z';

const RealDate = Date;
let AHORA = RealDate.parse('2026-10-05T08:00:00Z');
global.Date = class extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(AHORA); }
  static now() { return AHORA; }
};
global.Date.UTC = RealDate.UTC; global.Date.parse = RealDate.parse;
const fijar = function (iso) { AHORA = RealDate.parse(iso); };

let C, correos;
function nuevo() { C = {}; correos = []; }
function sello(iso) { return new RealDate(iso).toISOString().replace(/[-:T]/g, '').slice(0, 12); }
function lead(id, tags, extra) {
  C[id] = Object.assign({ id: id, firstName: 'laura', companyName: 'Academia Delta', email: id + '@ejemplo.es', phone: '+34600000001', tags: tags.slice(), notes: [] }, extra || {});
}
const ok = function (b) { return Promise.resolve({ ok: true, status: 200, json: async () => b, text: async () => '' }); };
global.fetch = async function (url, opt) {
  url = String(url); opt = opt || {}; const met = opt.method || 'GET'; const body = opt.body ? JSON.parse(opt.body) : {};
  let m;
  if (url.indexOf('resend.com') > -1) { correos.push({ to: body.to[0], asunto: body.subject, html: body.html, paso: body.tags[0].value, t: AHORA }); return ok({ id: 'r' }); }
  if (url.indexOf('/contacts/search') > -1) {
    const tag = ((body.filters || [])[0] || {}).value;
    return ok({ contacts: (body.page || 1) === 1 ? Object.values(C).filter(function (c) { return c.tags.indexOf(tag) > -1; }).map(function (c) { return JSON.parse(JSON.stringify(c)); }) : [] });
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/tags$/))) {
    const c = C[m[1]];
    if (met === 'DELETE') c.tags = c.tags.filter(function (t) { return (body.tags || []).indexOf(t) === -1; });
    else (body.tags || []).forEach(function (t) { t = String(t).toLowerCase(); if (c.tags.indexOf(t) === -1) c.tags.push(t); });
    return ok({});
  }
  if ((m = url.match(/\/contacts\/([^/?]+)\/notes$/))) { C[m[1]].notes.push(body.body); return ok({}); }
  if ((m = url.match(/\/contacts\/([^/?]+)$/))) return ok({ contact: C[m[1]] ? JSON.parse(JSON.stringify(C[m[1]])) : null });
  return ok({});
};

const N = require('../api/_nurturing.js');
const de = function (id) { return correos.filter(function (x) { return x.to === id + '@ejemplo.es'; }); };
const resultados = [];
async function caso(nombre, fn) {
  nuevo();
  try { const r = await fn(); resultados.push([r === true ? 'OK ' : 'FALLO', nombre, r === true ? '' : r]); }
  catch (e) { resultados.push(['ERROR', nombre, e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e]); }
}
const formacion = function (iniIso, waIso) { return ['leadform', 'activacion', 'sector-formacion', 'act-ini-' + sello(iniIso)].concat(waIso ? ['act-wa1', 'act-wa1-h-' + sello(waIso)] : []); };

(async function () {
  await caso('Formación: alta, correo 0 a los 15 min del WhatsApp, una sola vez', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('l1', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:01:00Z'));
    await N.vuelta(); if (de('l1').length) return 'salió antes de tiempo';
    fijar('2026-10-05T08:17:00Z'); await Promise.all([N.vuelta(), N.vuelta()]); await N.vuelta();
    const e = de('l1'); if (e.length !== 1) return 'correos ' + e.length;
    if (!/^lo que vamos a mirar en Academia Delta$/.test(e[0].asunto) || !/Hola Laura:/.test(e[0].html) || !/En 30 minutos/.test(e[0].html)) return e[0].asunto;
    return C.l1.tags.indexOf('nut-on') > -1 && C.l1.tags.indexOf('nut-0') > -1 ? true : C.l1.tags.join(' ');
  });
  await caso('Lead de noche: el 0 espera al WhatsApp de las 8:00 y sale a las 8:15', async function () {
    fijar('2026-10-05T21:30:00Z'); lead('l1', formacion('2026-10-05T21:30:00Z'));
    await N.vuelta(); fijar('2026-10-06T05:00:00Z'); await N.vuelta(); if (de('l1').length) return 'salió de noche';
    C.l1.tags.push('act-wa1', 'act-wa1-h-' + sello('2026-10-06T06:00:00Z'));
    fijar('2026-10-06T06:16:00Z'); await N.vuelta();
    return de('l1').length === 1 ? true : 'correos ' + de('l1').length;
  });
  await caso('Secuencia completa: días 0, 2, 5, 8, 12 y 20, en horario laborable, y fin', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('l1', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z'));
    for (let h = 0; h < 24 * 24; h += 1) { fijar(new RealDate(RealDate.parse('2026-10-05T08:20:00Z') + h * 3600e3).toISOString()); await N.vuelta(); }
    const e = de('l1'); if (e.length !== 6) return 'correos ' + e.length;
    const dias = e.map(function (x) { return new RealDate(x.t).toISOString().slice(0, 13); });
    const malos = e.filter(function (x, i) { if (!i) return false; const d = new RealDate(x.t); const h = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', hourCycle: 'h23' }).format(d); const wd = d.getUTCDay(); return h < 9 || h >= 19 || wd === 0 || wd === 6; });
    if (malos.length) return 'fuera de horario: ' + dias.join(', ');
    return C.l1.tags.indexOf('nut-fin') > -1 && C.l1.tags.indexOf('nut-on') === -1 ? true : 'sin fin: ' + dias.join(', ');
  });
  await caso('Día 2 en sábado (y lunes 12-oct festivo): espera al martes a las 9:00', async function () {
    fijar('2026-10-08T08:00:00Z'); lead('l1', formacion('2026-10-08T08:00:00Z', '2026-10-08T08:00:00Z')); // jueves
    fijar('2026-10-08T08:20:00Z'); await N.vuelta();
    fijar('2026-10-10T10:00:00Z'); await N.vuelta(); if (de('l1').length !== 1) return 'salió en sábado';
    fijar('2026-10-12T07:10:00Z'); await N.vuelta(); if (de('l1').length !== 1) return 'salió el 12-oct (festivo)';
    fijar('2026-10-13T07:10:00Z'); await N.vuelta(); // martes 9:10
    return de('l1').length === 2 && de('l1')[1].paso === 'nut-formacion-1' ? true : 'correos ' + de('l1').length;
  });
  await caso('Mismo día que un WhatsApp de la cadencia: se aplaza', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('l1', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z'));
    fijar('2026-10-05T08:20:00Z'); await N.vuelta();
    C.l1.tags.push('act-wa3-h-' + sello('2026-10-07T07:30:00Z'));
    fijar('2026-10-07T09:00:00Z'); await N.vuelta(); if (de('l1').length !== 1) return 'salió el día del WhatsApp';
    fijar('2026-10-08T08:00:00Z'); await N.vuelta();
    return de('l1').length === 2 ? true : 'correos ' + de('l1').length;
  });
  await caso('Contesta o reserva: se para', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('l1', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z')); lead('l2', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z'));
    fijar('2026-10-05T08:20:00Z'); await N.vuelta();
    C.l1.tags.push('act-respondio'); C.l2.tags.push('act-cita-confirmada');
    fijar('2026-10-09T08:00:00Z'); await N.vuelta();
    return de('l1').length === 1 && de('l2').length === 1 && C.l1.tags.indexOf('nut-on') === -1 ? true : 'correos ' + de('l1').length + '/' + de('l2').length;
  });
  await caso('Bienvenida ya enviada o lead tardío: empieza por el 1', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('l1', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z').concat(['act-email0']));
    lead('l2', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z'));
    fijar('2026-10-05T11:30:00Z'); await N.vuelta();
    if (de('l1').length || de('l2').length) return 'mandó el 0';
    return C.l1.tags.indexOf('nut-0') > -1 && C.l2.tags.indexOf('nut-0') > -1 ? true : 'no saltó';
  });
  await caso('Reformas, sin correo y leads antiguos: nada', async function () {
    fijar('2026-10-05T08:00:00Z');
    lead('r1', ['leadform', 'activacion', 'sector-reformas', 'act-ini-' + sello('2026-10-05T08:00:00Z'), 'act-wa1']);
    lead('s1', formacion('2026-10-05T08:00:00Z', '2026-10-05T08:00:00Z'), { email: '' });
    lead('v1', formacion('2026-09-20T08:00:00Z', '2026-09-20T08:00:00Z'));
    fijar('2026-10-05T08:20:00Z'); await N.vuelta();
    return correos.length === 0 && N.sustituyeBienvenida('Formación o academia') && N.sustituyeBienvenida('Salud, clínica o bienestar') && !N.sustituyeBienvenida('Reformas, construcción o instalaciones') ? true : 'correos ' + correos.length;
  });
  await caso('Sin nombre ni empresa: «Hola:» y «vuestro centro»; clínicas compone su texto', async function () {
    const m = N.componer('formacion', 0, { firstName: '', companyName: '' });
    const k = N.componer('clinicas', 2, { firstName: 'Javier', companyName: 'Dentotec <x>' });
    if (!/Hola:/.test(m.html) || m.asunto !== 'lo que vamos a mirar en vuestro centro') return m.asunto;
    return /Hola Javier:/.test(k.html) && /Nuria Roure/.test(k.html) && !/\{\{/.test(k.html + m.html) ? true : 'clínicas';
  });

  await caso('Clínicas: correo 0 con su texto', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('c1', ['leadform', 'activacion', 'sector-clinicas', 'act-ini-' + sello('2026-10-05T08:00:00Z'), 'act-wa1', 'act-wa1-h-' + sello('2026-10-05T08:00:00Z')], { companyName: 'Dentotec' });
    fijar('2026-10-05T08:20:00Z'); await N.vuelta();
    const e = de('c1'); return e.length === 1 && e[0].paso === 'nut-clinicas-0' && /pregunta por un tratamiento/.test(e[0].html) ? true : JSON.stringify(e.map(function (x) { return x.paso; }));
  });
  await caso('Prueba: nut-prueba manda los 12 a Maikel una sola vez y nada al contacto', async function () {
    fijar('2026-10-05T08:00:00Z'); lead('m1', ['nut-prueba'], { email: 'otro@ejemplo.es' });
    await Promise.all([N.vuelta(), N.vuelta()]); await N.vuelta();
    const a = correos.filter(function (x) { return x.to === 'maikel@qualivo.io'; });
    return a.length === 12 && correos.length === 12 && /^\[Prueba · Clínicas · día 20\] /.test(a[11].asunto) ? true : 'correos ' + correos.length + ' ' + (a[0] || {}).asunto;
  });
  let fallos = 0;
  resultados.forEach(function (r) { if (r[0] !== 'OK ') fallos++; console.log(r[0] + ' · ' + r[1] + (r[2] ? '\n      → ' + r[2] : '')); });
  console.log('\n' + (resultados.length - fallos) + '/' + resultados.length + ' OK');
  process.exit(fallos ? 1 : 0);
})();
