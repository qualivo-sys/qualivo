#!/usr/bin/env node
// ============================================================================
// QUALIVO BLUEPRINT → WHOP · Constructor de curso vía API
// ----------------------------------------------------------------------------
// Crea el curso, sus capítulos (módulos) y todas sus lecciones en Whop a partir
// de course-data.mjs. Idempotente: guarda los IDs creados en whop-state.json,
// así puedes volver a ejecutarlo sin duplicar nada.
//
// Requisitos: Node 18+ (usa fetch nativo). Sin dependencias externas.
//
// Uso:
//   export WHOP_API_KEY="tu_api_key"          # scope: courses:update
//   export WHOP_EXPERIENCE_ID="exp_xxxxxxxx"  # el experience donde vive el curso
//   node build-course.mjs --dry-run           # simula, no llama a la API
//   node build-course.mjs                      # crea de verdad
//   node build-course.mjs --visible           # crea y deja el curso visible
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { course, modules } from './course-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, 'whop-state.json');

const API_BASE = 'https://api.whop.com/api/v1';
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const MAKE_VISIBLE = args.includes('--visible');
const DELAY_MS = 350;          // pausa entre llamadas (cortesía con la API)
const MAX_RETRIES = 4;

const API_KEY = process.env.WHOP_API_KEY;
const EXPERIENCE_ID = process.env.WHOP_EXPERIENCE_ID;

// ---------- utilidades ------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
let fakeSeq = 0;
const fakeId = (prefix) => `${prefix}_DRYRUN${String(++fakeSeq).padStart(4, '0')}`;

function loadState() {
  if (existsSync(STATE_PATH)) {
    try { return JSON.parse(readFileSync(STATE_PATH, 'utf8')); } catch { /* ignore */ }
  }
  return { courseId: null, chapters: {}, lessons: {} };
}
function saveState(state) {
  if (DRY_RUN) return; // en simulación no persistimos nada
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

async function api(path, body) {
  if (DRY_RUN) {
    const prefix = path.includes('course_lessons') ? 'lesn'
      : path.includes('course_chapters') ? 'chap' : 'cors';
    return { id: fakeId(prefix), __dryRun: true };
  }
  const url = `${API_BASE}${path}`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      await sleep(DELAY_MS * attempt * 2);
      continue;
    }
    if (res.ok) return res.json();

    // reintentos en 429 / 5xx
    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      const wait = DELAY_MS * attempt * 3;
      log(`   ⚠️  ${res.status} — reintentando en ${wait}ms (intento ${attempt}/${MAX_RETRIES})`);
      await sleep(wait);
      continue;
    }
    const text = await res.text().catch(() => '');
    throw new Error(`Whop API ${res.status} en ${path}: ${text}`);
  }
}

// ---------- creación ---------------------------------------------------------
async function ensureCourse(state) {
  if (state.courseId) {
    log(`✓ Curso ya creado: ${state.courseId} (se reutiliza)`);
    return state.courseId;
  }
  log(`→ Creando curso: "${course.title}"`);
  const res = await api('/courses', {
    experience_id: EXPERIENCE_ID,
    title: course.title,
    tagline: course.tagline,
    visibility: MAKE_VISIBLE ? 'visible' : (course.visibility || 'hidden'),
    require_completing_lessons_in_order: !!course.requireCompletingLessonsInOrder,
  });
  state.courseId = res.id;
  saveState(state);
  log(`  ✓ Curso creado: ${res.id}`);
  await sleep(DELAY_MS);
  return res.id;
}

async function ensureChapter(state, courseId, mod) {
  if (state.chapters[mod.key]) {
    log(`  ✓ ${mod.title} → ${state.chapters[mod.key]} (existe)`);
    return state.chapters[mod.key];
  }
  const res = await api('/course_chapters', { course_id: courseId, title: mod.title });
  state.chapters[mod.key] = res.id;
  saveState(state);
  log(`  ✓ Capítulo: ${mod.title} → ${res.id}`);
  await sleep(DELAY_MS);
  return res.id;
}

async function ensureLesson(state, chapterId, lesson) {
  if (state.lessons[lesson.key]) {
    log(`      · ${lesson.title} → ${state.lessons[lesson.key]} (existe)`);
    return state.lessons[lesson.key];
  }
  const res = await api('/course_lessons', {
    chapter_id: chapterId,
    lesson_type: lesson.type || 'video', // se grabará vídeo; el guion va en content
    title: lesson.title,
    content: lesson.notes || null,
  });
  state.lessons[lesson.key] = res.id;
  saveState(state);
  log(`      · Lección: ${lesson.title} → ${res.id}`);
  await sleep(DELAY_MS);
  return res.id;
}

// ---------- main -------------------------------------------------------------
async function main() {
  log('════════════════════════════════════════════════════════════');
  log('  QUALIVO BLUEPRINT → WHOP');
  log(`  Modo: ${DRY_RUN ? 'DRY-RUN (simulación, sin API)' : 'REAL'}`);
  log('════════════════════════════════════════════════════════════');

  if (!DRY_RUN) {
    if (!API_KEY) { console.error('✗ Falta WHOP_API_KEY (export WHOP_API_KEY=...)'); process.exit(1); }
    if (!EXPERIENCE_ID) { console.error('✗ Falta WHOP_EXPERIENCE_ID (export WHOP_EXPERIENCE_ID=exp_...)'); process.exit(1); }
  }

  const state = loadState();
  const courseId = await ensureCourse(state);

  let nLessons = 0;
  for (const mod of modules) {
    const chapterId = await ensureChapter(state, courseId, mod);
    for (const lesson of mod.lessons) {
      await ensureLesson(state, chapterId, lesson);
      nLessons++;
    }
  }

  log('────────────────────────────────────────────────────────────');
  log(`✓ Listo. Curso ${courseId} con ${modules.length} módulos y ${nLessons} lecciones.`);
  if (DRY_RUN) log('  (DRY-RUN: no se creó nada real. Quita --dry-run para ejecutarlo.)');
  else log(`  Estado guardado en ${STATE_PATH}`);
  log('  Siguiente paso: graba cada lección y añade su embed (Loom/YouTube) en Whop.');
  log('════════════════════════════════════════════════════════════');
}

main().catch((err) => { console.error('\n✗ Error:', err.message); process.exit(1); });
