#!/usr/bin/env node
// Descubrimiento con la API oficial de YouTube (gratis: 10.000 unidades al día).
//
// Busca vídeos recientes de los juegos comparables, lee la descripción de cada canal
// y se queda con los que publican un correo de negocio. Sale una lista lista para
// Smartlead, con el vídeo concreto que citar en el correo.
//
// Coste por pasada: cada búsqueda gasta 100 unidades; canales y vídeos, 1 por cada 50.
// Con las consultas de abajo y dos regiones son unas 3.000 unidades.
//
//   YOUTUBE_API_KEY=... node pipeline/yt_api_discover.mjs --out ./out --exclude ./ya_contactados.txt
//   (o --env ruta/.env para leer la clave de ahí; la clave nunca va al repositorio)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { toCSV } from './lib.mjs';

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const outDir = arg('out', './out');
const envPath = arg('env', null);
const excludePath = arg('exclude', null);
const days = +arg('days', 120);
const minSubs = +arg('min-subs', 5000);
const maxSubs = +arg('max-subs', 3000000);

let KEY = process.env.YOUTUBE_API_KEY;
if (!KEY && envPath) KEY = (readFileSync(envPath, 'utf8').match(/^YOUTUBE_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error('Falta YOUTUBE_API_KEY'); process.exit(2); }

// Juegos con el mismo público: party brawlers y cooperativos de caos entre amigos.
const JUEGOS = ['PEAK', 'R.E.P.O.', 'Gang Beasts', 'Party Animals', 'Stick Fight', 'Pummel Party', 'Human Fall Flat',
  'Mimic Party', 'Meccha Chameleon', 'Bombanana', 'Chained Together', 'Lethal Company', 'Content Warning', 'Rubber Bandits'];
// «peak» es también jerga en inglés («this is peak»): el juego se busca con contexto y
// el título tiene que traerlo en mayúsculas, como lo escriben quienes lo juegan.
const CONSULTA = { PEAK: 'PEAK game friends' };
const EN_TITULO = (juego, t) => juego === 'PEAK' ? /\bPEAK\b/.test(t) : t.toLowerCase().includes(juego.toLowerCase().replace(/\.$/, ''));
// Recopilatorios de shorts, dibujo y contenido infantil: mucho alcance, nadie que juegue con nosotros.
const RELLENO = /#shorts|\b(ytp|bluey|drawing|how to draw|my singing monsters|msm|tier list|top \d+|ranking|funny moments \(part)/i;
// Mercados que decidió el estudio: EE. UU. primero, Europa después. LATAM fuera.
const REGIONES = ['US', 'GB'];
const PAISES_OK = new Set(['US', 'CA', 'GB', 'IE', 'AU', 'NZ', 'DE', 'NL', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'CH', 'FR', 'IT', 'PT', 'PL', 'ES']);

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,24}/gi;
const AJENO = /(noreply|no-reply|example\.|epidemicsound|nordvpn|gamersupps|manscaped|raidshadow|audible|squarespace|expressvpn|surfshark|youtube\.com|google\.com)/i;
// Títulos en idiomas que no trabajamos: se descartan antes de gastar cuota en el canal.
const OTRO_IDIOMA = /[Ѐ-ӿ؀-ۿऀ-෿฀-๿぀-ヿ一-鿿가-힯]|\b(jogando|jugando|amigos|mit freunden|avec|zagrałem)\b/i;

const api = async (path, params) => {
  const u = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: KEY })) u.searchParams.set(k, v);
  const r = await fetch(u);
  const j = await r.json();
  if (j.error) throw new Error(`${path}: ${j.error.message}`);
  return j;
};

const excluidos = new Set();
if (excludePath && existsSync(excludePath)) {
  for (const l of readFileSync(excludePath, 'utf8').split('\n')) if (l.trim()) excluidos.add(l.trim().toLowerCase());
}

const desde = new Date(Date.now() - days * 864e5).toISOString();
const videos = new Map(); // channelId -> mejor vídeo encontrado
let unidades = 0;
for (const juego of JUEGOS) {
  for (const region of REGIONES) {
    const j = await api('search', { part: 'snippet', q: CONSULTA[juego] || juego, type: 'video', maxResults: 50, order: 'viewCount',
      publishedAfter: desde, regionCode: region, relevanceLanguage: 'en' });
    unidades += 100;
    for (const it of j.items || []) {
      const t = it.snippet.title;
      if (OTRO_IDIOMA.test(t) || RELLENO.test(t) || !EN_TITULO(juego, t)) continue;
      if (!videos.has(it.snippet.channelId)) videos.set(it.snippet.channelId, { videoId: it.id.videoId, title: t, juego });
    }
  }
}
console.error(`${videos.size} canales distintos con un vídeo reciente de los juegos comparables`);

// Descripción, país y suscriptores de cada canal, de 50 en 50.
const ids = [...videos.keys()];
const canales = [];
for (let i = 0; i < ids.length; i += 50) {
  const j = await api('channels', { part: 'snippet,statistics', id: ids.slice(i, i + 50).join(','), maxResults: 50 });
  unidades += 1;
  canales.push(...(j.items || []));
}

// Visitas del vídeo citado, para poder decir «el que llegó a 300.000 visitas».
const vids = [...videos.values()].map((v) => v.videoId);
const vistas = new Map();
for (let i = 0; i < vids.length; i += 50) {
  const j = await api('videos', { part: 'statistics', id: vids.slice(i, i + 50).join(',') });
  unidades += 1;
  for (const v of j.items || []) vistas.set(v.id, +v.statistics.viewCount || 0);
}

const nf = new Intl.NumberFormat('en-US');
const leads = [];
for (const c of canales) {
  const subs = +c.statistics.subscriberCount || 0;
  const pais = c.snippet.country || '';
  if (subs < minSubs || subs > maxSubs) continue;
  if (pais && !PAISES_OK.has(pais)) continue;
  const correos = [...new Set((c.snippet.description.match(EMAIL) || []).map((e) => e.toLowerCase()))].filter((e) => !AJENO.test(e));
  if (!correos.length || excluidos.has(correos[0])) continue;
  const v = videos.get(c.id);
  const views = vistas.get(v.videoId) || 0;
  const titulo = v.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[\u{1F000}-\u{1FAFF}☀-➿️‍]/gu, '').replace(/\s{2,}/g, ' ').trim();
  const corto = titulo.length > 70 ? titulo.slice(0, 69) + '…' : titulo;
  leads.push({
    email: correos[0], first_name: c.snippet.title, company_name: v.juego,
    website: c.snippet.customUrl ? `https://www.youtube.com/${c.snippet.customUrl}` : `https://www.youtube.com/channel/${c.id}`,
    cited_video: `your video "${corto}"`,
    video_detail: views >= 50000 ? `the one that hit ${nf.format(views)} views` : `the ${v.juego} part`,
    comparable_game: v.juego, platform: 'youtube', followers: subs, country: pais,
  });
}

mkdirSync(outDir, { recursive: true });
leads.sort((a, b) => b.followers - a.followers);
writeFileSync(`${outDir}/yt_api_leads.csv`, toCSV(leads, ['email', 'first_name', 'company_name', 'website', 'cited_video', 'video_detail', 'comparable_game', 'platform', 'followers', 'country']));
console.error(`${canales.length} canales leídos · ${leads.length} con correo y en mercado · ~${unidades} unidades de cuota → ${outDir}/yt_api_leads.csv`);
