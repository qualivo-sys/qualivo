// Utilidades compartidas del pipeline: CSV, HTTP a Apify y a Notion.
export const env = (k) => { const v = process.env[k]; if (!v) throw new Error(`Falta ${k} en el entorno`); return v; };

export function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const [h, ...b] = rows.filter((r) => r.some((v) => v !== ''));
  return b.map((r) => Object.fromEntries(h.map((k, i) => [k.trim(), r[i] ?? ''])));
}
export const csvEsc = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export function toCSV(rows, keys) {
  keys = keys || [...new Set(rows.flatMap((r) => Object.keys(r)))];
  return [keys.join(','), ...rows.map((r) => keys.map((k) => csvEsc(r[k])).join(','))].join('\n') + '\n';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function retry(fn, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) { last = e; await sleep(2000 * 2 ** i); }
  }
  throw last;
}

// ---- Apify
const APIFY = 'https://api.apify.com/v2';
export async function apifyRuns(token, limit = 20) {
  const r = await retry(() => fetch(`${APIFY}/actor-runs?token=${token}&limit=${limit}&desc=1`).then((x) => x.json()));
  return r.data.items;
}
export async function apifyDataset(token, id) {
  return retry(() => fetch(`${APIFY}/datasets/${id}/items?token=${token}&clean=true`).then((x) => x.json()));
}
export async function apifyUsage(token) {
  const r = await retry(() => fetch(`${APIFY}/users/me?token=${token}`).then((x) => x.json()));
  const u = await retry(() => fetch(`${APIFY}/users/me/usage/monthly?token=${token}`).then((x) => x.json()));
  return { limit: r.data.plan?.maxMonthlyUsageUsd ?? 5, used: u.data?.totalUsageCreditsUsdAfterVolumeDiscount ?? u.data?.totalUsageCreditsUsd ?? 0 };
}
export async function apifyRun(token, actor, input) {
  const res = await retry(() => fetch(`${APIFY}/acts/${actor}/runs?token=${token}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input),
  }).then((x) => x.json()));
  return res.data;
}

// ---- Notion
const NOTION = 'https://api.notion.com/v1';
const nh = (key) => ({ authorization: `Bearer ${key}`, 'notion-version': '2022-06-28', 'content-type': 'application/json' });
export async function notionAll(key, dbId) {
  const out = []; let cursor;
  do {
    const r = await retry(() => fetch(`${NOTION}/databases/${dbId}/query`, {
      method: 'POST', headers: nh(key), body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
    }).then((x) => x.json()));
    if (r.object === 'error') throw new Error(r.message);
    out.push(...r.results); cursor = r.has_more ? r.next_cursor : null;
  } while (cursor);
  return out;
}
export const notionUrl = (page) => page.properties?.URL?.url || '';
export async function notionCreate(key, dbId, props) {
  return retry(() => fetch(`${NOTION}/pages`, {
    method: 'POST', headers: nh(key), body: JSON.stringify({ parent: { database_id: dbId }, properties: props }),
  }).then((x) => x.json()));
}
export const P = {
  title: (v) => ({ title: [{ text: { content: String(v ?? '').slice(0, 2000) } }] }),
  text: (v) => ({ rich_text: v ? [{ text: { content: String(v).slice(0, 2000) } }] : [] }),
  num: (v) => ({ number: Number.isFinite(+v) ? +v : null }),
  sel: (v) => (v ? { select: { name: String(v).slice(0, 100) } } : { select: null }),
  status: (v) => ({ status: { name: v } }),
  url: (v) => ({ url: v || null }),
  email: (v) => ({ email: v && String(v).includes('@') ? v : null }),
};
