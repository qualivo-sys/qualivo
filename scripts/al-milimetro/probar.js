// Pruebas sin red del modelo y del receptor de Al Milímetro, con un GHL simulado.
// Uso: node scripts/al-milimetro/probar.js
const assert = require('assert');
const M = require('../../api/_am-modelo.js');
let ok = 0; const t = function (n, f) { return Promise.resolve().then(f).then(function () { ok++; console.log('✓ ' + n); }); };

(async function () {
  await t('descartes', function () {
    assert.equal(M.descarte({ tipo: 'local' }), 'tipo');
    assert.equal(M.descarte({ tipo: 'arreglo' }), 'tipo');
    assert.equal(M.descarte({ tipo: 'suelto', cp: '28010' }), 'suelto');
    assert.equal(M.descarte({ tipo: 'piso', cp: '28905' }), 'zona');
    assert.equal(M.descarte({ tipo: 'piso', cp: '28010', inst: 'acab' }), 'acab');
    assert.equal(M.descarte({ tipo: 'piso', cp: '28010' }), null);
  });
  await t('puntuación A/B/C y techo', function () {
    assert.ok(M.MAXIMO >= M.UMBRAL_A);
    const a = M.puntuar({ tipo: 'piso', cp: '28010', ppto: '30-60', cuando: '3', propia: 'si' });
    assert.equal(a.puntos, 85); assert.equal(a.clase, 'A');
    const b = M.puntuar({ tipo: 'cb', cp: '28010', ppto: '15-30', cuando: '6', propia: 'si' });
    assert.equal(b.puntos, 55); assert.equal(b.clase, 'B');
    const c = M.puntuar({ tipo: 'piso', cp: '28100', ppto: 'nose', cuando: 'mirando', propia: 'no' });
    assert.equal(c.clase, 'C');
    assert.ok(M.zonaPrioritaria({ cp: '00000', mun: 'Majadahonda' }));
  });
  await t('segundas preguntas', function () {
    assert.ok(M.necesitaRevision({ ppto: '<15' }));
    assert.ok(M.necesitaRevision({ ppto: 'nose', m2: '<50' }));
    assert.ok(!M.necesitaRevision({ ppto: '30-60', m2: '<50' }));
  });

  // Receptor con GHL simulado
  const llamadas = [];
  global.fetch = async function (url, o) {
    const ruta = url.replace('https://services.leadconnectorhq.com', ''); const cuerpo = o.body ? JSON.parse(o.body) : null;
    llamadas.push({ m: o.method, ruta: ruta, cuerpo: cuerpo });
    let d = {};
    if (/customFields/.test(ruta)) d = { customFields: ['am_tipo_obra','am_tipo_texto','am_codigo_postal','am_zona','am_metros','am_cuando','am_presupuesto','am_vivienda_propia','am_clase','am_puntos','am_origen','am_revision','am_desde','am_instalaciones','am_que_cambiar'].map(function (k, i) { return { id: 'f' + i, fieldKey: 'contact.' + k }; }) };
    else if (/pipelines/.test(ruta)) d = { pipelines: [{ id: 'P1', name: 'Al Milímetro · Reformas', stages: [{ id: 'S1', name: 'Nuevo' }, { id: 'S2', name: 'Contactado' }] }] };
    else if (/upsert/.test(ruta)) d = { contact: { id: 'C1' } };
    return { ok: true, status: 200, text: async function () { return JSON.stringify(d); } };
  };
  const handler = require('../../api/al-milimetro-lead.js');
  const llamar = async function (body) { let out; const res = { status: function (s) { this.s = s; return this; }, json: function (j) { out = Object.assign({ status: this.s }, j); }, setHeader: function () {} }; await handler({ method: 'POST', body: body }, res); return out; };
  const base = { nombre: 'PRUEBA QUALIVO Laura', tel: '600 000 000', email: 'prueba@qualivo.io', rgpd: true, tipo: 'piso', cp: '28010', mun: 'Chamberí', m2: '80-120', cuando: '3', ppto: '30-60', propia: 'si', a: 'pared' };

  await t('sin claves: vista previa, no guarda', async function () {
    delete process.env.AM_GHL_API_KEY; const r = await llamar(base);
    assert.equal(r.modo, 'vista_previa'); assert.equal(r.clase, 'A'); assert.equal(llamadas.length, 0);
  });
  process.env.AM_GHL_API_KEY = 'x'; process.env.AM_GHL_LOCATION_ID = 'L1';
  await t('descartado: no toca GHL', async function () {
    const r = await llamar(Object.assign({}, base, { tipo: 'local' }));
    assert.equal(r.descartado, 'tipo'); assert.equal(llamadas.length, 0);
  });
  await t('solo prueba: un lead real no se guarda', async function () {
    process.env.AM_SOLO_PRUEBA = '1'; const r = await llamar(Object.assign({}, base, { nombre: 'Laura' }));
    assert.equal(r.modo, 'solo_prueba'); assert.equal(llamadas.length, 0);
  });
  await t('lead de prueba A: contacto, etiquetas, oportunidad y nota', async function () {
    const r = await llamar(base);
    assert.equal(r.ok, true); assert.equal(r.clase, 'A'); assert.equal(r.prueba, true);
    const up = llamadas.find(function (l) { return /upsert/.test(l.ruta); });
    assert.equal(up.cuerpo.phone, '+34600000000'); assert.ok(!up.cuerpo.tags, 'el upsert no debe llevar etiquetas');
    const tipo = up.cuerpo.customFields.find(function (c) { return c.id === 'f0'; }); assert.equal(tipo.field_value, 'Piso entero');
    const tg = llamadas.find(function (l) { return /\/tags$/.test(l.ruta); });
    assert.deepEqual(tg.cuerpo.tags, ['am-lead', 'am-a', 'am-origen-pared', 'am-prueba']);
    const op = llamadas.find(function (l) { return l.ruta === '/opportunities/'; });
    assert.equal(op.cuerpo.pipelineStageId, 'S1'); assert.ok(/^\[PRUEBA\]/.test(op.cuerpo.name));
    assert.ok(llamadas.some(function (l) { return /\/notes$/.test(l.ruta); }));
  });
  await t('datos inválidos: 400', async function () {
    const r = await llamar(Object.assign({}, base, { rgpd: false })); assert.equal(r.status, 400);
  });
  console.log(ok + ' pruebas en verde');
})().catch(function (e) { console.error('✗', e.message); process.exit(1); });
