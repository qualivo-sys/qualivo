#!/usr/bin/env node
// ============================================================================
// QUALIVO BLUEPRINT → WHOP · Actualizar textos de lecciones/capítulos ya creados
// ----------------------------------------------------------------------------
// build-course.mjs solo CREA lo que falta; no reescribe lo existente. Este
// script reescribe el título + el contenido (guion) de las lecciones y el
// título de los capítulos a partir de course-data.mjs, usando los IDs de
// whop-state.json. Ideal para iterar el contenido sin recrear el curso.
//
// Uso:
//   export WHOP_API_KEY="tu_api_key"
//   node update-content.mjs --dry-run     # revisa qué actualizaría
//   node update-content.mjs               # aplica los cambios (PATCH)
//   node update-content.mjs --lessons-only # no toca títulos de capítulos
// ============================================================================

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { modules } from './course-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, 'whop-state.json');
const API_BASE = 'https://api.whop.com/api/v1';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LESSONS_ONLY = args.includes('--lessons-only');
const API_KEY = process.env.WHOP_API_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function patch(path, body) {
  if (DRY_RUN) return { __dryRun: true };
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Whop API ${res.status} en ${path}: ${await res.text().catch(() => '')}`);
  return res.json();
}

async function main() {
  if (!existsSync(STATE_PATH)) { console.error('✗ No encuentro whop-state.json. Ejecuta build-course.mjs primero.'); process.exit(1); }
  if (!DRY_RUN && !API_KEY) { console.error('✗ Falta WHOP_API_KEY.'); process.exit(1); }

  const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN' : 'REAL'}`);

  let chapters = 0, lessons = 0, missing = 0;
  for (const mod of modules) {
    if (!LESSONS_ONLY) {
      const chapId = state.chapters[mod.key];
      if (chapId) {
        await patch(`/course_chapters/${chapId}`, { title: mod.title });
        console.log(`  ✓ Capítulo ${mod.key}: título actualizado`);
        chapters++;
        if (!DRY_RUN) await sleep(300);
      } else {
        console.log(`  ⚠️  Capítulo ${mod.key} no está en el estado — lo salto`);
        missing++;
      }
    }
    for (const lesson of mod.lessons) {
      const lessonId = state.lessons[lesson.key];
      if (!lessonId) { console.log(`      ⚠️  Lección ${lesson.key} no está en el estado — la salto`); missing++; continue; }
      await patch(`/course_lessons/${lessonId}`, { title: lesson.title, content: lesson.notes || null });
      console.log(`      · ${lesson.key}: título + guion actualizados`);
      lessons++;
      if (!DRY_RUN) await sleep(300);
    }
  }

  console.log(`\n✓ Hecho. ${chapters} capítulos y ${lessons} lecciones actualizados${missing ? `, ${missing} omitidos` : ''}.`);
  if (DRY_RUN) console.log('  (DRY-RUN: no se llamó a la API.)');
}

main().catch((err) => { console.error('\n✗ Error:', err.message); process.exit(1); });
