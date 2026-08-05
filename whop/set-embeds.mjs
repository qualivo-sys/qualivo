#!/usr/bin/env node
// ============================================================================
// QUALIVO BLUEPRINT → WHOP · Cargador de vídeos por lote
// ----------------------------------------------------------------------------
// Cuando ya hayas grabado, rellena embeds.json con el enlace de cada lección
// (YouTube o Loom) y este script los asigna a cada lección vía API (PATCH).
// Usa whop-state.json (generado por build-course.mjs) para saber el ID de cada
// lección a partir de su clave (m0l1, m0l2, ...).
//
// Uso:
//   cp embeds.example.json embeds.json   # y rellena los enlaces que tengas
//   export WHOP_API_KEY="tu_api_key"
//   node set-embeds.mjs --dry-run
//   node set-embeds.mjs
// ============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, 'whop-state.json');
const EMBEDS_PATH = join(__dirname, 'embeds.json');
const API_BASE = 'https://api.whop.com/api/v1';

const DRY_RUN = process.argv.slice(2).includes('--dry-run');
const API_KEY = process.env.WHOP_API_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Extrae {type,id} de una URL de YouTube o Loom (o acepta {type,id} directo)
function parseEmbed(value) {
  if (value && typeof value === 'object' && value.type && value.id) return value;
  const url = String(value).trim();
  let m;
  if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/)))
    return { type: 'youtube', id: m[1] };
  if ((m = url.match(/loom\.com\/(?:share|embed)\/([A-Za-z0-9]+)/)))
    return { type: 'loom', id: m[1] };
  throw new Error(`No reconozco la URL de vídeo: "${url}" (usa YouTube o Loom, o pon {"type","id"})`);
}

async function patchLesson(lessonId, embed) {
  if (DRY_RUN) return { id: lessonId, __dryRun: true };
  const res = await fetch(`${API_BASE}/course_lessons/${lessonId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ lesson_type: 'video', embed_type: embed.type, embed_id: embed.id }),
  });
  if (!res.ok) throw new Error(`Whop API ${res.status}: ${await res.text().catch(() => '')}`);
  return res.json();
}

async function main() {
  if (!existsSync(STATE_PATH)) { console.error('✗ No encuentro whop-state.json. Ejecuta build-course.mjs primero.'); process.exit(1); }
  if (!existsSync(EMBEDS_PATH)) { console.error('✗ No encuentro embeds.json. Copia embeds.example.json y rellénalo.'); process.exit(1); }
  if (!DRY_RUN && !API_KEY) { console.error('✗ Falta WHOP_API_KEY.'); process.exit(1); }

  const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  const embeds = JSON.parse(readFileSync(EMBEDS_PATH, 'utf8'));

  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN' : 'REAL'}`);
  let done = 0, skipped = 0;
  for (const [key, value] of Object.entries(embeds)) {
    if (!value) { skipped++; continue; }                 // sin enlace todavía
    const lessonId = state.lessons[key];
    if (!lessonId) { console.log(`  ⚠️  Clave "${key}" no está en whop-state.json — la salto`); skipped++; continue; }
    const embed = parseEmbed(value);
    await patchLesson(lessonId, embed);
    console.log(`  ✓ ${key} → ${embed.type}:${embed.id}`);
    done++;
    if (!DRY_RUN) await sleep(300);
  }
  console.log(`\n✓ Hecho. ${done} vídeos asignados, ${skipped} pendientes/omitidos.`);
  if (DRY_RUN) console.log('  (DRY-RUN: no se llamó a la API.)');
}

main().catch((err) => { console.error('\n✗ Error:', err.message); process.exit(1); });
