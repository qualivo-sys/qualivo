#!/usr/bin/env node
/**
 * Enciende las campañas. Esto gasta dinero de verdad.
 *
 *   META_TOKEN=... node scripts/meta/activar.mjs            # dice qué haría
 *   META_TOKEN=... node scripts/meta/activar.mjs --activar
 *   META_TOKEN=... node scripts/meta/activar.mjs --pausar    # marcha atrás
 *
 * Se activa de dentro hacia fuera —anuncios, luego conjunto, luego campaña—
 * para que la campaña nunca esté entregando con solo parte de sus anuncios
 * encendidos: el algoritmo repartiría el aprendizaje mal desde el primer día.
 * Al pausar se hace al revés, cortando primero por arriba.
 */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'config.json'), 'utf8'));
const estado = JSON.parse(fs.readFileSync(path.join(DIR, '.state.json'), 'utf8'));
const TOKEN = process.env.META_TOKEN;
const ACTIVAR = process.argv.includes('--activar');
const PAUSAR = process.argv.includes('--pausar');
if (!TOKEN) { console.error('Falta META_TOKEN'); process.exit(1); }

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
async function poner(id, status) {
  await dormir(400);
  const r = await fetch(`https://graph.facebook.com/${cfg.cuenta.api_version}/${id}`,
    { method: 'POST', body: new URLSearchParams({ status, access_token: TOKEN }) });
  const j = await r.json();
  if (j.error) throw new Error(`${id}: ${j.error.error_user_msg || j.error.message}`);
  return j;
}

// De dentro hacia fuera. Los del formulario no entran: son la reserva.
const PLAN = [
  { nivel: 'anuncios', nombres: [
    '2A | FRIO | 4x5 | v1', '5A | FRIO | 4x5 | v1',
    'POST-PROCESO | FRIO | Reel | v1', 'POST-CASA | FRIO | Reel | v1',
    '4B | RTG | 4x5 | v1', '3A | RTG | 4x5 | v1' ] },
  { nivel: 'conjuntos', nombres: ['CAT80 | Amplio | Lead', 'RTG | Web + Social 180d'] },
  { nivel: 'campañas', nombres: ['AB113 | FRIO | Lead', 'AB113 | RTG | Lead'] },
];

const orden = PAUSAR ? [...PLAN].reverse() : PLAN;
const destino = PAUSAR ? 'PAUSED' : 'ACTIVE';

if (!ACTIVAR && !PAUSAR) {
  console.log('\nSimulacro. Se pondrían en ACTIVE, en este orden:\n');
  orden.forEach((p) => console.log(`  ${p.nivel}\n${p.nombres.map((n) => `    · ${n}`).join('\n')}`));
  console.log('\n  19 €/día ≈ 578 €/mes. Añade --activar para hacerlo de verdad.\n');
  process.exit(0);
}

console.log(`\n▶  ${PAUSAR ? 'PAUSANDO' : 'ACTIVANDO'}\n`);
for (const paso of orden) {
  console.log(`  ${paso.nivel}`);
  for (const nombre of paso.nombres) {
    const id = estado[nombre];
    if (!id) { console.log(`    ! ${nombre}: no está en .state.json`); continue; }
    await poner(id, destino);
    console.log(`    ${PAUSAR ? '■' : '▶'} ${nombre}`);
  }
}
console.log(`\n✓ ${PAUSAR ? 'Todo en pausa.' : 'En marcha: 19 €/día.'}\n`);
