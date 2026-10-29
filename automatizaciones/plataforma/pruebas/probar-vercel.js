// Prueba sin red de vercel-preview-am.js: node automatizaciones/plataforma/pruebas/probar-vercel.js
const assert = require('assert'); const path = require('path').join(__dirname, '..', 'vercel-preview-am.js');
Object.assign(process.env, { GHL_AGENCY_API_KEY: 'ag', GHL_COMPANY_ID: 'co', VERCEL_TOKEN: 'vt' });
const puestas = []; let envs = [];
global.fetch = async (url, o) => {
  const res = (j) => ({ ok: true, status: 200, text: async () => JSON.stringify(j) });
  if (url.includes('locationToken')) return res({ access_token: 'tok24h' });
  if (url.includes('/v9/projects/qualivo/env')) { assert.ok(url.includes('gitBranch=claude%2Fal-milimetro-landing-v2-site')); return res({ envs }); }
  if (url.includes('/v10/projects/qualivo/env?upsert=true')) { const b = JSON.parse(o.body); assert.deepEqual(b.target, ['preview']); assert.equal(b.gitBranch, 'claude/al-milimetro-landing-v2-site'); puestas.push(b.key); envs.push({ key: b.key, target: ['preview'] }); return res({}); }
  throw new Error('no simulado ' + url);
};
(async () => {
  const run = async (args) => { delete require.cache[require.resolve(path)]; process.argv = ['node', path].concat(args); const log = console.log; const out = []; console.log = (s) => out.push(String(s)); try { await require(path).main(); } finally { console.log = log; } return out; };
  await run(['loc1']); assert.equal(puestas.length, 0, 'vista previa no escribe');
  const o = await run(['loc1', '--pipeline=p1', '--aplicar']);
  assert.deepEqual(puestas.sort(), ['AM_GHL_API_KEY', 'AM_GHL_LOCATION_ID', 'AM_GHL_PIPELINE_ID', 'AM_SOLO_PRUEBA', 'INTELLIGENCE_CLAVE_AM']);
  assert.ok(o.some((s) => /INTELLIGENCE_CLAVE_AM .*: [\w-]{20,}/.test(s)));
  puestas.length = 0; await run(['loc1', '--aplicar']);
  assert.ok(!puestas.includes('INTELLIGENCE_CLAVE_AM'), 'no cambia una clave que ya existe');
  await assert.rejects(run(['bHGMuZEGUESZmVoNv9HT', '--aplicar']), /Qualivo/);
  console.log('✓ vista previa sin escrituras · ✓ preview de la rama, nunca producción · ✓ clave de Intelligence una vez · ✓ refrescar el token no la cambia · ✓ se niega con Qualivo');
})().catch((e) => { console.error('✗', e); process.exit(1); });
