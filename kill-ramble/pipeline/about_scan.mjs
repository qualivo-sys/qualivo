#!/usr/bin/env node
// Segunda pasada sobre quien no tiene correo: lee lo que el creador publica en su
// propio perfil. En YouTube, la descripción de la pestaña «Acerca de»; en Twitch, la
// biografía, los paneles y las redes del canal. Solo texto público: el botón de
// «Ver dirección de correo» de YouTube va tras un captcha y ese no se toca.
//
// Primera prueba (24 sep): 10 correos de 43 creadores que ya habían pasado por
// enrich_email.mjs sin resultado. Los correos salen del perfil del propio creador, así
// que no hace falta el filtro de dominio que enrich_email aplica a webs de terceros.
//
//   node pipeline/about_scan.mjs --in ./out/all_scored.csv --out ./out
//   node pipeline/about_scan.mjs --in ./out/all_scored.csv --out ./out --min 55

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseCSV, toCSV } from './lib.mjs';

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const inPath = arg('in', './out/all_scored.csv');
const outDir = arg('out', './out');
const min = +arg('min', 55);

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,24}/gi;
// Patrocinadores y plataformas que aparecen en descripciones y no son el creador.
const AJENO = /(noreply|no-reply|example\.|sentry|wixpress|\.png|\.jpg|streamelements|streamlabs|epidemicsound|nordvpn|rocketmoney|gamersupps|manscaped|raidshadow|audible|squarespace|expressvpn|surfshark|google\.com|youtube\.com|w3\.org)/i;
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' };
// El cliente web público de Twitch: devuelve lo mismo que ve cualquier visitante.
const TWITCH_WEB_CLIENT = 'kimne78kx3ncx6brgo4mv6wki5h1ko';

const correos = (txt) => [...new Set((String(txt).match(EMAIL) || []).map((e) => e.toLowerCase()))].filter((e) => !AJENO.test(e));

async function youtube(url) {
  const r = await fetch(url.replace(/\/+$/, '').replace(/\/about$/, '') + '/about', { headers: UA });
  const html = await r.text();
  const m = html.match(/"description":\{"simpleText":"(.*?)"\}/) || html.match(/"description":"(.*?)","/);
  return correos(m ? m[1].replace(/\\n/g, ' ') : '');
}

async function twitch(url) {
  const login = url.split('twitch.tv/')[1]?.replace(/\/.*/, '');
  if (!login) return [];
  const r = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    headers: { 'Client-ID': TWITCH_WEB_CLIENT, 'Content-Type': 'application/json', ...UA },
    body: JSON.stringify({ query: `query{user(login:${JSON.stringify(login)}){description panels{... on DefaultPanel{title description linkURL}}}}` }),
  });
  const u = (await r.json().catch(() => ({})))?.data?.user || {};
  return correos([u.description, ...(u.panels || []).map((p) => `${p.title || ''} ${p.description || ''} ${p.linkURL || ''}`)].join(' '));
}

const filas = parseCSV(readFileSync(inPath, 'utf8')).filter((r) => +r.score >= min && !String(r.email || '').trim());
console.error(`${filas.length} creadores en zona sin correo`);

const encontrados = [];
for (const r of filas) {
  try {
    const found = r.platform === 'twitch' ? await twitch(r.website) : await youtube(r.website);
    if (found.length) encontrados.push({ ...r, email: found[0], email_fuente: 'perfil del creador' });
  } catch { /* un perfil que no carga no para la pasada */ }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/about_encontrados.csv`, toCSV(encontrados, [...Object.keys(filas[0] || {}), 'email_fuente']));
console.error(`${encontrados.length} correos encontrados (${Math.round((encontrados.length / Math.max(1, filas.length)) * 100)} %) → ${outDir}/about_encontrados.csv`);
