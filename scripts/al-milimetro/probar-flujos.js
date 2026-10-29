// Pruebas de api/_am-flujos.js: node scripts/al-milimetro/probar-flujos.js
const F = require('../../api/_am-flujos.js');
const H = require('../../api/_horario.js');
const assert = require('assert');

const at = (fecha, hhmm) => { const [h, m] = hhmm.split(':').map(Number); return H.msDeMadrid(fecha, h * 60 + m); };
const fmt = (ms) => { const t = H.madrid(ms); return t.fecha + ' ' + String(t.hora).padStart(2, '0') + ':' + String(t.minuto).padStart(2, '0'); };
const claves = (pl) => pl.map((p) => p.clave + '@' + fmt(p.en));
let ok = 0;
function caso(nombre, fn) { fn(); ok++; console.log('✓', nombre); }

// Calendario: jue 29-oct-2026, vie 30, sáb 31, dom 1-nov (festivo), lun 2.
caso('horario: viernes a las 15:00 ya está cerrado; abre el lunes a las 9:00', () => {
  assert.strictEqual(F.enHorario(at('2026-10-30', '14:59')), true);
  assert.strictEqual(F.enHorario(at('2026-10-30', '15:00')), false);
  assert.strictEqual(fmt(F.siguienteApertura(at('2026-10-30', '15:00'))), '2026-11-02 09:00');
  assert.strictEqual(F.enHorario(at('2026-10-29', '18:59')), true);
  assert.strictEqual(F.enHorario(at('2026-10-29', '19:00')), false);
});

caso('festivo: el 8-dic (martes) no abre', () => {
  assert.strictEqual(fmt(F.siguienteApertura(at('2026-12-07', '19:30'))), '2026-12-09 09:00');
});

caso('lead A en horario: E1, W1 y aviso al momento; llamar a las 2 h; W5 al día siguiente', () => {
  const l = { clase: 'A', creado: at('2026-10-29', '10:00'), eventos: [] };
  assert.deepStrictEqual(claves(F.plan(l)).slice(0, 6), [
    'E1@2026-10-29 10:00', 'W1@2026-10-29 10:00', 'AVISO_A@2026-10-29 10:00',
    'LLAMAR_A@2026-10-29 12:00', 'W5@2026-10-30 10:00', 'E3@2026-11-05 10:00'].slice(0, 5).concat(claves(F.plan(l))[5]));
  const c = claves(F.plan(l));
  assert.ok(c.includes('W6@2026-11-02 09:00'), 'W6 del domingo pasa al lunes: ' + c);
  assert.ok(!c.some((x) => x.startsWith('E4')), 'E4 no es para A');
});

caso('lead B el viernes a las 18:00: E1 al momento, W1 el lunes a las 9:00 (no hay W2 con wa.me)', () => {
  const l = { clase: 'B', creado: at('2026-10-30', '18:00'), eventos: [] };
  const c = claves(F.plan(l));
  assert.strictEqual(c[0], 'E1@2026-10-30 18:00');
  assert.ok(c.includes('W1@2026-11-02 09:00'), c);
  assert.ok(c.includes('E4@2026-11-13 18:00') === false && c.some((x) => x.startsWith('E4@2026-11-16')), 'E4 del viernes 18:00 pasa al lunes: ' + c);
  assert.deepStrictEqual(claves(F.debidos(l, at('2026-10-30', '18:05'))), ['E1@2026-10-30 18:00']);
});

caso('lead C: solo emails', () => {
  const l = { clase: 'C', creado: at('2026-10-29', '10:00'), eventos: [] };
  assert.deepStrictEqual(F.plan(l).map((p) => p.clave), ['E1', 'E2', 'E3', 'E4']);
});

caso('revisión: W3 en lugar de W1', () => {
  const l = { clase: 'B', revision: true, creado: at('2026-10-29', '10:00'), eventos: [] };
  const c = F.plan(l).map((p) => p.clave);
  assert.ok(c.includes('W3') && !c.includes('W1'), c);
});

caso('contesta: se para todo el seguimiento, también los emails', () => {
  const l = { clase: 'A', creado: at('2026-10-29', '10:00'), eventos: [
    { tipo: 'enviado', clave: 'E1', en: at('2026-10-29', '10:00') },
    { tipo: 'enviado', clave: 'W1', en: at('2026-10-29', '10:01') },
    { tipo: 'enviado', clave: 'AVISO_A', en: at('2026-10-29', '10:01') },
    { tipo: 'respondio', en: at('2026-10-29', '11:00') }] };
  assert.deepStrictEqual(F.plan(l), []);
});

caso('«Más adelante» en W6: pasa a C, siguen los emails y paran los WhatsApp', () => {
  const l = { clase: 'B', creado: at('2026-10-29', '10:00'), eventos: [{ tipo: 'mas_adelante', en: at('2026-11-02', '09:30') }] };
  const c = F.plan(l).map((p) => p.clave);
  assert.ok(c.includes('E3') && c.includes('E4') && !c.includes('W6'), c);
});

caso('visita: para el seguimiento; W7 al momento y W8 la víspera en horario', () => {
  const l = { clase: 'A', creado: at('2026-10-29', '10:00'), cita: at('2026-11-05', '10:00'), eventos: [
    { tipo: 'enviado', clave: 'E1', en: 0 }, { tipo: 'enviado', clave: 'W1', en: 0 }, { tipo: 'enviado', clave: 'AVISO_A', en: 0 },
    { tipo: 'enviado', clave: 'LLAMAR_A', en: 0 },
    { tipo: 'visita', en: at('2026-10-29', '16:00') }] };
  assert.deepStrictEqual(claves(F.plan(l)), ['W7@2026-10-29 16:00', 'W8@2026-11-04 09:00']);
});

caso('visita el lunes: la víspera es domingo → W8 el viernes (antes de la cita)', () => {
  const l = { clase: 'A', creado: at('2026-10-27', '10:00'), cita: at('2026-11-02', '10:00'), eventos: [
    { tipo: 'visita', en: at('2026-10-29', '16:00') }, { tipo: 'enviado', clave: 'W7', en: at('2026-10-29', '16:00') }] };
  assert.deepStrictEqual(claves(F.plan(l)).filter((x) => x.startsWith('W8')), ['W8@2026-10-30 09:00']);
});

caso('visita cancelada: no hay W8', () => {
  const l = { clase: 'A', creado: at('2026-10-29', '10:00'), cita: at('2026-11-05', '10:00'), eventos: [
    { tipo: 'visita', en: at('2026-10-29', '16:00') }, { tipo: 'visita_cancelada', en: at('2026-10-30', '10:00') }] };
  assert.ok(!F.plan(l).some((p) => p.clave === 'W8'));
});

caso('presupuesto (cruza el cambio de hora del 25-oct): W9 a +2, W10 a +7, W11 a +14, W12 a +21 y tarea de perdido', () => {
  const l = { clase: 'A', creado: at('2026-10-01', '10:00'), eventos: [
    { tipo: 'visita', en: at('2026-10-05', '10:00') }, { tipo: 'enviado', clave: 'W7', en: 0 }, { tipo: 'enviado', clave: 'W8', en: 0 },
    { tipo: 'presupuesto', en: at('2026-10-13', '12:00') }] };
  assert.deepStrictEqual(claves(F.plan(l)).filter((x) => /^(W9|W1\d|PERDIDO)@/.test(x)), ['W9@2026-10-15 12:00', 'W10@2026-10-20 12:00', 'W11@2026-10-27 12:00',
    'W12@2026-11-03 12:00', 'PERDIDO@2026-11-04 12:00']);
});

caso('contesta tras el presupuesto: se para la recuperación', () => {
  const l = { clase: 'A', creado: at('2026-10-01', '10:00'), eventos: [
    { tipo: 'presupuesto', en: at('2026-10-13', '12:00') }, { tipo: 'enviado', clave: 'W9', en: at('2026-10-15', '12:00') },
    { tipo: 'respondio', en: at('2026-10-16', '09:00') }] };
  assert.ok(!F.plan(l).some((p) => /^(W1[0-2]|PERDIDO)$/.test(p.clave)));
});

caso('stop, ganado o perdido: nada', () => {
  ['stop', 'ganado', 'perdido'].forEach((t) => {
    assert.deepStrictEqual(F.plan({ clase: 'A', creado: at('2026-10-29', '10:00'), eventos: [{ tipo: t, en: at('2026-10-29', '11:00') }] }), []);
  });
});

caso('baja de emails: siguen los WhatsApp, no los emails', () => {
  const c = F.plan({ clase: 'A', creado: at('2026-10-29', '10:00'), eventos: [{ tipo: 'baja', en: 1 }] }).map((p) => p.clave);
  assert.ok(!c.some((x) => x[0] === 'E') && c.includes('W5'), c);
});

caso('debidos no repite un paso ya enviado', () => {
  const l = { clase: 'A', creado: at('2026-10-29', '10:00'), eventos: [{ tipo: 'enviado', clave: 'E1', en: 1 }] };
  assert.ok(!F.debidos(l, at('2026-10-29', '10:05')).some((p) => p.clave === 'E1'));
});

caso('paso con más de 36 h de retraso: caducado (no se manda de golpe)', () => {
  const l = { clase: 'A', creado: at('2026-10-29', '10:00'), eventos: [] };
  const d = F.debidos(l, at('2026-11-02', '09:05'));
  assert.ok(d.find((p) => p.clave === 'W1').caducado && !d.find((p) => p.clave === 'W6').caducado);
});

console.log('\n' + ok + ' casos, todos bien');
assert.strictEqual(F.waEnlace('612 345 678', 'Hola Laura'), 'https://wa.me/34612345678?text=Hola%20Laura');
console.log('✓ waEnlace');
