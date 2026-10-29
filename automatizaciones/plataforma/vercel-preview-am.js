// Pone en la PREVIEW de Vercel (solo la rama de Al Milímetro) las variables para probar el receptor contra la
// subcuenta nueva de GHL. Guía: 2026-10-29-montaje-agencia.md, parte G.
//
//   GHL_AGENCY_API_KEY=… GHL_COMPANY_ID=… VERCEL_TOKEN=… node automatizaciones/plataforma/vercel-preview-am.js <locationId> [--pipeline=<id>] [--aplicar]
//
// Qué pone (target «preview», gitBranch claude/al-milimetro-landing-v2-site; no toca producción):
//   AM_GHL_LOCATION_ID · AM_GHL_API_KEY (token de ubicación de unas 24 h: SOLO para la prueba; el duradero es la
//   Private Integration de la subcuenta, guía A3.2) · AM_SOLO_PRUEBA=1 · AM_GHL_PIPELINE_ID (si se da) ·
//   INTELLIGENCE_CLAVE_AM (contraseña larga nueva, si no existe ya; se imprime UNA vez para el Chief of Staff).
// Opcionales: VERCEL_PROJECT (por defecto «qualivo»), VERCEL_TEAM_ID.

const crypto = require('crypto');
const QUALIVO = 'bHGMuZEGUESZmVoNv9HT';
const RAMA = 'claude/al-milimetro-landing-v2-site';
const aplicar = process.argv.includes('--aplicar');
const locId = process.argv.slice(2).find((a) => !a.startsWith('--'));
const pipeline = (process.argv.find((a) => a.startsWith('--pipeline=')) || '').split('=')[1];

async function pedir(url, o) {
  const r = await fetch(url, o);
  const t = await r.text();
  if (!r.ok) throw new Error((o && o.method || 'GET') + ' ' + url.split('?')[0] + ' → ' + r.status + ' ' + t.slice(0, 300));
  return t ? JSON.parse(t) : {};
}

async function main() {
  const { GHL_AGENCY_API_KEY: AG, GHL_COMPANY_ID: CO, VERCEL_TOKEN: VT } = process.env;
  if (!AG || !CO || !VT) throw new Error('Faltan GHL_AGENCY_API_KEY, GHL_COMPANY_ID o VERCEL_TOKEN');
  if (!locId) throw new Error('Falta el locationId de la subcuenta (lo imprime ghl-alta-subcuenta.js)');
  if (locId === QUALIVO) throw new Error('Esa es la subcuenta de Qualivo: no');
  const proyecto = process.env.VERCEL_PROJECT || 'qualivo';
  const team = process.env.VERCEL_TEAM_ID ? '&teamId=' + process.env.VERCEL_TEAM_ID : '';
  const V = 'https://api.vercel.com';
  const cabV = { Authorization: 'Bearer ' + VT, 'Content-Type': 'application/json' };

  const tk = await pedir('https://services.leadconnectorhq.com/oauth/locationToken', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + AG, Version: '2021-07-28', 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({ companyId: CO, locationId: locId }).toString()
  });
  if (!tk.access_token) throw new Error('GHL no ha dado token de ubicación');

  const hay = await pedir(V + '/v9/projects/' + encodeURIComponent(proyecto) + '/env?gitBranch=' + encodeURIComponent(RAMA) + team, { headers: cabV });
  const yaClave = (hay.envs || []).some((e) => e.key === 'INTELLIGENCE_CLAVE_AM' && (e.target || []).includes('preview'));
  const vars = { AM_GHL_LOCATION_ID: locId, AM_GHL_API_KEY: tk.access_token, AM_SOLO_PRUEBA: '1' };
  if (pipeline) vars.AM_GHL_PIPELINE_ID = pipeline;
  let clave = null;
  if (!yaClave) { clave = crypto.randomBytes(18).toString('base64url'); vars.INTELLIGENCE_CLAVE_AM = clave; }

  for (const [key, value] of Object.entries(vars)) {
    console.log((aplicar ? '+ ' : '· haría: ') + key + ' (preview, rama ' + RAMA + ')');
    if (aplicar) await pedir(V + '/v10/projects/' + encodeURIComponent(proyecto) + '/env?upsert=true' + team, {
      method: 'POST', headers: cabV,
      body: JSON.stringify({ key, value, type: 'encrypted', target: ['preview'], gitBranch: RAMA })
    });
  }
  if (aplicar && clave) console.log('\nINTELLIGENCE_CLAVE_AM (pásala SOLO al Chief of Staff o a Maikel; no se vuelve a mostrar): ' + clave);
  if (aplicar) console.log('\nHecho. Para que la preview las coja hace falta un deploy nuevo de la rama (un push o «Redeploy» en Vercel).');
}

if (require.main === module) main().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
module.exports = { main };
