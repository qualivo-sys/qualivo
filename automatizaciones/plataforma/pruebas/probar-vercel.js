// Prueba sin red de vercel-preview-am.js: node automatizaciones/plataforma/pruebas/probar-vercel.js
const assert = require('assert'); const path = require('path').join(__dirname, '..', 'vercel-preview-am.js');
Object.assign(process.env, { GHL_AGENCY_API_KEY: 'ag', GHL_COMPANY_ID: 'co', VERCEL_TOKEN: 'vt' });
const puestas = []; let envs = []; let redeploys = 0; const valores = {};
global.fetch = async (url, o) => {
  const res = (j) => ({ ok: true, status: 200, text: async () => JSON.stringify(j) });
  if (url.includes('locationToken')) return res({ access_token: 'tok24h' });
  if (/leadconnectorhq\.com\/locations\/locManual$/.test(url)) { assert.equal(o.headers.Authorization, 'Bearer pit'); return res({ location: { id: 'locManual' } }); }
  if (/leadconnectorhq\.com\/locations\/otra$/.test(url)) return res({ location: { id: 'otra-distinta' } });
  if (url.includes('/v9/projects/qualivo/env')) { assert.ok(url.includes('gitBranch=claude%2Fal-milimetro-landing-v2-site')); return res({ envs }); }
  if (url.includes('/v10/projects/qualivo/env?upsert=true')) { const b = JSON.parse(o.body); valores[b.key] = b.value; assert.deepEqual(b.target, ['preview']); assert.equal(b.gitBranch, 'claude/al-milimetro-landing-v2-site'); puestas.push(b.key); envs.push({ key: b.key, target: ['preview'] }); return res({}); }
  if (url.includes('/v9/projects/qualivo?')) return res({ id: 'prj1' });
  if (url.includes('/v6/deployments?projectId=prj1')) return res({ deployments: [
    { uid: 'd-otra', created: 3, meta: { githubCommitRef: 'otra-rama' } },
    { uid: 'd-vieja', created: 1, meta: { githubCommitRef: 'claude/al-milimetro-landing-v2-site' } },
    { uid: 'd-buena', created: 2, meta: { githubCommitRef: 'claude/al-milimetro-landing-v2-site' } }] });
  if (url.includes('/v13/deployments?forceNew=1')) { const b = JSON.parse(o.body); assert.equal(b.deploymentId, 'd-buena'); assert.equal(b.target, 'preview'); redeploys++; return res({ url: 'qualivo-git-am.vercel.app' }); }
  throw new Error('no simulado ' + url);
};
(async () => {
  const run = async (args) => { delete require.cache[require.resolve(path)]; process.argv = ['node', path].concat(args); const log = console.log; const out = []; console.log = (s) => out.push(String(s)); try { await require(path).main(); } finally { console.log = log; } return out; };
  await run(['loc1']); assert.equal(puestas.length, 0, 'vista previa no escribe');
  const o = await run(['loc1', '--pipeline=p1', '--aplicar']);
  assert.deepEqual(puestas.sort(), ['AM_GHL_API_KEY', 'AM_GHL_LOCATION_ID', 'AM_GHL_PIPELINE_ID', 'AM_SOLO_PRUEBA', 'INTELLIGENCE_CLAVE_AM']);
  assert.ok(o.some((s) => /INTELLIGENCE_CLAVE_AM .*: [\w-]{20,}/.test(s)));
  assert.equal(redeploys, 1); assert.ok(o.some((s) => s.includes('https://qualivo-git-am.vercel.app')));
  puestas.length = 0; await run(['loc1', '--aplicar']);
  assert.ok(!puestas.includes('INTELLIGENCE_CLAVE_AM'), 'no cambia una clave que ya existe');
  await assert.rejects(run(['bHGMuZEGUESZmVoNv9HT', '--aplicar']), /Qualivo/);
  // Modo habitual: Private Integration de la subcuenta en el entorno, sin clave de agencia
  delete process.env.GHL_AGENCY_API_KEY; delete process.env.GHL_COMPANY_ID;
  Object.assign(process.env, { AM_GHL_API_KEY: 'pit', AM_GHL_LOCATION_ID: 'locManual' });
  await run(['--aplicar']);
  assert.equal(valores.AM_GHL_API_KEY, 'pit'); assert.equal(valores.AM_GHL_LOCATION_ID, 'locManual');
  await assert.rejects(run(['otra', '--aplicar']), /no es de la subcuenta/);
  console.log('✓ modo Private Integration: pone el token duradero tras comprobar que es de esa subcuenta, sin clave de agencia');
  console.log('✓ vista previa sin escrituras · ✓ preview de la rama, nunca producción · ✓ clave de Intelligence una vez · ✓ refrescar el token no la cambia · ✓ se niega con Qualivo · ✓ redeploy del último deploy de la rama con su URL');
})().catch((e) => { console.error('✗', e); process.exit(1); });
