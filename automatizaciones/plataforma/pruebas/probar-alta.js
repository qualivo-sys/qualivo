// Prueba sin red de ghl-alta-subcuenta.js: node automatizaciones/plataforma/pruebas/probar-alta.js
// Simula la API de GHL y comprueba el script de alta (vista previa, aplicar, idempotencia y la subcuenta de Qualivo).
for (const k of Object.keys(process.env)) if (/^(GHL_|AM_GHL_|VERCEL_)/.test(k)) delete process.env[k]; // nunca el entorno real
const assert = require('assert');
const path = require('path').join(__dirname, '..', 'ghl-alta-subcuenta.js'), dir = require('path').dirname(path);
const cli = JSON.parse(require('fs').readFileSync(dir + '/al-milimetro.json', 'utf8'));
process.env.GHL_AGENCY_API_KEY = 'ag'; process.env.GHL_COMPANY_ID = 'co';
const estado = { locations: [], cv: [], cf: [], tags: [], cals: [] }; const llamadas = [];
global.fetch = async (url, o) => {
  const u = new URL(url), m = o.method, b = o.body && (o.headers['Content-Type'].includes('json') ? JSON.parse(o.body) : Object.fromEntries(new URLSearchParams(o.body)));
  llamadas.push(m + ' ' + u.pathname);
  const res = (j) => ({ ok: true, status: 200, text: async () => JSON.stringify(j) });
  if (u.pathname === '/locations/search') return res({ locations: estado.locations });
  if (m === 'GET' && /^\/locations\/[^/]+$/.test(u.pathname)) { assert.equal(o.headers.Authorization, 'Bearer pit'); const id = u.pathname.split('/')[2]; return res({ location: { id, name: cli.nombre } }); }
  if (m === 'POST' && u.pathname === '/locations/') { const l = { id: 'loc1', name: b.name }; estado.locations.push(l); return res({ id: 'loc1', name: b.name }); }
  if (u.pathname === '/oauth/locationToken') { assert.equal(b.locationId, estado.locations[0].id); return res({ access_token: 'lt' }); }
  if (/customValues$/.test(u.pathname)) { if (m === 'POST') estado.cv.push({ id: 'v' + estado.cv.length, name: b.name, value: b.value }); return res({ customValues: estado.cv }); }
  if (/customFields$/.test(u.pathname)) { if (m === 'POST') estado.cf.push({ fieldKey: 'contact.' + b.name.toLowerCase().replace(/ /g, '_') }); return res({ customFields: estado.cf }); }
  if (/tags$/.test(u.pathname)) { if (m === 'POST') estado.tags.push({ name: b.name }); return res({ tags: estado.tags }); }
  if (u.pathname === '/calendars/') {
    if (m === 'POST') {
      // Como la API real (29-oct): 422 si una entrada de openHours trae más de un día
      if ((b.openHours || []).some((h) => h.daysOfTheWeek.length !== 1) || estado.rechazarHorario && b.openHours) return { ok: false, status: 422, text: async () => '{"message":["openHours.0.must be a valid day of week"]}' };
      estado.cals.push({ name: b.name, openHours: b.openHours });
    }
    return res({ calendars: estado.cals });
  }
  throw new Error('ruta no simulada ' + m + ' ' + u.pathname);
};
(async () => {
  const cargar = (aplicar) => { delete require.cache[require.resolve(path)]; process.argv = ['node', path, 'x'].concat(aplicar ? ['--aplicar'] : []); return require(path); };
  const log = console.log; let out = []; console.log = (s) => out.push(s);
  await cargar(false).main(cli);
  assert.ok(!llamadas.some((l) => l.startsWith('POST')), 'la vista previa no escribe: ' + llamadas);
  await cargar(true).main(cli);
  assert.equal(estado.locations.length, 1); assert.equal(estado.cv.length, 14); assert.equal(estado.cf.length, 16); assert.equal(estado.tags.length, 16); assert.equal(estado.cals.length, 1);
  assert.ok(!out.some((s) => String(s).startsWith('⚠')), 'todas las claves de campo coinciden: ' + out.filter((s) => String(s).startsWith('⚠')));
  assert.deepEqual(estado.cals[0].openHours.map((h) => h.daysOfTheWeek[0]), [1, 2, 3, 4, 5], 'un día por entrada, lunes a viernes');
  assert.equal(estado.cals[0].openHours[4].hours[0].closeHour, 15, 'el viernes cierra a las 15:00');
  const antes = llamadas.filter((l) => l.startsWith('POST') || l.startsWith('PUT')).length;
  await cargar(true).main(cli);
  const despues = llamadas.filter((l) => l.startsWith('POST') || l.startsWith('PUT')).length;
  assert.equal(despues - antes, 1, 'repetir solo pide el token de nuevo');
  estado.locations = [{ id: 'bHGMuZEGUESZmVoNv9HT', name: cli.nombre }];
  await assert.rejects(cargar(true).main(cli), /Qualivo/);
  // Modo «subcuenta creada a mano» (plan de 297 $): Private Integration de la subcuenta, sin clave de agencia
  delete process.env.GHL_AGENCY_API_KEY; delete process.env.GHL_COMPANY_ID;
  Object.assign(process.env, { GHL_LOCATION_ID: 'bHGMuZEGUESZmVoNv9HT', GHL_API_KEY: 'qualivo' }); // las de Qualivo, presentes como en el entorno real
  Object.assign(process.env, { AM_GHL_API_KEY: 'pit', AM_GHL_LOCATION_ID: 'locManual' });
  Object.assign(estado, { cv: [], cf: [], tags: [], cals: [] }); llamadas.length = 0;
  await cargar(true).main(cli);
  assert.ok(!llamadas.some((l) => /locations\/search|locationToken|POST \/locations\/$/.test(l)), 'sin llamadas de agencia: ' + llamadas);
  assert.equal(estado.cf.length, 16); assert.equal(estado.tags.length, 16);
  process.env.AM_GHL_LOCATION_ID = 'bHGMuZEGUESZmVoNv9HT';
  await assert.rejects(cargar(true).main(cli), /Qualivo/);
  await assert.rejects(cargar(true).main(Object.assign({}, cli, { env: { token: 'GHL_API_KEY', location: 'GHL_LOCATION_ID' } })), /Qualivo/);
  // Si GHL sigue rechazando el horario: calendario sin horario y aviso, sin romper el resto
  process.env.AM_GHL_LOCATION_ID = 'locManual'; Object.assign(estado, { cals: [], rechazarHorario: true }); out = [];
  await cargar(true).main(cli);
  assert.equal(estado.cals.length, 1); assert.equal(estado.cals[0].openHours, undefined);
  assert.ok(out.some((s) => /GHL rechaza el horario/.test(s)));
  assert.throws(() => cargar(false).horario([{ daysOfTheWeek: [7], hours: [] }]), /no válido/);
  console.log = log;
  console.log('✓ calendario: un día por entrada; si GHL rechaza el horario, se crea sin él y avisa');
  console.log('✓ modo subcuenta creada a mano: usa las variables AM_* aunque estén las de Qualivo en el entorno, sin clave de agencia, y se niega con Qualivo');
  console.log('✓ vista previa sin escrituras · ✓ alta completa (14 valores, 16 campos, 16 etiquetas, calendario) · ✓ idempotente · ✓ se niega con la subcuenta de Qualivo');
})().catch((e) => { console.error('✗', e); process.exit(1); });
