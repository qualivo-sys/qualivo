#!/usr/bin/env node
// Agrega los vídeos devueltos por Apify (streamers/youtube-scraper) en canales y
// produce el CSV de entrada de score.mjs.
// Uso: node tools/yt_aggregate.mjs items.json > creators.csv

import { readFileSync } from 'node:fs';

const CORE = ['gang beasts', 'party animals', 'stick fight', 'pummel party', 'rubber bandits', 'havocado', 'move or die'];
const ADJ = ['meccha chameleon', 'mecha chameleon', 'bombanana', 'mimic party', 'machine party', 'peak', 'r.e.p.o', 'repo',
  'human fall flat', 'fall guys', 'chained together', 'crab game', 'duck game', 'boomerang fu',
  'ultimate chicken horse', 'golf with your friends', 'knight squad', 'bopl battle', 'stumble guys'];
const ES_WORDS = /\b(con amigos|momentos|gracioso|graciosos|divertidos|jugando|partida|amigos|español|latino|risas|locura|el|la|los|las|de|que|para|muy|nos|pero)\b/gi;
const EN_WORDS = /\b(funny moments|with friends|the|and|we|our|this|that|best|moments|gameplay|hilarious)\b/gi;

const items = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const now = Date.now();
const byChannel = new Map();

for (const v of items) {
  const url = v.channelUrl || (v.channelUsername ? `https://www.youtube.com/@${v.channelUsername}` : null);
  if (!url) continue;
  const c = byChannel.get(url) || {
    nombre: v.channelName, plataforma: 'youtube', url, subs: v.numberOfSubscribers || 0,
    videos: [], core: new Set(), adj: new Set(), collabs: new Set(), links: new Set(), emails: new Set(),
    es: 0, en: 0,
  };
  const t = `${v.title || ''} ${(v.text || '').slice(0, 400)}`.toLowerCase();
  for (const g of CORE) if (t.includes(g)) c.core.add(g);
  for (const g of ADJ) if (t.includes(g)) c.adj.add(g);
  c.es += (t.match(ES_WORDS) || []).length;
  c.en += (t.match(EN_WORDS) || []).length;
  for (const col of v.collaborators || []) c.collabs.add(typeof col === 'string' ? col : col.name || col.channelName || JSON.stringify(col));
  for (const l of v.descriptionLinks || []) {
    const u = typeof l === 'string' ? l : l.url || '';
    if (u) c.links.add(u);
  }
  const em = `${v.text || ''}`.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || [];
  for (const e of em) if (!/\.(png|jpg|gif)$/i.test(e)) c.emails.add(e.toLowerCase());
  c.videos.push({ views: v.viewCount || 0, likes: v.likes || 0, comments: v.commentsCount || 0, date: v.date ? new Date(v.date).getTime() : 0, matched: true });
  byChannel.set(url, c);
}

const q = (s) => { s = String(s ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const header = ['nombre','plataforma','url','idioma','seguidores','engagement_pct','publicaciones_mes','ultimo_post_dias','genero_pct','comparables_nucleo','comparables_adyacentes','indie_pct','email','keymailer','respondio_antes','squad','pide_pago','descartar','videos_encontrados','vistas_medias','juegos','colaboradores','enlaces'];
process.stdout.write(header.join(',') + '\n');

for (const c of byChannel.values()) {
  const n = c.videos.length;
  const views = c.videos.reduce((a, b) => a + b.views, 0) / n;
  const engRaw = c.videos.reduce((a, b) => a + (b.views ? (b.likes + b.comments) / b.views : 0), 0) / n;
  const last = Math.max(...c.videos.map((v) => v.date));
  const lastDays = last ? Math.round((now - last) / 86400000) : 999;
  // Solo vemos los vídeos que coinciden con la búsqueda: publicaciones_mes y genero_pct son
  // estimaciones parciales que la revisión humana completa mirando el canal.
  const idioma = c.es > c.en ? 'es' : 'en';
  const row = {
    nombre: c.nombre, plataforma: 'youtube', url: c.url, idioma,
    seguidores: c.subs, engagement_pct: (engRaw * 100).toFixed(2),
    publicaciones_mes: '', ultimo_post_dias: lastDays,
    genero_pct: Math.min(100, n * 10 + (c.core.size + c.adj.size) * 10),
    comparables_nucleo: c.core.size, comparables_adyacentes: c.adj.size, indie_pct: '',
    email: [...c.emails][0] || '', keymailer: 0, respondio_antes: 0,
    squad: c.collabs.size > 0 ? 1 : 0, pide_pago: 0, descartar: 0,
    videos_encontrados: n, vistas_medias: Math.round(views),
    juegos: [...c.core, ...c.adj].join(' | '), colaboradores: [...c.collabs].join(' | '),
    enlaces: [...c.links].filter((u) => /linktr|twitter|x\.com|twitch|tiktok|discord|instagram|mailto/i.test(u)).slice(0, 6).join(' | '),
  };
  process.stdout.write(header.map((k) => q(row[k])).join(',') + '\n');
}
console.error(`${items.length} vídeos → ${byChannel.size} canales`);
