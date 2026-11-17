// Intelligence de Nuria · personas que ven cada clase de El Círculo (no reproducciones).
// Cuenta en Kliking las etiquetas «clase N · paso · AAAA-MM-DD» que pone api/nuria-clase.js
// y las compara con los registros de la edición. Solo lectura y sin datos personales.

const N = require('./_nuria-semana.js');
const C = require('./nuria-clase.js');
const NBSP = '\u00a0';
const CLASES = ['1', '2', '3'], PASOS = ['empieza', 'mitad', 'acaba'];

async function total(tag) {
  const r = await N.ghl('/contacts/search', { cuerpo: { locationId: process.env.NURIA_GHL_LOCATION_ID, pageLimit: 1, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
  return Number(r.total || 0);
}

async function porEdicion(ed) {
  const pares = [];
  CLASES.forEach(function (c) { PASOS.forEach(function (p) { pares.push([c, p]); }); });
  const [ads, org, cuentas] = await Promise.all([
    total('[registro ads]' + NBSP + ed), total('[registro org]' + NBSP + ed),
    N.enParalelo(pares, 3, function (x) { return total(C.etiqueta(x[0], x[1], ed)); })
  ]);
  const clases = CLASES.map(function (c, i) { return { clase: c, empieza: cuentas[i * 3], mitad: cuentas[i * 3 + 1], acaba: cuentas[i * 3 + 2] }; });
  return { edicion: ed, registros: ads + org, clases: clases, conDatos: cuentas.some(function (n) { return n > 0; }) };
}

async function clasesPersonas() {
  const hoy = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const actual = C.edicion(hoy);
  const ant = new Date(actual + 'T12:00:00'); ant.setDate(ant.getDate() - 7);
  const eds = [actual, ant.getFullYear() + '-' + String(ant.getMonth() + 1).padStart(2, '0') + '-' + String(ant.getDate()).padStart(2, '0')];
  return { generado: Date.now(), ediciones: await Promise.all(eds.map(porEdicion)) };
}

module.exports = { clasesPersonas: clasesPersonas };
