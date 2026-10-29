// Pruebas del reloj (api/al-milimetro-cron.js) sin red ni base de datos:
//   node scripts/al-milimetro/probar-cron.js
process.env.CRON_SECRET = 'secreto-de-prueba';
process.env.RESEND_API_KEY = 'x';
process.env.AM_FROM = 'Sonia · Al Milímetro <sonia@ejemplo.com>';
process.env.AM_SONIA_EMAIL = 'pruebas@qualivo.io';
const assert = require('assert');
const C = require('../../api/al-milimetro-cron.js');
const H = require('../../api/_horario.js');
const at = (f, hm) => { const [h, m] = hm.split(':').map(Number); return H.msDeMadrid(f, h * 60 + m); };

// Base de datos falsa en memoria, con el mismo candado que el índice único.
function fakeDb(leads) {
  const reservas = new Set();
  return {
    reservas,
    leads: async () => leads.map((l) => Object.assign({}, l, { eventos: (l.eventos || []).concat([...reservas].filter((r) => r.startsWith(l.id + ':')).map((r) => ({ tipo: 'enviado', clave: r.split(':')[1], en: 0 }))) })),
    reservar: async (id, clave) => { const k = id + ':' + clave; if (reservas.has(k)) return false; reservas.add(k); return true; },
    soltar: async (id, clave) => { reservas.delete(id + ':' + clave); }
  };
}
const laura = { id: 'am_1', nombre: 'LAURA gómez', telefono: '+34 612 345 678', email: 'laura@ejemplo.com', clase: 'A', revision: false, prueba: true,
  creado: at('2026-10-29', '10:00'), respuestas: { tipo: 'piso', mun: 'Chamberí', m2: '80-120', cuando: '3' }, eventos: [] };

let ok = 0;
const caso = async (n, fn) => { await fn(); ok++; console.log('✓', n); };

(async () => {
  await caso('primera vuelta: E1 a Laura, tarea W1 y aviso A a Sonia; nada más', async () => {
    const db = fakeDb([laura]); const enviados = [];
    const r = await C.vuelta(Object.assign({ ahora: at('2026-10-29', '10:05'), enviar: async (c) => { enviados.push(c); return { ok: true }; } }, db));
    assert.deepStrictEqual(r.pasos.sort(), ['am_1:AVISO_A', 'am_1:E1', 'am_1:W1']);
    const e1 = enviados.find((c) => c.to[0] === 'laura@ejemplo.com');
    assert.ok(e1.subject.startsWith('[PRUEBA] Lo que pasa ahora'), e1.subject);
    assert.ok(e1.html.includes('Hola Laura:') && e1.html.includes('/api/al-milimetro-marca?l=am_1&a=baja&t='));
    const w1 = enviados.find((c) => /primer WhatsApp/.test(c.subject));
    assert.ok(w1.to[0] === 'pruebas@qualivo.io' && w1.html.includes('https://wa.me/34612345678?text=Hola%20Laura%2C%20soy%20Sonia'));
    assert.ok(w1.html.includes('tu piso en Chamberí'));
  });

  await caso('segunda vuelta en el mismo minuto: no repite nada', async () => {
    const db = fakeDb([laura]);
    const env = async () => ({ ok: true });
    await C.vuelta(Object.assign({ ahora: at('2026-10-29', '10:05'), enviar: env }, db));
    const r = await C.vuelta(Object.assign({ ahora: at('2026-10-29', '10:15'), enviar: env }, db));
    assert.strictEqual(r.enviados, 0);
  });

  await caso('Resend falla: se suelta la reserva y la vuelta siguiente lo reintenta', async () => {
    const db = fakeDb([laura]);
    const r1 = await C.vuelta(Object.assign({ ahora: at('2026-10-29', '10:05'), enviar: async (c) => ({ ok: c.to[0] !== 'laura@ejemplo.com', motivo: 'resend_500' }) }, db));
    assert.strictEqual(r1.errores, 1);
    const r2 = await C.vuelta(Object.assign({ ahora: at('2026-10-29', '10:15'), enviar: async () => ({ ok: true }) }, db));
    assert.deepStrictEqual(r2.pasos, ['am_1:E1']);
  });

  await caso('sin email del lead: E1 queda como sin_datos y no se reserva', async () => {
    const db = fakeDb([Object.assign({}, laura, { email: null })]);
    const r = await C.vuelta(Object.assign({ ahora: at('2026-10-29', '10:05'), enviar: async () => ({ ok: true }) }, db));
    assert.ok(r.pasos.includes('am_1:E1 sin_datos') && !db.reservas.has('am_1:E1'));
  });

  await caso('reloj parado 3 días: lo atrasado se marca caducado, solo sale lo de hoy', async () => {
    const db = fakeDb([laura]);
    const r = await C.vuelta(Object.assign({ ahora: at('2026-11-02', '09:05'), enviar: async () => ({ ok: true }) }, db));
    assert.ok(r.caducados >= 4, JSON.stringify(r));
    assert.deepStrictEqual(r.pasos.sort(), ['am_1:E2', 'am_1:W6']);
  });

  await caso('W7 con la cita: día, hora y dirección', async () => {
    const lead = Object.assign({}, laura, { cita: at('2026-11-05', '10:00'), eventos: [{ tipo: 'visita', en: at('2026-10-29', '16:00') }] });
    const c = C.correoDe({ clave: 'W7', canal: 'wa' }, lead);
    assert.ok(decodeURIComponent(c.html).includes('Nos vemos el jueves 5 a las 10:00 en tu casa de Chamberí'), c.html);
  });

  await caso('la firma de los enlaces cambia con la acción', async () => {
    assert.notStrictEqual(C.firma('am_1', 'stop'), C.firma('am_1', 'baja'));
  });

  console.log('\n' + ok + ' casos, todos bien');
})().catch((e) => { console.error(e); process.exit(1); });

// Botones de Sonia (api/al-milimetro-marca.js) con la base de datos sustituida.
(async () => {
  const DB = require('../../api/_am-db.js');
  const hechos = [];
  DB.apuntar = async (l, a) => hechos.push(a + ':' + l);
  DB.ponerCita = async (l, iso) => hechos.push('cita:' + l + ':' + iso);
  const marca = require('../../api/al-milimetro-marca.js');
  const llamar = (query) => new Promise((ok) => {
    const res = { setHeader() {}, status(c) { this.c = c; return this; }, send(b) { ok({ c: this.c, b }); } };
    marca({ query }, res);
  });
  let r = await llamar({ l: 'am_1', a: 'stop', t: 'mala' });
  assert.strictEqual(r.c, 400);
  r = await llamar({ l: 'am_1', a: 'stop', t: C.firma('am_1', 'stop') });
  assert.ok(r.c === 200 && hechos.includes('stop:am_1'));
  r = await llamar({ l: 'am_1', a: 'visita', t: C.firma('am_1', 'visita') });
  assert.ok(r.b.includes('datetime-local') && !hechos.includes('visita:am_1'));
  r = await llamar({ l: 'am_1', a: 'visita', t: C.firma('am_1', 'visita'), cita: '2026-11-05T10:00' });
  assert.ok(hechos.includes('cita:am_1:2026-11-05T09:00:00.000Z') && hechos.includes('visita:am_1'), hechos);
  console.log('✓ botones de Sonia: firma, parar, visita con fecha (hora de Madrid → UTC)');
})().catch((e) => { console.error(e); process.exit(1); });
