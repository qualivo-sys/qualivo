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
  followers: ['seguidores', 'followers', 'subs', 'suscriptores', 'subscribers', 'audiencia', 'audience', 'alcance'],
  lang: ['idioma', 'language', 'lang', 'pais', 'país', 'country', 'region'],
  notes: ['notas', 'notes', 'comentarios', 'comments', 'estado', 'status', 'observaciones', 'motivo', 'oportunidad'],
};
// Los guiones bajos cuentan como espacios: «email_profesional» es «email profesional».
const norm = (s) => String(s || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

// La cabecera propone; el contenido decide. Una columna «tipo_de_perfil» encaja con el
// alias «perfil» de url, pero no contiene ni una URL: mirar los valores evita ese error.
const SHAPE = {
  url: (v) => /(https?:\/\/|\w\.(com|net|org|tv|io|gg|es)\b)/i.test(v),
  email: (v) => /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(v),
  followers: (v) => /\d/.test(v),
};

// Cuando varias columnas encajan en el mismo campo, gana la que más valores válidos trae.
// Sus listas suelen traer «nombre» vacío junto a «nombre_publico» completo, y quedarnos
// con la primera por orden de columna nos dejaba sin nombre con el que cruzar.
function mapColumns(headers, rows) {
  const score = (field, h) => {
    const ok = SHAPE[field] || ((v) => !!v);
    return rows.reduce((n, r) => n + (ok(String(r[h] ?? '').trim()) ? 1 : 0), 0);
  };
  const map = {};
  for (const [field, aliases] of Object.entries(ALIAS)) {
    const cands = headers.filter((h) => {
      const n = norm(h);
      return aliases.some((a) => n === a || n.startsWith(a + ' ') || n.endsWith(' ' + a));
    }).filter((h) => !Object.values(map).includes(h));
    const best = cands.reduce((b, h) => (score(field, h) > score(field, b) ? h : b), cands[0]);
    // Una columna sin un solo valor con la forma esperada no es esa columna.
    if (best && score(field, best) > 0) map[field] = best;
  }
  return map;
}

// «1,25 M de suscriptores en YouTube y 296.000 seguidores en X; observado 2026-09-18».
// Quitar todo lo que no sea dígito daba 125296000202609018. Se leen las cifras con su
// unidad, se descartan las que son fechas y se devuelve la mayor: la audiencia principal.
export function parseAudience(raw) {
  const t = String(raw || '');
  if (!t.trim()) return 0;
  const NUM = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?|\d+(?:[.,]\d+)?)\s*(millones|million|mill|m|mil|k)?\b/gi;
  const GENTE = /^\W*(de\s+)?(suscriptor|subscriber|seguidor|follower|miembro|member|fan|abonad)/i;
  const VANIDAD = /^\W*(de\s+)?(vista|view|reproduc|p[áa]gina|impres|descarga|download)/i;

  let personas = 0, suelto = 0;
  for (const m of t.matchAll(NUM)) {
    const [whole, digits, unitRaw] = m;
    const unit = (unitRaw || '').toLowerCase();
    if (!unit && /^(19|20)\d\d$/.test(digits)) continue;                  // un año no es audiencia
    if (/\d{4}-\d{2}-\d{2}/.test(t.slice(Math.max(0, m.index - 12), m.index + whole.length))) continue;

    let n = +digits.replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.');    // 296.000 / 1,25
    if (!Number.isFinite(n)) continue;
    if (unit === 'mil' || unit === 'k') n *= 1e3;
    else if (unit.startsWith('m')) n *= 1e6;
    if (n <= 0 || n >= 5e8) continue;

    // Lo que sigue al número dice si son personas o vanidad.
    const cola = t.slice(m.index + whole.length, m.index + whole.length + 24);
    if (VANIDAD.test(cola)) continue;
    if (GENTE.test(cola)) personas = Math.max(personas, n);
    else suelto = Math.max(suelto, n);
  }
  // Manda el número que cuenta personas; el suelto solo si no hay ninguno.
  return Math.round(personas || suelto);
}

// Prensa y creadores no se trabajan igual: distinto mensaje, distinta oferta, distinto
// ritmo. Separarlos aquí evita meter a un redactor de IGN en una secuencia de playtest.
const PRENSA = /(periodist|medio|editor|reviewer|redact|cr[íi]tic|newsletter|journalis|outlet|press)/i;

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
    followers: parseAudience(get('followers')),
    lang: /^(es|esp|español|spanish|latam|ar|mx|cl|co|pe|españa)/i.test(get('lang')) ? 'es'
      : /^(en|ing|english|us|uk|usa)/i.test(get('lang')) ? 'en'
      : detectLang(`${get('name')} ${notes}`, ''),
    notes, source, games: [], audience: 0,
    esPrensa: PRENSA.test(`${get('platform')} ${get('notes')} ${allValues.slice(0, 400)}`),
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

const nuevos = [], yaEstaban = [], porRevisar = [], sinDatos = [], prensa = [];
const seenNew = new Map();

for (const f of files) {
  let text = readFileSync(join(inDir, f), 'utf8');
  if (extname(f).toLowerCase() === '.tsv' || (text.split('\n')[0].includes('\t') && !text.split('\n')[0].includes(','))) {
    text = text.split('\n').map((l) => l.split('\t').map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n');
  }
  const rows = parseCSV(text);
  if (!rows.length) continue;
  const map = mapColumns(Object.keys(rows[0]), rows);
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
    // Sus listas no traen qué juega cada uno, que es la mitad de nuestro modelo. Puntuar
    // sin ese dato y escribir «no contactar» sería inventarse un veredicto: se marca
    // para leerlo una persona, con la puntuación como orientación y no como decisión.
    const fila = { ...rec, ...s, links: rec.links.join(' | ') };
    fila.action = 'revisar a mano';
    fila.reason = `${s.reason} · sin datos de qué juega: puntuación orientativa`;
    (rec.esPrensa ? prensa : nuevos).push(fila);
    seenNew.set(rec.url || rec.email || rec.name, rec);
  }
}

const cols = ['name', 'platform', 'url', 'email', 'lang', 'followers', 'score', 'tier', 'action', 'reason', 'links', 'notes', 'source'];
writeFileSync(`${outDir}/partner_nuevos.csv`, toCSV(nuevos.sort((a, b) => b.score - a.score), cols));
if (prensa.length) writeFileSync(`${outDir}/partner_prensa.csv`, toCSV(prensa.sort((a, b) => b.followers - a.followers), cols));
writeFileSync(`${outDir}/partner_ya_estaban.csv`, toCSV(yaEstaban, ['nombre', 'url', 'coincide_con', 'por', 'aporta_email', 'aporta_notas', 'archivo']));
if (porRevisar.length) writeFileSync(`${outDir}/partner_por_revisar.csv`, toCSV(porRevisar, ['nombre', 'url', 'email', 'posible_duplicado_de', 'plataforma_suya', 'plataforma_nuestra', 'notas', 'archivo']));
if (sinDatos.length) writeFileSync(`${outDir}/partner_sin_datos.csv`, toCSV(sinDatos, ['archivo', 'fila']));

const enriquece = yaEstaban.filter((r) => r.aporta_email).length;
console.error(`
INFORME
  Archivos leídos      ${files.length}
  Ya los teníamos      ${yaEstaban.length}${enriquece ? ` (${enriquece} nos aportan un email que nos faltaba)` : ''}
  Creadores nuevos     ${nuevos.length}\n  Prensa y medios      ${prensa.length} (van por otra vía, no por la secuencia de creadores)
  Coinciden solo por nombre, a revisar a mano  ${porRevisar.length}
  Sin datos para cruzar ${sinDatos.length}

  Con email: ${nuevos.filter((n) => n.email).length} creadores y ${prensa.filter((n) => n.email).length} de prensa.\n  Ninguno lleva veredicto automático: sus listas no dicen qué juega cada uno.

Archivos en ${outDir}/: partner_nuevos.csv${prensa.length ? ', partner_prensa.csv' : ''}, partner_ya_estaban.csv${porRevisar.length ? ', partner_por_revisar.csv' : ''}${sinDatos.length ? ', partner_sin_datos.csv' : ''}`);
