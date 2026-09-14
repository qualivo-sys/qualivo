#!/usr/bin/env node
/**
 * Promociona publicaciones orgánicas de Instagram que ya funcionan.
 *
 *   META_TOKEN=... node scripts/meta/build-post-ads.mjs --apply
 *
 * Van al MISMO conjunto de frío que las 10 creatividades diseñadas, a propósito:
 * así Meta las compara cara a cara con el mismo presupuesto y el mismo público.
 * La pregunta que responde el test es si un Reel orgánico con prueba social
 * acumulada bate a un estático diseñado.
 *
 * Al promocionar un post existente se arrastran sus likes y comentarios, lo que
 * suele subir el CTR y bajar el CPM frente a una creatividad recién creada.
 */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/meta/config.json'), 'utf8'));
const APPLY = process.argv.includes('--apply');
const TOKEN = process.env.META_TOKEN;
const { ad_account_id: ACT, instagram_user_id: IG, api_version: V } = cfg.cuenta;
const BASE = `https://graph.facebook.com/${V}`;
const ESTADO = path.join(ROOT, 'scripts/meta/.state.json');
const estado = JSON.parse(fs.readFileSync(ESTADO, 'utf8'));
const ADSET = estado['CAT80 | Amplio | Lead'];
const dormir = ms => new Promise(r => setTimeout(r, ms));

/** Los tres elegidos, con el porqué. El de más alcance queda fuera a propósito. */
const POSTS = [
  { ref: 'POST-PROCESO', media: '18056639263821843',
    motivo: 'Máximas reproducciones (24.099). Proceso de taller con persona a cámara y gancho en pantalla.',
    destino: '/guia' },
  { ref: 'POST-CASA', media: '17891300832127292',
    motivo: 'La única pieza fotografiada en una casa real. 43 guardados sobre 7.008 de alcance.',
    destino: '/cuestionario' },
  { ref: 'POST-OLMO', media: '18349104739124113',
    motivo: 'Ratio de guardado del 1,94 %, el triple que cualquier otro. Poco alcance pero mucha intención.',
    destino: '/cuestionario' },
];

async function api(endpoint, body) {
  if (!APPLY) { console.log(`   [simulacro] POST ${endpoint}`); return { id: 'dry_' + Math.random().toString(36).slice(2, 9) }; }
  await dormir(900);
  const r = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: TOKEN }),
  });
  const j = await r.json();
  if (j.error) throw new Error(`${endpoint} → ${j.error.error_user_title || j.error.message}\n      ${j.error.error_user_msg || ''}`);
  return j;
}

console.log(APPLY ? '\n▶  PROMOCIONANDO PUBLICACIONES (PAUSED)\n' : '\n▶  SIMULACRO\n');
for (const p of POSTS) {
  const nombre = `${p.ref} | FRIO | Reel | v1`;
  if (estado[nombre]) { console.log(`   ya existía → ${estado[nombre]} · ${nombre}`); continue; }
  const link = `https://antic-barcelona-113.vercel.app${p.destino}?${cfg.utm}`;
  const cr = await api(`${ACT}/adcreatives`, {
    name: `${p.ref} | Reel orgánico`,
    instagram_user_id: IG,
    source_instagram_media_id: p.media,
    call_to_action: { type: 'LEARN_MORE', value: { link } },
  });
  const ad = await api(`${ACT}/ads`, { name: nombre, adset_id: ADSET, creative: { creative_id: cr.id }, status: 'PAUSED' });
  estado[nombre] = ad.id;
  if (APPLY) fs.writeFileSync(ESTADO, JSON.stringify(estado, null, 2));
  console.log(`   ${p.ref} → ${ad.id}`);
  console.log(`      ${p.motivo}`);
}
console.log('\n✔  Listo. Compiten en el mismo conjunto que los 10 estáticos diseñados.');
console.log('\n⚠  Antes de activar, revisar uno a uno que el Reel no lleve música licenciada:');
console.log('   la API deja crear el anuncio, pero Meta lo rechaza en revisión.\n');
