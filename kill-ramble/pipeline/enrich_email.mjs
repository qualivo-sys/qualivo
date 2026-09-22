#!/usr/bin/env node
// Busca el correo de negocio de quien no lo publica en su perfil.
//
// De cada creador sin email ya tenemos sus enlaces (web propia, Linktree, tienda). El
// correo suele estar ahí, en la página de contacto, porque el creador quiere que las
// marcas le escriban. Esto no descubre nada privado: abre páginas públicas y lee lo que
// su dueño puso para ser contactado.
//
//   node pipeline/enrich_email.mjs --in ./out/all_scored.csv --out ./out
//   node pipeline/enrich_email.mjs --in ./out/all_scored.csv --out ./out --limit 40
//
// Sin coste de API: son peticiones HTTP normales.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseCSV, toCSV } from './lib.mjs';

const arg = (n, d) => {
  const i = process.argv.findIndex((a) => a === `--${n}` || a.startsWith(`--${n}=`));
  if (i === -1) return d;
  const a = process.argv[i];
  if (a.includes('=')) return a.split('=').slice(1).join('=');
  const nx = process.argv[i + 1];
  return nx && !nx.startsWith('--') ? nx : true;
};

const inPath = String(arg('in', './out/all_scored.csv'));
const outDir = String(arg('out', './out'));
const limit = +arg('limit', 0) || Infinity;
const concurrency = +arg('concurrency', 6);

// Las redes sociales piden sesión o resuelven un captcha antes de enseñar el correo:
// pedirlas es gastar tiempo para recibir un muro. Se dejan para el mensaje directo.
const MUROS = /(instagram|twitter|x|tiktok|facebook|youtube|twitch|discord|reddit|patreon|kick)\.(com|tv|gg|ee)/i;
// Agregadores de enlaces: la página es pública y suele llevar el correo a la vista.
const AGREGADOR = /(linktr\.ee|beacons\.ai|bio\.link|carrd\.co|linkin\.bio|solo\.to|allmylinks\.com)/i;

const EMAIL = /[\w.+-]+@[\w-]+\.[a-z]{2,24}/gi;
// Direcciones que existen pero no sirven para hablar con una persona.
const BASURA = /(noreply|no-reply|donotreply|example\.|sentry\.io|wixpress|@\d|\.(png|jpg|jpeg|gif|webp|svg|css|js)$)/i;
// Un correo de negocio se anuncia a sí mismo. Se prefiere sobre uno genérico.
const NEGOCIO = /(business|biz|contact|hello|hi|press|partner|sponsor|booking|management|mgmt|inquir)/i;

const paginasDe = (url) => {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (MUROS.test(u.hostname)) return [];
    if (AGREGADOR.test(u.hostname)) return [u.href];
    // En una web propia el correo casi nunca está en la portada.
    const base = `${u.protocol}//${u.hostname}`;
    return [u.href, `${base}/contact`, `${base}/about`, `${base}/business`];
  } catch { return []; }
};

const pedir = async (url) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal, redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; creator-research/1.0)' },
    });
    if (!r.ok) return '';
    const tipo = r.headers.get('content-type') || '';
    if (!/text\/html|application\/json|text\/plain/i.test(tipo)) return '';
    return (await r.text()).slice(0, 400_000);
  } catch { return ''; } finally { clearTimeout(t); }
};

// El fallo que esto evita: los creadores enlazan a sus patrocinadores y a su tienda de
// merchandising, y esas páginas tienen correo propio. La primera versión sacó
// hello@epidemicsound.com para BeckBroPlays y support@rocketmoney.com para Smosh. Escribir
// ahí no es un dato flojo, es escribirle a otra empresa creyendo que es el creador.
// Regla: el dominio del correo tiene que parecerse al nombre del creador.
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
function subcadenaComun(a, b) {
  let mejor = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = i + mejor + 1; j <= a.length; j++) {
      if (b.includes(a.slice(i, j))) mejor = j - i; else break;
    }
  }
  return mejor;
}
const esSuyo = (email, nombre) => {
  const sld = norm((email.split('@')[1] || '').split('.').slice(-2)[0]);
  const n = norm(nombre);
  if (!sld || !n) return false;
  // Un gmail o similar no tiene dominio propio que comparar: se acepta si la parte de
  // antes de la arroba se parece al nombre, que es como los rotula la gente.
  if (/^(gmail|googlemail|outlook|hotmail|yahoo|proton|protonmail|icloud|live|aol)$/.test(sld)) {
    return subcadenaComun(norm(email.split('@')[0]), n) >= 5;
  }
  return subcadenaComun(sld, n) >= 5 || subcadenaComun(n, sld) >= 5;
};

const correosDe = (html) => {
  const vistos = new Set();
  // Un mailto: es una declaración de intenciones; pesa más que un correo suelto.
  for (const m of html.matchAll(/mailto:([^"'?>\s]+)/gi)) vistos.add(decodeURIComponent(m[1]).toLowerCase());
  for (const m of html.matchAll(EMAIL)) vistos.add(m[0].toLowerCase());
  const limpios = [...vistos].filter((e) => !BASURA.test(e) && e.length < 64);
  // Primero el que se presenta como comercial; si no, el primero que haya.
  return limpios.sort((a, b) => (NEGOCIO.test(b) ? 1 : 0) - (NEGOCIO.test(a) ? 1 : 0));
};

const filas = parseCSV(readFileSync(inPath, 'utf8'));
const objetivo = filas
  .filter((r) => !String(r.email || '').trim() && String(r.links || '').trim())
  .filter((r) => paginasDe(String(r.links).split('|')[0].trim()).length || String(r.links).split('|').some((l) => paginasDe(l.trim()).length))
  .sort((a, b) => (+b.followers || 0) - (+a.followers || 0))
  .slice(0, limit);

console.error(`${filas.length} filas · ${objetivo.length} creadores sin correo y con web que visitar`);

const encontrados = [];
let hechos = 0;

async function trabajar(rec) {
  const enlaces = String(rec.links).split('|').map((s) => s.trim()).filter(Boolean);
  // Como mucho tres destinos por creador: pasado eso, el que no lo publica no lo publica.
  const paginas = [...new Set(enlaces.flatMap(paginasDe))].slice(0, 6);
  for (const p of paginas) {
    const html = await pedir(p);
    if (!html) continue;
    const email = correosDe(html).find((e) => esSuyo(e, rec.first_name));
    if (email) {
      encontrados.push({ ...rec, email, email_fuente: p });
      return;
    }
  }
}

const cola = [...objetivo];
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (cola.length) {
    const rec = cola.shift();
    await trabajar(rec);
    if (++hechos % 25 === 0) console.error(`  ${hechos}/${objetivo.length} · ${encontrados.length} correos`);
  }
}));

mkdirSync(outDir, { recursive: true });
const cols = ['email', 'first_name', 'company_name', 'website', 'cited_video', 'video_detail',
  'comparable_game', 'booking_link', 'steam_utm', 'platform', 'followers', 'score', 'tier',
  'action', 'reason', 'lang', 'links', 'email_fuente'];
encontrados.sort((a, b) => (+b.followers || 0) - (+a.followers || 0));
writeFileSync(`${outDir}/enriquecidos.csv`, toCSV(encontrados, cols));

const enZona = encontrados.filter((r) => +r.score >= 55);
console.error(`
RESULTADO
  Visitados            ${objetivo.length}
  Correos encontrados  ${encontrados.length} (${((encontrados.length / Math.max(1, objetivo.length)) * 100).toFixed(0)} %)
  De esos, en zona de contacto  ${enZona.length}

  ${outDir}/enriquecidos.csv

Cada fila trae email_fuente: la página exacta de donde salió el correo, para poder
comprobarlo antes de escribir a nadie.`);
