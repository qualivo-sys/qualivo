#!/usr/bin/env node
// Pasada diaria de descubrimiento: junta en una sola ejecución todas las fuentes que
// dan correos de creadores y deja dos ficheros, uno para Smartlead y otro para la cola
// de mensajes directos. La revisión y la carga las hace después una persona (o Claude).
//
// Fuentes, de más a menos rendimiento medido (30 sep):
//   1. API de YouTube: vídeos recientes de los juegos comparables, en inglés, español y
//      portugués. El correo sale de la descripción del canal. Rota juegos y regiones
//      cada día para no repetir canales.
//   2. Instagram de los canales de YouTube sin correo: se leen los enlaces de su pestaña
//      «Acerca de» y la biografía del Instagram (vía Apify). Ahí suele estar el contacto
//      comercial o el de la agencia.
//   3. Directorio en directo de Twitch: biografía con correo y redes. Rinde poco a primera
//      hora de la mañana europea, cuando hay pocos directos.
// Apollo se probó y no sirve para esto: sus «creadores de gaming» no traen canal ni correo.
//
//   node pipeline/daily.mjs --env ruta/.env --exclude ruta/ya_contactados.txt --out ./out_diario \
//     --campanas 3974838,4001007,3974839,4018188,4025816
//   (--dia N fuerza la rotación de un día concreto; --sin-apify se salta Instagram)
//   Las claves salen del entorno (YOUTUBE_API_KEY, SMARTLEAD_API_KEY, APIFY_TOKEN) o del .env.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseCSV, toCSV } from './lib.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const envPath = arg('env', '.env');
const excludePath = arg('exclude', null);
const outDir = arg('out', './out_diario');
const dia = +arg('dia', Math.floor(Date.now() / 864e5));
const conApify = !process.argv.includes('--sin-apify');
const maxInstagram = +arg('max-instagram', 120);
mkdirSync(outDir, { recursive: true });

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,24}/gi;
const AJENO = /(noreply|no-reply|example\.|sentry|wixpress|\.png|\.jpg|streamelements|streamlabs|epidemicsound|nordvpn|gamersupps|manscaped|raidshadow|audible|squarespace|expressvpn|surfshark|google\.com|youtube\.com|w3\.org)/i;
const correos = (t) => [...new Set((String(t || '').match(EMAIL) || []).map((e) => e.toLowerCase()))].filter((e) => !AJENO.test(e));
const excluidos = new Set();
if (excludePath && existsSync(excludePath)) for (const l of readFileSync(excludePath, 'utf8').split('\n')) if (l.trim()) excluidos.add(l.trim().toLowerCase());
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.error(...a);
// Quien ya está en alguna campaña queda fuera aunque falte el fichero de exclusión:
// Smartlead es la fuente de verdad de a quién se ha escrito.
for (const id of String(arg('campanas', '')).split(',').filter(Boolean)) {
  for (let off = 0; ; off += 100) {
    let d = [];
    try {
      d = JSON.parse(execFileSync('node', [join(aqui, 'api.mjs'), '--env', envPath, 'smartlead', 'GET', `/campaigns/${id}/leads?offset=${off}&limit=100`],
        { encoding: 'utf8', maxBuffer: 1e8 })).data || [];
    } catch { log(`  no pude leer la campaña ${id}`); }
    for (const l of d) if (l.lead?.email) excluidos.add(l.lead.email.toLowerCase());
    if (d.length < 100) break;
  }
}
log(`${excluidos.size} correos ya contactados o descartados`);

// ---------- 1. YouTube: rotación diaria de juegos y regiones ----------
const JUEGOS = ['PEAK', 'R.E.P.O.', 'Gang Beasts', 'Party Animals', 'Stick Fight', 'Pummel Party', 'Human Fall Flat', 'Mimic Party',
  'Meccha Chameleon', 'Chained Together', 'Lethal Company', 'Content Warning', 'Rubber Bandits', 'Ultimate Chicken Horse',
  'Golf With Your Friends', 'Pico Park', 'Fall Guys', 'Heave Ho', 'Boomerang Fu', 'Totally Accurate Battle Simulator'];
const REGIONES = {
  en: [['US', 'GB'], ['CA', 'AU'], ['US', 'IE'], ['GB', 'NZ'], ['US', 'CA']],
  es: [['MX', 'AR'], ['CO', 'CL'], ['ES', 'PE'], ['MX', 'ES'], ['AR', 'UY']],
  pt: [['BR']],
};
const rota = (lista, n, desfase) => Array.from({ length: n }, (_, i) => lista[(dia * n + desfase + i) % lista.length]);
const conCorreo = [];
const sinCorreo = [];
for (const [lang, juegos, paginas] of [['en', 8, 2], ['es', 8, 2], ['pt', 8, 2]]) {
  const regiones = REGIONES[lang][dia % REGIONES[lang].length];
  const games = rota(JUEGOS, juegos, lang === 'es' ? 7 : lang === 'pt' ? 13 : 0);
  const dir = join(outDir, `yt_${lang}`);
  log(`YouTube ${lang} · ${regiones.join(',')} · ${games.join(', ')}`);
  try {
    execFileSync('node', [join(aqui, 'yt_api_discover.mjs'), '--env', envPath, '--out', dir, ...(excludePath ? ['--exclude', excludePath] : []),
      '--lang', lang, '--regions', regiones.join(','), '--games', games.join(','), '--order', 'date', '--days', '45',
      '--min-subs', '2000', '--pages', String(paginas)], { stdio: ['ignore', 'ignore', 'inherit'] });
  } catch { log(`  pasada ${lang} con error; sigo con lo que haya`); }
  if (existsSync(`${dir}/yt_api_leads.csv`)) for (const r of parseCSV(readFileSync(`${dir}/yt_api_leads.csv`, 'utf8'))) conCorreo.push({ ...r, lang, fuente: 'youtube' });
  if (existsSync(`${dir}/yt_api_sin_correo.csv`)) for (const r of parseCSV(readFileSync(`${dir}/yt_api_sin_correo.csv`, 'utf8'))) sinCorreo.push(r);
}
log(`YouTube: ${conCorreo.length} con correo, ${sinCorreo.length} sin correo`);

// ---------- 2. Redes de los canales sin correo: pestaña «Acerca de» ----------
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' };
const RED = /(instagram\.com|x\.com|twitter\.com|tiktok\.com|twitch\.tv)(?:%2F|\/)(@?[A-Za-z0-9_.]{2,40})/g;
const NO_PERFIL = /^(p|reel|reels|explore|stories|share|intent|hashtag|home|search|i)$/i;
const redesDe = (html) => {
  const out = {};
  for (const m of html.replace(/\\u0026/g, '&').matchAll(RED)) {
    const tipo = m[1].includes('instagram') ? 'Instagram' : m[1].includes('tiktok') ? 'TikTok' : m[1].includes('twitch') ? 'Twitch' : 'X';
    const h = m[2].replace(/^@/, '');
    if (NO_PERFIL.test(h) || out[tipo]) continue;
    out[tipo] = tipo === 'Instagram' ? `https://www.instagram.com/${h}` : tipo === 'TikTok' ? `https://www.tiktok.com/@${h}` : tipo === 'Twitch' ? `https://www.twitch.tv/${h}` : `https://x.com/${h}`;
  }
  return out;
};
const vistos = new Set();
for (const c of sinCorreo) {
  if (vistos.has(c.channel_id)) continue;
  vistos.add(c.channel_id);
  try {
    const html = await (await fetch(`${c.website}/about`, { headers: UA })).text();
    c.redes = redesDe(html);
  } catch { c.redes = {}; }
  await dormir(300);
}
const conRedes = sinCorreo.filter((c) => c.redes && Object.keys(c.redes).length);
log(`Acerca de: ${conRedes.length} de ${vistos.size} canales sin correo publican alguna red`);

// ---------- 3. Twitch en directo (curl: el fetch de Node no pasa la comprobación de Twitch) ----------
const TW = ['PEAK', 'R.E.P.O.', 'Gang Beasts', 'Party Animals', 'Pummel Party', 'Human: Fall Flat', 'Lethal Company', 'Content Warning',
  'Chained Together', 'Ultimate Chicken Horse', 'Fall Guys', 'Mimic Party', 'Stick Fight: The Game', 'Golf With Your Friends', 'Pico Park'];
const gql = (query) => {
  for (let i = 0; i < 3; i++) {
    try {
      const j = JSON.parse(execFileSync('curl', ['-s', '-m', '20', 'https://gql.twitch.tv/gql', '-H', 'Client-ID: kimne78kx3ncx6brgo4mv6wki5h1ko',
        '-H', 'Content-Type: application/json', '-H', 'User-Agent: Mozilla/5.0', '-d', JSON.stringify({ query })], { encoding: 'utf8' }));
      if (!j.errors) return j;
    } catch { /* reintento */ }
    execFileSync('sleep', [String(2 + i * 3)]);
  }
  return {};
};
const twitch = new Map();
for (const lang of ['en', 'es', 'pt']) for (const g of TW) {
  const j = gql(`query{game(name:${JSON.stringify(g)}){streams(first:100, options:{languages:[${JSON.stringify(lang)}]}){edges{node{viewersCount broadcaster{login displayName description followers{totalCount}}}}}}}`);
  for (const e of j?.data?.game?.streams?.edges || []) {
    const b = e.node.broadcaster;
    if (!b || twitch.has(b.login) || (b.followers?.totalCount || 0) < 1500) continue;
    twitch.set(b.login, { login: b.login, first_name: b.displayName, lang, comparable_game: g, viewers: e.node.viewersCount,
      followers: b.followers.totalCount, email: correos(b.description)[0] || '', website: `https://www.twitch.tv/${b.login}` });
  }
}
for (const t of twitch.values()) {
  const j = gql(`query{user(login:${JSON.stringify(t.login)}){channel{socialMedias{name url}}}}`);
  const urls = (j?.data?.user?.channel?.socialMedias || []).map((s) => s.url).join(' ');
  t.redes = redesDe(urls);
  if (t.email) conCorreo.push({ email: t.email, first_name: t.first_name, company_name: t.comparable_game, website: t.website,
    cited_video: '', video_detail: '', comparable_game: t.comparable_game, platform: 'twitch', followers: t.followers, country: '', lang: t.lang, fuente: 'twitch' });
}
log(`Twitch: ${twitch.size} canales en directo con 1.500+ seguidores, ${[...twitch.values()].filter((t) => t.email).length} con correo`);

// ---------- 4. Instagram: biografía de los perfiles encontrados (Apify) ----------
const perfiles = [
  ...conRedes.filter((c) => c.redes.Instagram).map((c) => ({ ...c, platform: 'youtube' })),
  ...[...twitch.values()].filter((t) => !t.email && t.redes.Instagram).map((t) => ({ ...t, platform: 'twitch' })),
].slice(0, maxInstagram);
if (conApify && perfiles.length) {
  const usernames = perfiles.map((p) => p.redes.Instagram.split('/').pop());
  try {
    const items = JSON.parse(execFileSync('node', [join(aqui, 'api.mjs'), '--env', envPath, 'apify', 'POST',
      '/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?timeout=280', JSON.stringify({ usernames })],
    { encoding: 'utf8', maxBuffer: 1e8, timeout: 320000 }));
    const bio = new Map(items.map((i) => [String(i.username).toLowerCase(), i]));
    let n = 0;
    for (const p of perfiles) {
      const it = bio.get(p.redes.Instagram.split('/').pop().toLowerCase());
      const e = it && correos([it.biography, it.businessEmail, it.publicEmail].join(' '))[0];
      if (!e) continue;
      n++;
      p.email_instagram = e;
      conCorreo.push({ email: e, first_name: p.first_name, company_name: p.comparable_game, website: p.website, cited_video: '',
        video_detail: '', video_title: p.video_title || '', comparable_game: p.comparable_game, platform: p.platform,
        followers: p.followers, country: p.country || '', lang: p.lang, fuente: 'instagram' });
    }
    log(`Instagram: ${n} correos en ${items.length} biografías`);
  } catch (e) { log(`Instagram sin respuesta (${String(e.message).slice(0, 80)})`); }
}

// ---------- Salida ----------
const unicos = [...new Map(conCorreo.filter((r) => r.email && !excluidos.has(r.email.toLowerCase())).map((r) => [r.email.toLowerCase(), r])).values()];
writeFileSync(`${outDir}/con_correo.csv`, toCSV(unicos, ['email', 'first_name', 'company_name', 'website', 'cited_video', 'video_detail',
  'video_title', 'comparable_game', 'platform', 'followers', 'country', 'lang', 'fuente']));
const dm = [
  ...conRedes.filter((c) => !c.email_instagram).map((c) => ({ nombre: c.first_name, plataforma: 'youtube', seguidores: +c.followers, idioma: c.lang,
    canal: c.website, juego: c.comparable_game, video: c.video_title, redes: Object.entries(c.redes).map(([tipo, url]) => ({ tipo, url })) })),
  ...[...twitch.values()].filter((t) => !t.email && Object.keys(t.redes).length).map((t) => ({ nombre: t.first_name, plataforma: 'twitch',
    seguidores: t.followers, idioma: t.lang, canal: t.website, juego: t.comparable_game, video: '', redes: Object.entries(t.redes).map(([tipo, url]) => ({ tipo, url })) })),
];
writeFileSync(`${outDir}/para_dm.json`, JSON.stringify(dm, null, 1));
log(`\nListo: ${unicos.length} creadores con correo nuevo → ${outDir}/con_correo.csv · ${dm.length} para mensaje directo → ${outDir}/para_dm.json`);
