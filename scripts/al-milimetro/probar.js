// Pruebas de Al Milímetro: modelo, receptor, botones, cron e Intelligence contra un Postgres real.
// Necesita un Postgres local y el paquete «pg» (solo para el emulador del endpoint /sql de Neon):
//   PG_URL=postgres://am@localhost:5544/postgres NODE_PATH=/ruta/node_modules node scripts/al-milimetro/probar.js
// Los correos no salen: se captura la llamada a Resend.
const assert = require('assert');
const http = require('http');
const path = require('path');
const { Client } = require('pg');
const API = path.join(__dirname, '../../api/');
const M = require(API + '_am-modelo.js');

let ok = 0;
const t = async function (n, f) { await f(); ok++; console.log('✓ ' + n); };
const correos = [];

(async function () {
  // ---------- Modelo ----------
  await t('descartes', function () {
    assert.equal(M.descarte({ tipo: 'local' }), 'tipo');
    assert.equal(M.descarte({ tipo: 'suelto', cp: '28010' }), 'suelto');
    assert.equal(M.descarte({ tipo: 'piso', cp: '28905' }), 'zona');
    assert.equal(M.descarte({ tipo: 'piso', cp: '28010', inst: 'acab' }), 'acab');
    assert.equal(M.descarte({ tipo: 'piso', cp: '28010' }), null);
  });
  await t('puntuación A/B/C y techo', function () {
    assert.ok(M.MAXIMO >= M.UMBRAL_A);
    assert.equal(M.puntuar({ tipo: 'piso', cp: '28010', ppto: '30-60', cuando: '3', propia: 'si' }).clase, 'A');
    assert.equal(M.puntuar({ tipo: 'cb', cp: '28010', ppto: '15-30', cuando: '6', propia: 'si' }).clase, 'B');
    assert.equal(M.puntuar({ tipo: 'piso', cp: '28100', ppto: 'nose', cuando: 'mirando', propia: 'no' }).clase, 'C');
  });

  // ---------- Postgres limpio y emulador del endpoint /sql de Neon ----------
  const admin = new Client({ connectionString: process.env.PG_URL });
  await admin.connect();
  await admin.query('DROP DATABASE IF EXISTS amtest');
  await admin.query('CREATE DATABASE amtest');
  await admin.end();
  const pg = new Client({ connectionString: process.env.PG_URL.replace(/\/[^/]*$/, '/amtest') });
  await pg.connect();
  const emu = http.createServer(function (req, res) {
    let b = ''; req.on('data', function (x) { b += x; });
    req.on('end', async function () {
      try {
        const q = JSON.parse(b);
        const r = await pg.query({ text: q.query, values: q.params, rowMode: undefined });
        // Como Neon con salida en texto: todo valor viaja como texto (json incluido)
        const rows = (r.rows || []).map(function (row) { const o = {}; Object.keys(row).forEach(function (k) { const v = row[k]; o[k] = v === null ? null : typeof v === 'object' ? JSON.stringify(v) : String(v); }); return o; });
        res.end(JSON.stringify({ rows: rows, rowCount: r.rowCount, command: r.command }));
      } catch (e) { res.statusCode = 400; res.end(JSON.stringify({ message: e.message })); }
    });
  });
  await new Promise(function (ok2) { emu.listen(8770, ok2); });

  const fetchReal = global.fetch;
  let resendFalla = false;
  global.fetch = async function (url, o) {
    if (/api\.resend\.com/.test(url)) {
      if (resendFalla) return { ok: false, status: 500, text: async function () { return 'caído'; } };
      const c = JSON.parse(o.body); correos.push(c);
      return { ok: true, status: 200, text: async function () { return JSON.stringify({ id: 'r' + correos.length }); } };
    }
    return fetchReal(url, o);
  };
  Object.assign(process.env, {
    AM_DATABASE_URL: 'postgres://am@ep-prueba.local/amtest', AM_DB_HTTP: 'http://localhost:8770/sql', RESEND_API_KEY: 'x',
    AM_AVISO_TO: 'avisos@qualivo.io', AM_LINK_SECRET: 'secreto-de-prueba', AM_SOLO_PRUEBA: '1', CRON_SECRET: 'cron', AM_BASE_URL: 'https://preview.qualivo.io', INTELLIGENCE_CLAVE_AM: 'clave'
  });
  const lead = require(API + 'al-milimetro-lead.js'), accion = require(API + 'al-milimetro-accion.js'), cron = require(API + 'al-milimetro-cron.js'), intel = require(API + 'intelligence-almilimetro.js');
  const llamar = async function (h, req) {
    let out = { headers: {} };
    const res = { statusCode: 200, status: function (s) { this.statusCode = s; return this; }, json: function (j) { out = Object.assign(out, { status: this.statusCode, json: j }); }, setHeader: function (k, v) { out.headers[k] = v; }, end: function (b) { out = Object.assign(out, { status: this.statusCode, body: b }); } };
    await h(Object.assign({ method: 'GET', query: {}, headers: {} }, req), res); return out;
  };
  const q = async function (s, p) { return (await pg.query(s, p)).rows; };
  const base = { nombre: 'PRUEBA QUALIVO Laura', tel: '600 000 000', email: 'prueba@qualivo.io', rgpd: true, tipo: 'piso', cp: '28010', mun: 'Chamberí', m2: '80-120', cuando: '3', ppto: '30-60', propia: 'si', a: 'pared', utm: { utm_source: 'meta' } };

  // ---------- Receptor ----------
  await t('descartado: no guarda nada', async function () {
    const r = await llamar(lead, { method: 'POST', body: Object.assign({}, base, { tipo: 'local' }) });
    assert.equal(r.json.descartado, 'tipo');
  });
  await t('solo prueba: un lead real no se guarda', async function () {
    const r = await llamar(lead, { method: 'POST', body: Object.assign({}, base, { nombre: 'Laura' }) });
    assert.equal(r.json.modo, 'solo_prueba');
    assert.equal((await q("SELECT to_regclass('am_leads') AS t"))[0].t, null);
  });
  let idA;
  await t('lead de prueba A: se guarda, E1 al lead y aviso a Sonia con WhatsApp y botones', async function () {
    const r = await llamar(lead, { method: 'POST', body: base });
    assert.equal(r.json.ok, true); assert.equal(r.json.clase, 'A');
    const l = (await q('SELECT * FROM am_leads'))[0]; idA = l.id;
    assert.equal(l.telefono, '+34600000000'); assert.equal(l.origen, 'pared'); assert.equal(l.etapa, 'nuevo'); assert.equal(l.prueba, true); assert.deepEqual(l.utm, { utm_source: 'meta' });
    assert.ok(l.motivos.length >= 4);
    const env = await q('SELECT paso, estado FROM am_envios ORDER BY paso');
    assert.deepEqual(env.map(function (e) { return e.paso + ':' + e.estado; }), ['AVISO:enviado', 'E1:enviado', 'E2:pendiente', 'E3:pendiente', 'E4:pendiente', 'W5:pendiente', 'W6:pendiente']);
    const e1 = correos.find(function (c) { return c.to === 'prueba@qualivo.io'; });
    assert.equal(e1.subject, 'Lo que pasa ahora con tu reforma'); assert.ok(e1.headers['List-Unsubscribe']);
    const av = correos.find(function (c) { return c.to === 'avisos@qualivo.io'; });
    assert.ok(/^\[PRUEBA\] 🟢 Contacto A/.test(av.subject), av.subject);
    assert.ok(av.html.indexOf('https://wa.me/34600000000?text=') > -1);
    assert.ok(av.html.indexOf('/api/al-milimetro-accion?l=' + idA + '&amp;a=visita&amp;f=') > -1);
  });
  await t('segundas preguntas: clase y W3 en el aviso', async function () {
    correos.length = 0;
    const r = await llamar(lead, { method: 'POST', body: Object.assign({}, base, { nombre: 'PRUEBA QUALIVO Jorge', email: 'jorge@qualivo.io', tel: '611111111', ppto: '<15', inst: 'inst', frase: 'Dos baños y la cocina' }) });
    assert.equal(r.json.revision, true);
    const av = correos.find(function (c) { return c.to === 'avisos@qualivo.io'; });
    assert.ok(/Revisar/.test(av.subject)); assert.ok(decodeURIComponent(av.html).indexOf('qué te gustaría cambiar') > -1);
  });
  await t('Resend caído: el lead se guarda y el aviso queda pendiente para el cron', async function () {
    resendFalla = true;
    const r = await llamar(lead, { method: 'POST', body: Object.assign({}, base, { nombre: 'PRUEBA QUALIVO Caída', tel: '622222222', email: 'caida@qualivo.io' }) });
    resendFalla = false;
    assert.equal(r.json.ok, true);
    const p = await q("SELECT e.paso, e.estado FROM am_envios e JOIN am_leads l ON l.id = e.lead_id WHERE l.nombre LIKE '%Caída' AND e.paso IN ('E1','AVISO') ORDER BY 1");
    assert.deepEqual(p.map(function (x) { return x.estado; }), ['pendiente', 'pendiente']);
  });

  // ---------- Botones ----------
  const C = require(API + '_am-correo.js');
  await t('botón con firma mala: rechazado', async function () {
    const r = await llamar(accion, { query: { l: idA, a: 'visita', f: 'x' } });
    assert.equal(r.status, 400);
  });
  await t('GET no cambia nada (antivirus del correo); POST «ha contestado» para W5 y W6', async function () {
    const f = new URL(C.enlaceAccion(idA, 'contesto')).searchParams.get('f');
    const g = await llamar(accion, { query: { l: idA, a: 'contesto', f: f } });
    assert.equal(g.status, 200); assert.equal((await q('SELECT contesto FROM am_leads WHERE id=$1', [idA]))[0].contesto, false);
    const p = await llamar(accion, { method: 'POST', query: { l: idA, a: 'contesto', f: f }, body: '' });
    assert.equal(p.status, 200);
    const l = (await q('SELECT etapa, contesto FROM am_leads WHERE id=$1', [idA]))[0];
    assert.equal(l.etapa, 'contactado'); assert.equal(l.contesto, true);
    const w = await q("SELECT paso, estado FROM am_envios WHERE lead_id=$1 AND paso IN ('W5','W6')", [idA]);
    assert.ok(w.every(function (x) { return x.estado === 'cancelado'; }));
  });

  // ---------- Cron ----------
  const martes11 = new Date('2026-11-03T10:00:00Z');   // martes 3-nov, 11:00 en Madrid: en horario (día 5)
  const domingo = new Date('2026-11-01T10:00:00Z');    // domingo 1-nov: fuera de horario
  await t('cron: reintenta E1 y el aviso pendientes, y respeta el horario', async function () {
    correos.length = 0;
    const r1 = await cron.vuelta(domingo);
    assert.equal(r1.enviados, 2, JSON.stringify(r1));     // E1 y AVISO de «Caída» salen a cualquier hora
    await pg.query("UPDATE am_envios SET programado = now() - interval '1 hour' WHERE paso = 'E2'");
    const r2 = await cron.vuelta(domingo);
    assert.equal(r2.enviados, 0);                         // E2 no sale en domingo
    const r3 = await cron.vuelta(martes11);
    // E2: Laura ha contestado (se cancela); Jorge y Caída no (se envían)
    assert.equal(r3.enviados, 2); assert.equal(r3.cancelados, 1);
    const e2 = await q("SELECT l.nombre, e.estado, e.detalle FROM am_envios e JOIN am_leads l ON l.id=e.lead_id WHERE e.paso='E2' ORDER BY l.nombre");
    assert.ok(e2.find(function (x) { return /Laura/.test(x.nombre); }).detalle.indexOf('parada') === 0);
  });
  await t('presupuesto enviado: W9-W12 al resumen diario de Sonia con su botón de WhatsApp', async function () {
    const f = new URL(C.enlaceAccion(idA, 'presupuesto')).searchParams.get('f');
    await llamar(accion, { method: 'POST', query: { l: idA, a: 'presupuesto', f: f }, body: '' });
    assert.equal((await q("SELECT count(*)::int n FROM am_envios WHERE lead_id=$1 AND paso IN ('W9','W10','W11','W12') AND estado='pendiente'", [idA]))[0].n, 4);
    await pg.query("UPDATE am_envios SET programado = now() - interval '1 hour' WHERE paso = 'W9'");
    // El cron simula el 16-nov: W10-W12 se llevan lejos para que solo venza W9 (si vencieran varios, saldría solo el último)
    await pg.query("UPDATE am_envios SET programado = now() + interval '60 days' WHERE paso IN ('W10','W11','W12')");
    correos.length = 0;
    const r = await cron.vuelta(new Date('2026-11-16T08:05:00Z'));   // lunes 16-nov, 9:05 en Madrid
    assert.equal(r.resumen, true);
    const res = correos.find(function (c) { return /Tu día en Al Milímetro/.test(c.subject); });
    assert.ok(res, 'falta el resumen');
    assert.ok(decodeURIComponent(res.html).indexOf('¿has podido ver el presupuesto?') > -1);
    assert.equal((await q("SELECT estado FROM am_envios WHERE lead_id=$1 AND paso='W9'", [idA]))[0].estado, 'avisado');
    const r2 = await cron.vuelta(new Date('2026-11-16T08:15:00Z'));
    assert.equal(r2.resumen, false);                       // un resumen al día
  });
  await t('baja del lead: no vuelve a recibir correos', async function () {
    const j = (await q("SELECT id FROM am_leads WHERE nombre LIKE '%Jorge'"))[0].id;
    const f = new URL(C.enlaceAccion(j, 'baja')).searchParams.get('f');
    await llamar(accion, { method: 'POST', query: { l: j, a: 'baja', f: f }, body: '' });
    const p = await q("SELECT count(*)::int n FROM am_envios WHERE lead_id=$1 AND canal='email' AND estado='pendiente'", [j]);
    assert.equal(p[0].n, 0);
  });
  await t('firmado: se para todo', async function () {
    const f = new URL(C.enlaceAccion(idA, 'firmado')).searchParams.get('f');
    await llamar(accion, { method: 'POST', query: { l: idA, a: 'firmado', f: f }, body: '' });
    const p = await q("SELECT count(*)::int n FROM am_envios WHERE lead_id=$1 AND estado='pendiente'", [idA]);
    assert.equal(p[0].n, 0);
  });

  // ---------- Intelligence ----------
  await t('Intelligence: sin sesión 401; con sesión, contactos sin teléfono ni email', async function () {
    const r0 = await llamar(intel, { query: { accion: 'tablero' } });
    assert.equal(r0.status, 401);
    const e = await llamar(intel, { method: 'POST', query: { accion: 'entrar' }, body: { clave: 'clave' } });
    const cookie = String(e.headers['Set-Cookie']).split(';')[0];
    const r = await llamar(intel, { query: { accion: 'tablero' }, headers: { cookie: cookie } });
    assert.equal(r.status, 200);
    const cs = r.json.contactos;
    assert.equal(cs.length, 3);
    const laura = cs.find(function (c) { return c.n === 'Laura'; });
    assert.equal(laura.fin, 'ganado'); assert.equal(laura.origen, 'pared'); assert.equal(laura.clase, 'A');
    assert.ok(JSON.stringify(r.json).indexOf('600000000') < 0 && JSON.stringify(r.json).indexOf('@qualivo.io') < 0);
  });

  // ---------- Visita con fecha, «más adelante», parar y caducidad (Automatización, 29-oct) ----------
  const nuevo = async function (nombre, tel, extra) {
    await llamar(lead, { method: 'POST', body: Object.assign({}, base, { nombre: 'PRUEBA QUALIVO ' + nombre, tel: tel, email: tel + '@qualivo.io' }, extra || {}) });
    return (await q('SELECT id FROM am_leads WHERE nombre = $1', ['PRUEBA QUALIVO ' + nombre]))[0].id;
  };
  const pulsar = function (id, a, body) {
    const f = new URL(C.enlaceAccion(id, a)).searchParams.get('f');
    return llamar(accion, { method: 'POST', query: { l: id, a: a, f: f }, body: body || '' });
  };
  // Un lunes al menos 7 días por delante, a las 10:00 de Madrid
  const H = require(API + '_horario.js');
  let lunes = Date.now() + 7 * 864e5; while (H.madrid(lunes).dia !== 1) lunes += 864e5;
  const fLunes = H.madrid(lunes).fecha;
  await t('visita con fecha y hora: W7 en la confirmación y W8 al resumen del viernes de antes', async function () {
    const id = await nuevo('Pedro', '633333333');
    const g = await llamar(accion, { query: { l: id, a: 'visita', f: new URL(C.enlaceAccion(id, 'visita')).searchParams.get('f') } });
    assert.ok(g.body.indexOf('type="datetime-local"') > -1);
    const r = await pulsar(id, 'visita', 'cita=' + fLunes + 'T10%3A00');
    assert.equal(r.status, 200);
    assert.ok(decodeURIComponent(r.body).indexOf('Nos vemos el lunes') > -1 && r.body.indexOf('https://wa.me/34633333333?text=') > -1, r.body);
    const env = await q("SELECT paso, estado, programado FROM am_envios WHERE lead_id=$1 AND paso IN ('W7','W8') ORDER BY paso", [id]);
    assert.deepEqual(env.map(function (e) { return e.paso + ':' + e.estado; }), ['W7:avisado', 'W8:pendiente']);
    const w8 = H.madrid(env[1].programado.getTime());
    assert.equal(w8.dia, 5); assert.equal(w8.hora, 9);                       // el viernes anterior, a las 9:00
    correos.length = 0;
    await cron.vuelta(new Date(env[1].programado.getTime() + 5 * 60e3));      // resumen de ese viernes
    const res = correos.find(function (c) { return /Tu día en Al Milímetro/.test(c.subject); });
    assert.ok(res && decodeURIComponent(res.html).indexOf('te recuerdo que el lunes') > -1, 'falta W8 en el resumen');
  });
  await t('visita sin fecha: como antes, sin W8', async function () {
    const id = await nuevo('Sin Fecha', '644444444');
    await pulsar(id, 'visita', '');
    assert.equal((await q("SELECT count(*)::int n FROM am_envios WHERE lead_id=$1 AND paso IN ('W7','W8')", [id]))[0].n, 0);
  });
  await t('«más adelante»: pasa a C, fuera W5 y W6, siguen los correos', async function () {
    const id = await nuevo('Marta', '655555555');
    await pulsar(id, 'mas_adelante');
    assert.equal((await q('SELECT clase FROM am_leads WHERE id=$1', [id]))[0].clase, 'C');
    const env = await q("SELECT paso, estado FROM am_envios WHERE lead_id=$1 AND paso IN ('W5','W6','E2','E3','E4') ORDER BY paso", [id]);
    assert.deepEqual(env.map(function (e) { return e.paso + ':' + e.estado; }), ['E2:pendiente', 'E3:pendiente', 'E4:pendiente', 'W5:cancelado', 'W6:cancelado']);
    await pg.query("UPDATE am_envios SET programado = now() - interval '1 hour' WHERE lead_id = $1 AND paso = 'E2'", [id]);
    correos.length = 0;
    await cron.vuelta(martes11);
    assert.ok(correos.some(function (c) { return c.to === '655555555@qualivo.io'; }), 'E2 tiene que salir');
  });
  await t('parar: etapa «parado» y se cancela todo lo pendiente', async function () {
    const id = await nuevo('Parado', '666666666');
    await pulsar(id, 'parar');
    assert.equal((await q('SELECT etapa FROM am_leads WHERE id=$1', [id]))[0].etapa, 'parado');
    assert.equal((await q("SELECT count(*)::int n FROM am_envios WHERE lead_id=$1 AND estado='pendiente'", [id]))[0].n, 0);
  });
  await t('caducidad: con E2 y E3 vencidos a la vez sale solo E3 (no se mide en horas: lo del fin de semana sale el lunes)', async function () {
    const id = await nuevo('Rosa', '677777777');
    await pg.query("UPDATE am_envios SET programado = now() - interval '3 days' WHERE lead_id = $1 AND paso = 'E2'", [id]);
    await pg.query("UPDATE am_envios SET programado = now() - interval '1 hour' WHERE lead_id = $1 AND paso = 'E3'", [id]);
    correos.length = 0;
    await cron.vuelta(martes11);
    const e = await q("SELECT paso, estado, detalle FROM am_envios WHERE lead_id=$1 AND paso IN ('E2','E3') ORDER BY paso", [id]);
    assert.equal(e[0].estado, 'cancelado'); assert.equal(e[0].detalle, 'parada: caducado: lo sustituye E3');
    assert.equal(e[1].estado, 'enviado');
    assert.equal(correos.filter(function (c) { return c.to === '677777777@qualivo.io'; }).length, 1);
  });

  // ---------- Destino GHL (subcuenta de Sonia), con GHL simulado ----------
  const G = require(API + '_am-ghl.js');
  const ghlLlamadas = [];
  const fetchAntes = global.fetch;
  global.fetch = async function (url, o) {
    if (!/leadconnectorhq/.test(url)) return fetchAntes(url, o);
    const ruta = url.replace('https://services.leadconnectorhq.com', ''); const cuerpo = o.body ? JSON.parse(o.body) : null;
    ghlLlamadas.push({ m: o.method, ruta: ruta, cuerpo: cuerpo });
    let d = {};
    if (/customFields/.test(ruta)) d = { customFields: ['am_tipo_obra', 'am_tipo_texto', 'am_codigo_postal', 'am_zona', 'am_metros', 'am_cuando', 'am_presupuesto', 'am_vivienda_propia', 'am_clase', 'am_puntos', 'am_origen', 'am_revision', 'am_desde', 'am_instalaciones', 'am_que_cambiar'].map(function (k, i) { return { id: 'f' + i, fieldKey: 'contact.' + k }; }) };
    else if (/pipelines/.test(ruta)) d = { pipelines: [{ id: 'P1', name: 'Reformas', stages: ['Nuevo', 'Contactado', 'Visita técnica', 'Presupuesto enviado', 'Seguimiento', 'Firmado', 'Perdido'].map(function (n, i) { return { id: 'S' + i, name: n }; }) }] };
    else if (/upsert/.test(ruta)) d = { contact: { id: 'C1' } };
    else if (/opportunities\/search/.test(ruta)) d = { opportunities: [{ id: 'O1', contactId: 'C1', pipelineStageId: 'S2', status: 'open', createdAt: new Date().toISOString() }] };
    else if (/^\/contacts\/C1$/.test(ruta)) d = { contact: { firstName: 'PRUEBA QUALIVO Marta', tags: ['am-prueba'], customFields: [{ id: 'f8', value: 'A' }, { id: 'f9', value: 85 }, { id: 'f10', value: 'C · Cuánto cuesta' }, { id: 'f0', value: 'Piso entero' }] } };
    return { ok: true, status: 200, text: async function () { return JSON.stringify(d); }, json: async function () { return d; } };
  };
  process.env.AM_GHL_API_KEY = 'tok'; process.env.AM_GHL_LOCATION_ID = 'L1';
  await t('GHL: contacto con campos, etiquetas (am-lead la última), oportunidad en «Nuevo» y nota; nada en la base de datos', async function () {
    const antes = (await q('SELECT count(*)::int n FROM am_leads'))[0].n;
    const r = await llamar(lead, { method: 'POST', body: Object.assign({}, base, { nombre: 'PRUEBA QUALIVO Marta', a: 'precio' }) });
    assert.equal(r.json.ok, true); assert.equal(r.json.clase, 'A');
    const up = ghlLlamadas.find(function (l) { return /upsert/.test(l.ruta); });
    assert.equal(up.cuerpo.phone, '+34600000000'); assert.ok(!up.cuerpo.tags);
    assert.equal(up.cuerpo.customFields.find(function (c) { return c.id === 'f10'; }).field_value, 'C · Cuánto cuesta');
    const tags = ghlLlamadas.filter(function (l) { return /\/tags$/.test(l.ruta); }).map(function (l) { return l.cuerpo.tags; });
    assert.deepEqual(tags, [['am-a', 'am-origen-precio', 'am-prueba'], ['am-lead']]);
    const op = ghlLlamadas.find(function (l) { return l.ruta === '/opportunities/'; });
    assert.equal(op.cuerpo.pipelineStageId, 'S0'); assert.ok(/^\[PRUEBA\]/.test(op.cuerpo.name));
    assert.ok(ghlLlamadas.some(function (l) { return /\/notes$/.test(l.ruta); }));
    assert.equal((await q('SELECT count(*)::int n FROM am_leads'))[0].n, antes);
  });
  await t('GHL: descartado no toca GHL', async function () {
    ghlLlamadas.length = 0;
    const r = await llamar(lead, { method: 'POST', body: Object.assign({}, base, { tipo: 'arreglo' }) });
    assert.equal(r.json.descartado, 'tipo'); assert.equal(ghlLlamadas.length, 0);
  });
  await t('GHL: Intelligence lee el pipeline, sin teléfonos ni emails', async function () {
    const e = await llamar(intel, { method: 'POST', query: { accion: 'entrar' }, body: { clave: 'clave' } });
    const cookie = String(e.headers['Set-Cookie']).split(';')[0];
    const r = await llamar(intel, { query: { accion: 'tablero', fresco: '1' }, headers: { cookie: cookie } });
    assert.equal(r.json.fuente, 'ghl'); assert.equal(r.json.contactos.length, 1);
    const c = r.json.contactos[0];
    assert.equal(c.n, 'Marta'); assert.equal(c.etapa, 3); assert.equal(c.origen, 'precio'); assert.equal(c.clase, 'A');
    assert.ok(JSON.stringify(r.json).indexOf('+34') < 0);
  });
  delete process.env.AM_GHL_API_KEY; delete process.env.AM_GHL_LOCATION_ID; global.fetch = fetchAntes; G._reiniciar();

  console.log(ok + ' pruebas en verde');
  await pg.end(); emu.close();
})().catch(function (e) { console.error('✗', e.stack || e.message); process.exit(1); });
