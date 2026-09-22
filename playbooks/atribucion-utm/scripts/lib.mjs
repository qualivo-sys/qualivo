// Credenciales: solo del entorno. Nunca en el repo.
export const env = (k, req = true) => {
  const v = process.env[k];
  if (!v && req) { console.error(`Falta la variable de entorno ${k}`); process.exit(1); }
  return v;
};

/* ── Meta ───────────────────────────────────────────────── */
export const meta = {
  get token() { return env('META_TOKEN'); },
  get act()   { return env('META_ACT'); },
  async get(path) {
    const sep = path.includes('?') ? '&' : '?';
    const r = await fetch(`https://graph.facebook.com/v21.0/${path}${sep}access_token=${this.token}`);
    return r.json();
  },
  async post(path, body) {
    const fd = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) fd.append(k, typeof v === 'string' ? v : JSON.stringify(v));
    fd.append('access_token', this.token);
    const r = await fetch(`https://graph.facebook.com/v21.0/${path}`, { method: 'POST', body: fd });
    return r.json();
  },
  // recorre todas las páginas de un edge
  async all(path, fields, limit = 100) {
    const out = []; let after = '';
    for (let p = 0; p < 30; p++) {
      const j = await this.get(`${path}?fields=${fields}&limit=${limit}${after ? '&after=' + after : ''}`);
      if (j.error) { console.error('  ⚠', j.error.message); break; }
      out.push(...(j.data || []));
      after = j.paging?.cursors?.after;
      if (!j.paging?.next) break;
    }
    return out;
  },
};

/* ── GoHighLevel ────────────────────────────────────────── */
export const ghl = {
  get token() { return env('GHL_TOKEN'); },
  get loc()   { return env('GHL_LOCATION'); },
  headers() {
    return { Authorization: 'Bearer ' + this.token, Version: '2021-07-28',
             Accept: 'application/json', 'Content-Type': 'application/json' };
  },
  async get(path) {
    const r = await fetch(`https://services.leadconnectorhq.com/${path}`, { headers: this.headers() });
    return r.json();
  },
  async post(path, body) {
    const r = await fetch(`https://services.leadconnectorhq.com/${path}`,
      { method: 'POST', headers: this.headers(), body: JSON.stringify(body) });
    const t = await r.text();
    try { return { status: r.status, ...JSON.parse(t) }; } catch { return { status: r.status, raw: t }; }
  },
};

/* ── Google Ads ─────────────────────────────────────────────
   No admite cuenta de servicio: OAuth de usuario + refresh token.
   login-customer-id debe ser el MCC, sin guiones.                */
let _gadsToken = null;
export const gads = {
  async access() {
    if (_gadsToken) return _gadsToken;
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env('GADS_CLIENT_ID'), client_secret: env('GADS_CLIENT_SECRET'),
        refresh_token: env('GADS_REFRESH_TOKEN'), grant_type: 'refresh_token' }),
    });
    const j = await r.json();
    if (!j.access_token) { console.error('OAuth de Google Ads falló:', JSON.stringify(j).slice(0, 200)); process.exit(1); }
    return (_gadsToken = j.access_token);
  },
  async headers() {
    return { Authorization: 'Bearer ' + await this.access(), 'developer-token': env('GADS_DEV_TOKEN'),
             'login-customer-id': env('GADS_LOGIN_CID'), 'Content-Type': 'application/json' };
  },
  async query(q, cid = process.env.GADS_CID) {
    const r = await fetch(`https://googleads.googleapis.com/v22/customers/${cid}/googleAds:search`,
      { method: 'POST', headers: await this.headers(), body: JSON.stringify({ query: q }) });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
    if (r.status !== 200) { console.error('  ⚠', (j?.error?.details?.[0]?.errors?.[0]?.message || j?.error?.message || t).slice(0, 200)); return []; }
    return j.results || [];
  },
  async mutate(service, operations, cid = process.env.GADS_CID) {
    const r = await fetch(`https://googleads.googleapis.com/v22/customers/${cid}/${service}:mutate`,
      { method: 'POST', headers: await this.headers(), body: JSON.stringify({ operations }) });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
    return { ok: r.status === 200, status: r.status, body: j ?? t };
  },
};

export const dias = (n) => {
  const d = new Date(Date.now() - n * 864e5);
  return d.toISOString().slice(0, 10);
};
