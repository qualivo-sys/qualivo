/**
 * Reajuste del reparto al techo de 600 €/mes.
 *
 * 600 € / 31 días = 19,35 €/día. Se fija el total en 19 €/día (589 € el mes
 * más largo) para que ni el mes de 31 días se pase del techo.
 *
 * Además reduce el número de anuncios por conjunto: 13 anuncios sobre
 * 15 €/día son 1,15 €/día cada uno y Meta nunca llega a aprender con
 * ninguno. Se dejan 6 en frío y 2 en retargeting.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, 'config.json'), 'utf8'));
const state = JSON.parse(fs.readFileSync(path.join(DIR, '.state.json'), 'utf8'));
const TOKEN = process.env.META_TOKEN;
const V = cfg.cuenta.api_version;
if (!TOKEN) { console.error('Falta META_TOKEN'); process.exit(1); }

const api = async (nodo, campos) => {
  const body = new URLSearchParams({ ...campos, access_token: TOKEN });
  const r = await fetch(`https://graph.facebook.com/${V}/${nodo}`, { method: 'POST', body });
  const j = await r.json();
  if (j.error) throw new Error(`${nodo}: ${j.error.error_user_msg || j.error.message}`);
  return j;
};

// ── Presupuestos de campaña (CBO), en céntimos ──────────────────────────────
const PRESUPUESTOS = [
  ['AB113 | FRIO | Lead',        1500, 'El grueso: es lo único que alimenta el píxel y llena el retargeting'],
  ['AB113 | RTG | Lead',          400, 'La bolsa de Instagram (10.494 seguidores) ya existe desde el día 1'],
  ['AB113 | FRIO | Formulario',   400, 'En pausa. Se prueba en semana 5 quitando de frío, no sumando'],
];

// ── Anuncios que se apagan ──────────────────────────────────────────────────
// Frío se queda con: 2A (reforma), 3A (medidas), 5A (guía) + los 3 Reels.
// Retargeting se queda con: 4B (taller propio) y 3A (llamada directa).
const APAGAR = [
  '1A | FRIO | 4x5 | v1', '1B | FRIO | 4x5 | v1', '2B | FRIO | 4x5 | v1',
  '3B | FRIO | 4x5 | v1', '4A | FRIO | 4x5 | v1', '4B | FRIO | 4x5 | v1',
  '5B | FRIO | 4x5 | v1',
  '5A | RTG | 4x5 | v1',
];

const log = (s) => console.log(s);

log('\n── Presupuestos ────────────────────────────────────────────');
for (const [nombre, centimos, porque] of PRESUPUESTOS) {
  const id = state[nombre];
  if (!id) { log(`   ! ${nombre}: no está en .state.json`); continue; }
  await api(id, { daily_budget: String(centimos) });
  log(`   ${nombre.padEnd(28)} → ${(centimos / 100).toFixed(0).padStart(2)} €/día   ${porque}`);
}

log('\n── Anuncios que se apagan ──────────────────────────────────');
for (const nombre of APAGAR) {
  const id = state[nombre];
  if (!id) { log(`   ! ${nombre}: no está en .state.json`); continue; }
  await api(id, { status: 'PAUSED' });
  log(`   ✕ ${nombre}`);
}

const total = PRESUPUESTOS.reduce((a, [, c]) => a + c, 0) / 100;
const activo = (PRESUPUESTOS[0][1] + PRESUPUESTOS[1][1]) / 100;
log('\n── Resultado ───────────────────────────────────────────────');
log(`   Al arrancar:  ${activo} €/día → ${Math.round(activo * 30.4)} €/mes (${activo * 31} € el mes de 31 días)`);
log(`   Si se encendiera todo: ${total} €/día → ${total * 31} € el mes de 31 días`);
log('   Todo sigue en PAUSA. Nada gasta hasta que se active a mano.\n');
