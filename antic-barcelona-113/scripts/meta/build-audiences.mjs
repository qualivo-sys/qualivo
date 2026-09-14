#!/usr/bin/env node
/**
 * Crea los públicos personalizados de retargeting del documento 02.
 *   node scripts/meta/build-audiences.mjs               # simulacro
 *   META_TOKEN=... node scripts/meta/build-audiences.mjs --apply
 *
 * Idempotente vía .audiences.json: relanzarlo no duplica.
 */
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/meta/config.json'), 'utf8'));
const APPLY = process.argv.includes('--apply');
const TOKEN = process.env.META_TOKEN;
const ACT = cfg.cuenta.ad_account_id, PIXEL = cfg.cuenta.pixel_id;
const PAGE = cfg.cuenta.page_id, IG = cfg.cuenta.instagram_actor_id;
const BASE = `https://graph.facebook.com/${cfg.cuenta.api_version}`;
const DIA = 86400;
const dormir = ms => new Promise(r => setTimeout(r, ms));
const ESTADO = path.join(ROOT, 'scripts/meta/.audiences.json');
const hechos = fs.existsSync(ESTADO) ? JSON.parse(fs.readFileSync(ESTADO, 'utf8')) : {};

/** Regla de público web: visitantes cuya URL contiene `contiene`. */
const web = (dias, contiene) => ({
  inclusions: { operator: 'or', rules: [{
    event_sources: [{ type: 'pixel', id: PIXEL }],
    retention_seconds: dias * DIA,
    // El filtro es obligatorio: una regla sin él da "Formato JSON de regla no válido".
    filter: { operator: 'and', filters: [
      { field: 'url', operator: 'i_contains', value: contiene || 'antic-barcelona-113' },
    ]},
  }]},
});

/** Regla de interacción con un perfil de IG o una página de Facebook. */
const social = (tipo, id, evento, dias) => ({
  inclusions: { operator: 'or', rules: [{
    event_sources: [{ type: tipo, id }],
    retention_seconds: dias * DIA,
    filter: { operator: 'and', filters: [{ field: 'event', operator: 'eq', value: evento }] },
  }]},
});

const PUBLICOS = [
  { nombre: 'RTG | Web · todos 180d', rule: web(180),
    desc: 'Cualquiera que haya visitado la web en los últimos 180 días. Base del retargeting.' },
  { nombre: 'RTG | Cuestionario sin terminar 90d', rule: web(90, '/cuestionario'),
    desc: 'Llegaron al cuestionario. La audiencia más caliente: hay que excluir de aquí a los que lo completaron.' },
  { nombre: 'RTG | Guía · vieron la página 90d', rule: web(90, '/guia'),
    desc: 'Vieron la página de la guía. Para el anuncio de rescate.' },
  { nombre: 'EXC | Convertidos 90d', rule: web(90, '/gracias'),
    desc: 'Ya descargaron la guía. EXCLUIR de las campañas de captación.' },
  ...(IG ? [{ nombre: 'RTG | Instagram · interacción 365d',
    rule: social('ig_business', IG, 'ig_business_profile_all', 365),
    desc: 'Interactuaron con @antic.barcelona113. ~10.500 seguidores de base.' }] : []),
  { nombre: 'RTG | Facebook · interacción 365d',
    rule: social('page', PAGE, 'page_engaged', 365),
    desc: 'Interactuaron con la página de Facebook.' },
];

async function crear(p) {
  if (hechos[p.nombre]) { console.log(`   ya existía → ${hechos[p.nombre]} · ${p.nombre}`); return; }
  if (!APPLY) { console.log(`   [simulacro] ${p.nombre}`); return; }
  await dormir(1200);
  const r = await fetch(`${BASE}/${ACT}/customaudiences`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    // v21 ya no acepta 'subtype': el tipo se deduce del event_source de la regla.
    body: JSON.stringify({ name: p.nombre, description: p.desc,
      rule: p.rule, prefill: true, access_token: TOKEN }),
  });
  const j = await r.json();
  if (j.error) {
    const m = j.error.message || '';
    if (/2663|Terms of service/i.test(m)) {
      console.log(`   ✗ ${p.nombre}`);
      console.log('       Faltan las Condiciones de Públicos Personalizados. Las tiene que aceptar');
      console.log('       una persona: business.facebook.com/ads/manage/customaudiences/tos/');
      return;
    }
    console.log(`   ✗ ${p.nombre}: ${j.error.error_user_title || m}`);
    return;
  }
  hechos[p.nombre] = j.id;
  fs.writeFileSync(ESTADO, JSON.stringify(hechos, null, 2));
  console.log(`   ✔ ${j.id} · ${p.nombre}`);
}

console.log(APPLY ? '\n▶  CREANDO PÚBLICOS\n' : '\n▶  SIMULACRO\n');
for (const p of PUBLICOS) await crear(p);
console.log(`\n${Object.keys(hechos).length} públicos. Tardan 24-48 h en poblarse: no se pueden usar hoy.\n`);
