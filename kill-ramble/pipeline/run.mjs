#!/usr/bin/env node
// Pipeline completo: Apify -> normalizar -> puntuar -> deduplicar contra Notion ->
// personalizar -> entregables (CSV para Smartlead + cola de mensajes directos) -> alta en Notion.
//
//   node pipeline/run.mjs --since 2d --out ./out [--push] [--spanish=off]
//
// Variables: APIFY_TOKEN, NOTION_API_KEY, NOTION_DB_ID (opcionales las dos últimas si no se deduplica).

import { mkdirSync, writeFileSync } from 'node:fs';
import { apifyRuns, apifyDataset, apifyUsage, notionAll, notionCreate, toCSV, P } from './lib.mjs';
import { fromYouTube, fromTwitch } from './normalize.mjs';
import { scoreCreator } from './score.mjs';
import { personalize, dmText, utmFor } from './personalize.mjs';

const BOOKING = process.env.BOOKING_URL || 'https://calendar.app.google/igzRWLZAfVS178Mb7';

const arg = (name, def) => {
  const i = process.argv.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i === -1) return def;
  const a = process.argv[i];
  if (a.includes('=')) return a.split('=').slice(1).join('=');
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
};
const sinceMs = (s) => {
  const m = /^(\d+)([hd])$/.exec(String(s || '2d'));
  if (!m) return 2 * 86400000;
  return +m[1] * (m[2] === 'h' ? 3600000 : 86400000);
};

const token = process.env.APIFY_TOKEN;
if (!token) { console.error('Falta APIFY_TOKEN'); process.exit(1); }
const outDir = String(arg('out', './out'));
const spanishInScope = arg('spanish', 'on') !== 'off';
const since = new Date(Date.now() - sinceMs(arg('since', '2d'))).toISOString();
mkdirSync(outDir, { recursive: true });

const usage = await apifyUsage(token);
console.error(`Apify: ${usage.used.toFixed(2)} de ${usage.limit} USD este mes`);

// 1. Recoger datasets recientes por actor
const runs = await apifyRuns(token, 30);
// La API no devuelve el nombre del actor en el listado: se distingue por la forma de los items.
const recent = runs.filter((r) => r.status === 'SUCCEEDED' && r.startedAt >= since);
console.error(`${recent.length} runs desde ${since.slice(0, 16)}`);

const ytItems = [], twItems = [];
for (const r of recent) {
  let items;
  try { items = await apifyDataset(token, r.defaultDatasetId); } catch { continue; }
  if (!Array.isArray(items) || !items.length) continue;
  const s = items[0];
  if (s.channelUrl || s.channelUsername) ytItems.push(...items);
  else if (s.login && s.url?.includes('twitch.tv')) twItems.push(...items);
}
console.error(`YouTube: ${ytItems.length} vídeos · Twitch: ${twItems.length} filas`);

// 2. Normalizar
const creators = [...fromYouTube(ytItems), ...fromTwitch(twItems)];
console.error(`${creators.length} creadores normalizados`);

// 3. Deduplicar contra Notion
let known = new Set();
const { NOTION_API_KEY: nk, NOTION_DB_ID: ndb } = process.env;
if (nk && ndb) {
  try {
    const pages = await notionAll(nk, ndb);
    known = new Set(pages.map((p) => (p.properties?.URL?.url || '').replace(/\/+$/, '').toLowerCase()).filter(Boolean));
    console.error(`${known.size} creadores ya en Notion`);
  } catch (e) { console.error('Aviso: no se pudo leer Notion (' + e.message + '); no se deduplica'); }
}
const fresh = creators.filter((c) => !known.has(String(c.url).replace(/\/+$/, '').toLowerCase()));
console.error(`${fresh.length} nuevos`);

// 4. Puntuar y personalizar
const scored = fresh.map((c) => {
  const s = scoreCreator(c, { spanishInScope });
  const lang = spanishInScope ? c.lang : 'en';
  const p = personalize(c, lang === 'pt' ? 'en' : lang);
  return { ...c, ...s, lang, cited: p.cited, detail: p.detail, citedUrl: p.citedUrl,
    dm: dmText(c, BOOKING, lang === 'pt' ? 'en' : lang), utm: utmFor(c) };
}).sort((a, b) => b.score - a.score);

const actionable = scored.filter((c) => c.score >= 55);
const withEmail = actionable.filter((c) => c.email);
const noEmail = actionable.filter((c) => !c.email);

// 5. Entregables
const slCols = ['email', 'first_name', 'company_name', 'website', 'cited_video', 'video_detail',
  'comparable_game', 'booking_link', 'steam_utm', 'platform', 'followers', 'score', 'tier'];
const slRow = (c) => ({ email: c.email, first_name: c.name, company_name: c.platform, website: c.url,
  cited_video: c.cited, video_detail: c.detail, comparable_game: c.games?.[0] || '',
  booking_link: BOOKING, steam_utm: c.utm, platform: c.platform, followers: c.followers,
  score: c.score, tier: c.tier });

writeFileSync(`${outDir}/smartlead_en.csv`, toCSV(withEmail.filter((c) => c.lang !== 'es').map(slRow), slCols));
writeFileSync(`${outDir}/smartlead_es.csv`, toCSV(withEmail.filter((c) => c.lang === 'es').map(slRow), slCols));

const dmMd = ['# Cola de mensajes directos', '',
  `Generada ${new Date().toISOString().slice(0, 16)}. **Máximo 10 al día por cuenta.** Copiar y pegar de uno en uno.`, '',
  ...noEmail.map((c, i) => [`## ${i + 1}. ${c.name} · ${c.tier} · score ${c.score}`,
    `${c.platform} · ${new Intl.NumberFormat('es-ES').format(c.followers)} seguidores · ${c.url}`,
    c.links?.length ? `Por dónde escribirle: ${c.links.slice(0, 4).join(' · ')}` : 'Sin redes detectadas: probar el chat del canal.',
    '', '> ' + c.dm, '', `UTM: ${c.utm}`, ''].join('\n'))].join('\n');
writeFileSync(`${outDir}/dm_queue.md`, dmMd);
writeFileSync(`${outDir}/all_scored.csv`, toCSV(scored.map((c) => ({ ...slRow(c), action: c.action, reason: c.reason, lang: c.lang })),
  [...slCols, 'action', 'reason', 'lang']));

console.error(`\nEntregables en ${outDir}/`);
console.error(`  smartlead_en.csv  ${withEmail.filter((c) => c.lang !== 'es').length} leads`);
console.error(`  smartlead_es.csv  ${withEmail.filter((c) => c.lang === 'es').length} leads`);
console.error(`  dm_queue.md       ${noEmail.length} mensajes directos`);
console.error(`  all_scored.csv    ${scored.length} filas`);

// 6. Alta en Notion (opcional)
if (arg('push') && nk && ndb) {
  let ok = 0;
  for (const c of scored.filter((x) => x.score >= 35)) {
    const props = {
      Nombre: P.title(c.name), Plataforma: P.sel(c.platform), URL: P.url(c.url),
      Idioma: P.sel(['es', 'en'].includes(c.lang) ? c.lang : 'otro'),
      Seguidores: P.num(c.followers), 'Vistas medias': P.num(c.audience),
      'Engagement %': P.num(c.engagement), Score: P.num(c.score), Tier: P.sel(c.tier),
      'Acción': P.sel(c.action), Juegos: P.text((c.games || []).join(' | ')),
      Enlaces: P.text((c.links || []).slice(0, 5).join(' | ')), Email: P.email(c.email),
      'Motivo score': P.text(c.reason), 'Vídeo citado': P.text(c.cited),
      'Detalle del vídeo': P.text(c.detail), Estado: P.status('Sin empezar'),
      Notas: P.text(c.bio || (c.recentTitles || []).slice(0, 4).join(' || ')),
    };
    const r = await notionCreate(nk, ndb, props);
    if (r.object === 'page') ok++; else console.error('Notion:', r.message || 'error', c.name);
  }
  console.error(`${ok} altas en Notion`);
}
