// Prueba sin red de ghl-alta-subcuenta.js: node automatizaciones/plataforma/pruebas/probar-alta.js
// Simula la API de GHL y comprueba el script de alta (vista previa, aplicar, idempotencia y la subcuenta de Qualivo).
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
  if (m === 'POST' && u.pathname === '/locations/') { const l = { id: 'loc1', name: b.name }; estado.locations.push(l); return res({ id: 'loc1', name: b.name }); }
  if (u.pathname === '/oauth/locationToken') { assert.equal(b.locationId, estado.locations[0].id); return res({ access_token: 'lt' }); }
  if (/customValues$/.test(u.pathname)) { if (m === 'POST') estado.cv.push({ id: 'v' + estado.cv.length, name: b.name, value: b.value }); return res({ customValues: estado.cv }); }
  if (/customFields$/.test(u.pathname)) { if (m === 'POST') estado.cf.push({ fieldKey: 'contact.' + b.name.toLowerCase().replace(/ /g, '_') }); return res({ customFields: estado.cf }); }
  if (/tags$/.test(u.pathname)) { if (m === 'POST') estado.tags.push({ name: b.name }); return res({ tags: estado.tags }); }
  if (u.pathname === '/calendars/') { if (m === 'POST') estado.cals.push({ name: b.name }); return res({ calendars: estado.cals }); }
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
  const antes = llamadas.filter((l) => l.startsWith('POST') || l.startsWith('PUT')).length;
  await cargar(true).main(cli);
  const despues = llamadas.filter((l) => l.startsWith('POST') || l.startsWith('PUT')).length;
  assert.equal(despues - antes, 1, 'repetir solo pide el token de nuevo');
  estado.locations = [{ id: 'bHGMuZEGUESZmVoNv9HT', name: cli.nombre }];
  await assert.rejects(cargar(true).main(cli), /Qualivo/);
  console.log = log;
  console.log('✓ vista previa sin escrituras · ✓ alta completa (14 valores, 16 campos, 16 etiquetas, calendario) · ✓ idempotente · ✓ se niega con la subcuenta de Qualivo');
})().catch((e) => { console.error('✗', e); process.exit(1); });
