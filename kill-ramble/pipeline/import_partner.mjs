#!/usr/bin/env node
// Importa las bases que el estudio deja en Drive y las cruza con la nuestra sin duplicar.
//
//   node pipeline/import_partner.mjs --in ./entrantes --base ./out/all_scored.csv --out ./out
//
// Acepta CSV y TSV. Para Excel y Google Sheets, exportar antes a CSV (el LÉEME de la
// carpeta lo explica). Detecta las columnas solas: no hace falta plantilla.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { parseCSV, toCSV } from './lib.mjs';
import { buildIndex, findMatch, parseHandle, normEmail } from './identity.mjs';
import { scoreCreator } from './score.mjs';
import { detectLang } from './normalize.mjs';

// Alias de columnas, en español e inglés. Lo que no se reconozca se guarda en «extra».
const ALIAS = {
  name: ['nombre', 'name', 'creador', 'creator', 'usuario', 'user', 'handle', 'nick', 'medio', 'outlet', 'contacto', 'contact', 'canal', 'channel'],
  url: ['url', 'enlace', 'link', 'perfil', 'profile', 'canal url', 'channel url', 'canal', 'channel', 'web', 'website', 'twitch', 'youtube', 'tiktok', 'twitter', 'x'],
  email: ['email', 'e-mail', 'correo', 'mail', 'email de contacto', 'contact email'],
  platform: ['plataforma', 'platform', 'red', 'network', 'tipo', 'type'],
  followers: ['seguidores', 'followers', 'subs', 'suscriptores', 'subscribers', 'audiencia', 'audience'],
  lang: ['idioma', 'language', 'lang', 'pais', 'país', 'country', 'region'],
  notes: ['notas', 'notes', 'comentarios', 'comments', 'estado', 'status', 'observaciones'],
};
const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
function mapColumns(headers) {
  const map = {};
  for (const h of headers) {
    const n = norm(h);
    for (const [field, aliases] of Object.entries(ALIAS)) {
      if (map[field]) continue;
      if (aliases.some((a) => n === a || n.startsWith(a + ' ') || n.endsWith(' ' + a))) { map[field] = h; break; }
    }
  }
  return map;
}

// Una fila suya -> nuestro registro. Recoge URLs de cualquier columna, no solo de la mapeada.
function toRecord(row, map, source) {
  const get = (f) => (map[f] ? row[map[f]] : '');
  const allValues = Object.values(row).join(' ');
  const LINK = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be|twitch\.tv|tiktok\.com|twitter\.com|x\.com|instagram\.com)\/[^\s,;|"]+/gi;
  const urls = [...new Set([...(allValues.match(LINK) || []), ...(allValues.match(/https?:\/\/[^\s,;|]+/gi) || [])]
    .map((u) => u.replace(/[).,]+$/, '')))];
  const emails = [...new Set((allValues.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi) || []))];
  const url = get('url') || urls[0] || '';
  const p = parseHandle(url) || parseHandle(get('name'));
  const extra = Object.entries(row)
    .filter(([k, v]) => v && !Object.values(map).includes(k))
    .map(([k, v]) => `${k}: ${v}`).join(' · ');

  const notes = [get('notes'), extra].filter(Boolean).join(' · ');
  return {
    name: get('name') || (p && p.handle) || '',
    url, links: urls,
    email: normEmail(get('email') || emails[0]) || '',
    platform: norm(get('platform')) || (p && p.platform && p.platform.replace('-id', '')) || '',
    followers: parseInt(String(get('followers')).replace(/[^\d]/g, ''), 10) || 0,
    lang: /^(es|esp|español|spanish|latam|ar|mx|cl|co|pe|españa)/i.test(get('lang')) ? 'es'
      : /^(en|ing|english|us|uk|usa)/i.test(get('lang')) ? 'en'
      : detectLang(`${get('name')} ${notes}`, ''),
    notes, source, games: [], audience: 0,
  };
}

const arg = (n, d) => {
  const i = process.argv.findIndex((a) => a === `--${n}` || a.startsWith(`--${n}=`));
  if (i === -1) return d;
  const a = process.argv[i];
  if (a.includes('=')) return a.split('=').slice(1).join('=');
  const nx = process.argv[i + 1];
  return nx && !nx.startsWith('--') ? nx : true;
};

const inDir = String(arg('in', './entrantes'));
const basePath = String(arg('base', './out/all_scored.csv'));
const outDir = String(arg('out', './out'));
mkdirSync(outDir, { recursive: true });

// Nuestra base actual
let base = [];
try { base = parseCSV(readFileSync(basePath, 'utf8')).map((r) => ({ ...r, name: r.first_name || r.name, url: r.website || r.url })); }
catch { console.error(`Aviso: no se pudo leer ${basePath}; se cruzará solo entre archivos entrantes`); }
const idx = buildIndex(base);
console.error(`Base actual: ${base.length} creadores`);

const files = readdirSync(inDir).filter((f) => ['.csv', '.tsv', '.txt'].includes(extname(f).toLowerCase()));
if (!files.length) { console.error(`No hay CSV ni TSV en ${inDir}`); process.exit(0); }

const nuevos = [], yaEstaban = [], porRevisar = [], sinDatos = [];
const seenNew = new Map();

for (const f of files) {
  let text = readFileSync(join(inDir, f), 'utf8');
  if (extname(f).toLowerCase() === '.tsv' || (text.split('\n')[0].includes('\t') && !text.split('\n')[0].includes(','))) {
    text = text.split('\n').map((l) => l.split('\t').map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n');
  }
  const rows = parseCSV(text);
  if (!rows.length) continue;
  const map = mapColumns(Object.keys(rows[0]));
  console.error(`\n${f}: ${rows.length} filas · columnas detectadas: ${Object.entries(map).map(([k, v]) => `${k}=${v}`).join(', ') || 'ninguna'}`);

  for (const row of rows) {
    const rec = toRecord(row, map, basename(f));
    if (!rec.url && !rec.email && !rec.name) { sinDatos.push({ archivo: f, fila: JSON.stringify(row).slice(0, 200) }); continue; }
    const hit = findMatch(idx, rec) || findMatch(idx, rec, { allowNameOnly: true });
    if (hit && hit.by.startsWith('name:')) {
      porRevisar.push({ nombre: rec.name, url: rec.url, email: rec.email,
        posible_duplicado_de: hit.match.name || hit.match.first_name,
        plataforma_suya: rec.platform || '(sin dato)', plataforma_nuestra: hit.match.platform || '',
        notas: rec.notes.slice(0, 200), archivo: f });
      continue;
    }
    if (hit) {
      yaEstaban.push({ nombre: rec.name, url: rec.url, coincide_con: hit.match.name || hit.match.first_name,
        por: hit.by, aporta_email: rec.email && !hit.match.email ? rec.email : '',
        aporta_notas: rec.notes.slice(0, 200), archivo: f });
      continue;
    }
    const dup = findMatch(buildIndex([...seenNew.values()]), rec);
    if (dup) { yaEstaban.push({ nombre: rec.name, url: rec.url, coincide_con: dup.match.name, por: dup.by + ' (duplicado dentro de vuestras listas)', archivo: f }); continue; }
    const s = scoreCreator({ ...rec, platform: rec.platform || 'youtube' });
    nuevos.push({ ...rec, ...s, links: rec.links.join(' | ') });
    seenNew.set(rec.url || rec.email || rec.name, rec);
  }
}

const cols = ['name', 'platform', 'url', 'email', 'lang', 'followers', 'score', 'tier', 'action', 'reason', 'links', 'notes', 'source'];
writeFileSync(`${outDir}/partner_nuevos.csv`, toCSV(nuevos.sort((a, b) => b.score - a.score), cols));
writeFileSync(`${outDir}/partner_ya_estaban.csv`, toCSV(yaEstaban, ['nombre', 'url', 'coincide_con', 'por', 'aporta_email', 'aporta_notas', 'archivo']));
if (porRevisar.length) writeFileSync(`${outDir}/partner_por_revisar.csv`, toCSV(porRevisar, ['nombre', 'url', 'email', 'posible_duplicado_de', 'plataforma_suya', 'plataforma_nuestra', 'notas', 'archivo']));
if (sinDatos.length) writeFileSync(`${outDir}/partner_sin_datos.csv`, toCSV(sinDatos, ['archivo', 'fila']));

const enriquece = yaEstaban.filter((r) => r.aporta_email).length;
console.error(`
INFORME
  Archivos leídos      ${files.length}
  Ya los teníamos      ${yaEstaban.length}${enriquece ? ` (${enriquece} nos aportan un email que nos faltaba)` : ''}
  Nuevos               ${nuevos.length}
  Coinciden solo por nombre, a revisar a mano  ${porRevisar.length}
  Sin datos para cruzar ${sinDatos.length}

  De los nuevos: ${nuevos.filter((n) => n.score >= 55).length} en zona de contacto, ${nuevos.filter((n) => n.email).length} con email.

Archivos en ${outDir}/: partner_nuevos.csv, partner_ya_estaban.csv${porRevisar.length ? ', partner_por_revisar.csv' : ''}${sinDatos.length ? ', partner_sin_datos.csv' : ''}`);
