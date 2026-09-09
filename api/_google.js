// Acceso a Google Sheets con una cuenta de servicio (JSON en GOOGLE_SA_JSON).
// Firma el JWT con el módulo crypto de Node: sin dependencias.

const crypto = require('crypto');

const cache = {};   // por permiso (scope)

async function tokenGoogle(scope) {
  scope = scope || 'https://www.googleapis.com/auth/spreadsheets';
  const c = cache[scope];
  if (c && Date.now() < c.exp - 60000) return c.token;
  const sa = JSON.parse(process.env.GOOGLE_SA_JSON || '{}');
  if (!sa.client_email || !sa.private_key) throw new Error('GOOGLE_SA_JSON no configurado');
  const b64 = function (o) { return Buffer.from(JSON.stringify(o)).toString('base64url'); };
  const now = Math.floor(Date.now() / 1000);
  const cabecera = b64({ alg: 'RS256', typ: 'JWT' });
  const carga = b64({ iss: sa.client_email, scope: scope, aud: sa.token_uri, iat: now, exp: now + 3600 });
  const firma = crypto.sign('RSA-SHA256', Buffer.from(cabecera + '.' + carga), sa.private_key).toString('base64url');
  const r = await fetch(sa.token_uri, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: cabecera + '.' + carga + '.' + firma })
  });
  if (!r.ok) throw new Error('token Google ' + r.status + ': ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  cache[scope] = { token: d.access_token, exp: Date.now() + (d.expires_in || 3600) * 1000 };
  return d.access_token;
}

async function sheets(metodo, ruta, cuerpo) {
  const t = await tokenGoogle();
  const r = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + ruta, {
    method: metodo, headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  if (!r.ok) throw new Error('Sheets ' + metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ': ' + (await r.text()).slice(0, 300));
  return r.json();
}

module.exports = { tokenGoogle, sheets };
