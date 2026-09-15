#!/usr/bin/env node
// Enriquece canales de YouTube leyendo su página /videos (últimos ~30 vídeos) sin API ni Apify.
// Calcula genero_pct, comparables, publicaciones_mes, ultimo_post_dias e indie_pct (heurístico).
// Uso: node tools/yt_enrich.mjs creators.csv [minSubs=2000] > creators_enriched.csv

import { readFileSync } from 'node:fs';

const CORE = ['gang beasts', 'party animals', 'stick fight', 'pummel party', 'rubber bandits', 'havocado', 'move or die'];
const ADJ = ['human fall flat', 'fall guys', 'chained together', 'crab game', 'duck game', 'boomerang fu',
  'ultimate chicken horse', 'golf with your friends', 'knight squad', 'bopl battle', 'stumble guys', 'peak',
  'content warning', 'lethal company', 'r.e.p.o', 'repo', 'phasmophobia', 'pico park', 'overcooked', 'goose goose duck',
  'among us', 'mario party', 'smash bros', 'brawlhalla', 'rivals of aether', 'nidhogg', 'towerfall', 'speedrunners',
  'super bunny man', 'a way out', 'it takes two', 'split fiction', 'dale & dawson', 'liar\'s bar', 'buckshot roulette'];
const PARTY_WORDS = /\b(funny moments|with friends|con amigos|party|momentos divertidos|momentos graciosos|risas|4 idiots|3 idiots|co-?op|multiplayer|vs friends|amigos)\b/i;
const MAINSTREAM = /\b(minecraft|roblox|fortnite|gta|call of duty|warzone|fifa|ea fc|valorant|apex|free fire|league of legends|overwatch|rocket league|clash|pokemon|pokémon|brawl stars|counter.?strike|cs2|elden ring|zelda|mario kart|sprunki|skibidi|toca boca|fnaf|five nights|granny|poppy playtime)\b/i;

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function parseCSV(text) {
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
  return { header: h, rows: b.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? '']))) };
}
const esc = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

function agoToDays(s) {
  const m = /(\d+)\s+(second|minute|hour|day|week|month|year)/.exec(s || '');
  if (!m) return null;
  const n = +m[1]; const u = m[2];
  return u === 'year' ? n * 365 : u === 'month' ? n * 30 : u === 'week' ? n * 7 : u === 'day' ? n : 0;
}
function viewsToNum(s) {
  const m = /([\d.,]+)\s*([KM])?/.exec(s || ''); if (!m) return 0;
  const n = parseFloat(m[1].replace(/,/g, '')); return Math.round(n * (m[2] === 'M' ? 1e6 : m[2] === 'K' ? 1e3 : 1));
}

async function fetchChannel(url) {
  const u = url.replace(/\/+$/, '') + '/videos';
  const res = await fetch(u, { headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', cookie: 'CONSENT=YES+1; SOCS=CAI' } });
  if (!res.ok) throw new Error('http ' + res.status);
  const html = await res.text();
  const m = /var ytInitialData = (\{.*?\});<\/script>/s.exec(html);
  if (!m) throw new Error('no ytInitialData');
  const d = JSON.parse(m[1]);
  const vids = [];
  (function walk(o) {
    if (Array.isArray(o)) { for (const v of o) walk(v); return; }
    if (!o || typeof o !== 'object') return;
    if (o.lockupViewModel) {
      const md = o.lockupViewModel.metadata?.lockupMetadataViewModel || {};
      const title = md.title?.content || '';
      const parts = (md.metadata?.contentMetadataViewModel?.metadataRows || []).flatMap((r) => (r.metadataParts || []).map((p) => p.text?.content || ''));
      vids.push({ title, views: viewsToNum(parts.find((p) => /view/i.test(p))), days: agoToDays(parts.find((p) => /ago/i.test(p))) });
    }
    for (const v of Object.values(o)) walk(v);
  })(d);
  const desc = d.metadata?.channelMetadataRenderer?.description || '';
  const email = (desc.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [''])[0].toLowerCase();
  return { vids, desc, email };
}

const file = process.argv[2]; const minSubs = +(process.argv[3] || 2000);
const { header, rows } = parseCSV(readFileSync(file, 'utf8'));
const extra = ['titulos_recientes', 'enriquecido'];
const out = [...header]; for (const k of extra) if (!out.includes(k)) out.push(k);
process.stdout.write(out.join(',') + '\n');

const queue = rows.filter((r) => +r.seguidores >= minSubs);
const skipped = rows.filter((r) => +r.seguidores < minSubs);
let done = 0;
async function worker() {
  while (queue.length) {
    const r = queue.shift();
    try {
      const { vids, email } = await fetchChannel(r.url);
      const n = vids.length || 1;
      const t = vids.map((v) => v.title.toLowerCase());
      const core = new Set(), adj = new Set();
      let party = 0, indie = 0;
      for (const title of t) {
        let hit = false;
        for (const g of CORE) if (title.includes(g)) { core.add(g); hit = true; }
        for (const g of ADJ) if (title.includes(g)) { adj.add(g); hit = true; }
        if (hit || PARTY_WORDS.test(title)) party++;
        if (!MAINSTREAM.test(title)) indie++;
      }
      const days = vids.map((v) => v.days).filter((x) => x != null);
      const oldest = days.length ? Math.max(...days) : 0;
      const newest = days.length ? Math.min(...days) : 999;
      const views = vids.reduce((a, b) => a + b.views, 0) / n;
      r.genero_pct = Math.round((party / n) * 100);
      r.comparables_nucleo = core.size; r.comparables_adyacentes = adj.size;
      r.indie_pct = Math.round((indie / n) * 100);
      r.publicaciones_mes = oldest > 0 ? Math.round((vids.length / oldest) * 30) : vids.length;
      r.ultimo_post_dias = newest;
      r.vistas_medias = Math.round(views);
      if (!r.email && email) r.email = email;
      r.juegos = [...core, ...adj].join(' | ');
      r.titulos_recientes = t.slice(0, 8).join(' || ').slice(0, 400);
      r.enriquecido = 1;
    } catch (e) {
      r.enriquecido = 0; r.titulos_recientes = 'ERROR ' + e.message;
    }
    done++; if (done % 20 === 0) console.error(`${done} canales`);
    process.stdout.write(out.map((k) => esc(r[k])).join(',') + '\n');
    await new Promise((s) => setTimeout(s, 300));
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
for (const r of skipped) { r.enriquecido = 0; process.stdout.write(out.map((k) => esc(r[k])).join(',') + '\n'); }
console.error(`enriquecidos ${done}, omitidos por tamaño ${skipped.length}`);
