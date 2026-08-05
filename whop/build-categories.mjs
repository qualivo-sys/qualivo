#!/usr/bin/env node
// ============================================================================
// HACK THE LEAD — Crea las 6 categorías (por problema) en la experience Courses
// Cada categoría = un course; cada subtema = un chapter (vacío, listo para drops).
// Idempotente: guarda IDs en categories-state.json. Borra el "Chapter 1" default.
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE = join(__dirname, 'categories-state.json');
const API = 'https://api.whop.com/api/v1';
const KEY = process.env.WHOP_API_KEY;
const EXP = process.env.WHOP_EXPERIENCE_ID;
const DRY = process.argv.includes('--dry-run');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const categories = [
  { key: 'c1', title: 'Conseguir clientes',    tagline: 'Sistemas para llenar tu pipeline con IA',        subs: ['Outbound', 'ABM', 'LinkedIn', 'Email', 'Auditorías IA'] },
  { key: 'c2', title: 'Automatizar ventas',    tagline: 'Que el seguimiento no dependa de tu memoria',    subs: ['CRM', 'Follow-ups', 'Lead Scoring', 'IA'] },
  { key: 'c3', title: 'Crear agentes',         tagline: 'Agentes que trabajan por ti',                    subs: ['Claude Code', 'Cursor', 'MCP', 'OpenAI', 'n8n'] },
  { key: 'c4', title: 'Automatizar empresas',  tagline: 'IA aplicada a cada área del negocio',            subs: ['Finanzas', 'RRHH', 'Operaciones', 'Customer Success'] },
  { key: 'c5', title: 'Desarrollo',            tagline: 'De idea a producto',                             subs: ['Python', 'APIs', 'Docker', 'GitHub', 'Bases de datos'] },
  { key: 'c6', title: 'Productividad',         tagline: 'Tu sistema operativo personal',                  subs: ['Notion', 'Sistemas', 'SOPs', 'IA personal'] },
];

async function req(method, path, body) {
  if (DRY) return { id: `${path.includes('chapters') ? 'chap' : 'cors'}_DRY`, chapters: [] };
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${await res.text().catch(() => '')}`);
  return res.status === 200 && method === 'DELETE' ? true : res.json();
}

const loadState = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { courses: {} });
const saveState = (s) => { if (!DRY) writeFileSync(STATE, JSON.stringify(s, null, 2)); };

async function main() {
  if (!DRY && (!KEY || !EXP)) { console.error('✗ Falta WHOP_API_KEY o WHOP_EXPERIENCE_ID'); process.exit(1); }
  const state = loadState();
  console.log(`Modo: ${DRY ? 'DRY-RUN' : 'REAL'} · experience ${EXP}\n`);

  for (const cat of categories) {
    let entry = state.courses[cat.key];
    if (!entry) {
      const c = await req('POST', '/courses', { experience_id: EXP, title: cat.title, tagline: cat.tagline, visibility: 'hidden' });
      entry = { courseId: c.id, chapters: {}, defaultCleaned: false };
      state.courses[cat.key] = entry;
      saveState(state);
      console.log(`→ Categoría "${cat.title}" → ${c.id}`);
      await sleep(300);
    } else {
      console.log(`✓ "${cat.title}" ya existe → ${entry.courseId}`);
    }

    for (const sub of cat.subs) {
      if (entry.chapters[sub]) { console.log(`    · ${sub} (existe)`); continue; }
      const ch = await req('POST', '/course_chapters', { course_id: entry.courseId, title: sub });
      entry.chapters[sub] = ch.id;
      saveState(state);
      console.log(`    · capítulo ${sub} → ${ch.id}`);
      await sleep(250);
    }

    // borrar el "Chapter 1 / Lesson 1" que Whop autogenera al crear el curso
    if (!entry.defaultCleaned) {
      const full = await req('GET', `/courses/${entry.courseId}`);
      const def = (full.chapters || []).find(
        (c) => c.title === 'Chapter 1' && (c.lessons || []).length === 1 && c.lessons[0].title === 'Lesson 1'
      );
      if (def) { await req('DELETE', `/course_chapters/${def.id}`); console.log(`    ✗ borrado default Chapter 1`); }
      entry.defaultCleaned = true;
      saveState(state);
      await sleep(250);
    }
  }

  console.log(`\n✓ Listo. ${categories.length} categorías con ${categories.reduce((n, c) => n + c.subs.length, 0)} capítulos.`);
  if (!DRY) console.log(`  Estado en ${STATE}`);
}

main().catch((e) => { console.error('\n✗', e.message); process.exit(1); });
