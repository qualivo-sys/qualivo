#!/usr/bin/env node
// ============================================================================
// HACK THE LEAD · CONTENT ENGINE — Publicador de drops semanales
// ----------------------------------------------------------------------------
// Coge un "drop" (una carpeta con drop.json + lesson.md) y publica la lección
// en la categoría + capítulo correctos de Whop, con el guion y los recursos
// (template / agente / workflow) enlazados. Si hay vídeo, lo asigna.
//
// Idempotente: guarda el ID de cada lección creada en drops-state.json, así
// reejecutar un drop lo ACTUALIZA (PATCH) en vez de duplicarlo.
//
// Uso:
//   export WHOP_API_KEY="..."
//   node publish-drop.mjs drops/2026-w31-sdr-claude-code --dry-run
//   node publish-drop.mjs drops/2026-w31-sdr-claude-code
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATS_STATE = join(__dirname, '..', 'categories-state.json'); // creado por build-categories.mjs
const DROPS_STATE = join(__dirname, 'drops-state.json');
const API = 'https://api.whop.com/api/v1';
const KEY = process.env.WHOP_API_KEY;

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const dropDir = args.find((a) => !a.startsWith('--'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- embed: acepta URL de YouTube/Loom o {type,id} ------------------------
function parseEmbed(value) {
  if (!value) return null;
  if (typeof value === 'object' && value.type && value.id) return value;
  const url = String(value).trim();
  let m;
  if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/)))
    return { type: 'youtube', id: m[1] };
  if ((m = url.match(/loom\.com\/(?:share|embed)\/([A-Za-z0-9]+)/)))
    return { type: 'loom', id: m[1] };
  throw new Error(`No reconozco la URL de vídeo: "${url}"`);
}

async function api(method, path, body) {
  if (DRY) return { id: 'lesn_DRY', __dryRun: true };
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${await res.text().catch(() => '')}`);
  return res.json();
}

// ---- compone el cuerpo (markdown) de la lección ---------------------------
function buildContent(lessonMd, resources) {
  let content = lessonMd.trim();
  if (resources && resources.length) {
    content += `\n\n---\n\n### 📦 Recursos de esta semana\n\n`;
    content += resources.map((r) => `- [${r.label}](${r.url})`).join('\n');
  }
  return content;
}

async function main() {
  if (!dropDir) { console.error('✗ Indica la carpeta del drop. Ej: node publish-drop.mjs drops/mi-drop'); process.exit(1); }
  if (!existsSync(CATS_STATE)) { console.error('✗ Falta categories-state.json. Corre build-categories.mjs primero.'); process.exit(1); }
  if (!DRY && !KEY) { console.error('✗ Falta WHOP_API_KEY.'); process.exit(1); }

  const dir = resolve(__dirname, dropDir);
  const meta = JSON.parse(readFileSync(join(dir, 'drop.json'), 'utf8'));
  const lessonMd = readFileSync(join(dir, 'lesson.md'), 'utf8');
  const cats = JSON.parse(readFileSync(CATS_STATE, 'utf8'));
  const drops = existsSync(DROPS_STATE) ? JSON.parse(readFileSync(DROPS_STATE, 'utf8')) : {};

  // resolver categoría + capítulo
  const cat = cats.courses[meta.category];
  if (!cat) throw new Error(`Categoría "${meta.category}" no existe en categories-state.json`);
  const chapterId = cat.chapters[meta.chapter];
  if (!chapterId) throw new Error(`Capítulo "${meta.chapter}" no existe en la categoría "${meta.category}". Disponibles: ${Object.keys(cat.chapters).join(', ')}`);

  const content = buildContent(lessonMd, meta.resources);
  const embed = meta.video ? parseEmbed(meta.video) : null;

  console.log(`Modo: ${DRY ? 'DRY-RUN' : 'REAL'}`);
  console.log(`Drop: ${meta.id}`);
  console.log(`  → ${meta.category}/${meta.chapter} · "${meta.title}"`);
  console.log(`  → recursos: ${(meta.resources || []).length} · vídeo: ${embed ? embed.type + ':' + embed.id : '(pendiente)'}`);

  const existing = drops[meta.id];
  let lessonId;
  if (existing) {
    // ACTUALIZAR
    await api('PATCH', `/course_lessons/${existing.lessonId}`, { title: meta.title, content });
    lessonId = existing.lessonId;
    console.log(`  ✓ Lección actualizada → ${lessonId}`);
  } else {
    // CREAR
    const res = await api('POST', '/course_lessons', {
      chapter_id: chapterId,
      lesson_type: 'video',
      title: meta.title,
      content,
    });
    lessonId = res.id;
    drops[meta.id] = { lessonId, category: meta.category, chapter: meta.chapter };
    if (!DRY) writeFileSync(DROPS_STATE, JSON.stringify(drops, null, 2));
    console.log(`  ✓ Lección creada → ${lessonId}`);
  }

  // asignar vídeo si lo hay
  if (embed) {
    await sleep(300);
    await api('PATCH', `/course_lessons/${lessonId}`, { lesson_type: 'video', embed_type: embed.type, embed_id: embed.id });
    console.log(`  ✓ Vídeo asignado → ${embed.type}:${embed.id}`);
  }

  console.log(`\n✓ Drop publicado.${DRY ? ' (DRY-RUN, sin tocar la API)' : ''}`);
}

main().catch((e) => { console.error('\n✗', e.message); process.exit(1); });
