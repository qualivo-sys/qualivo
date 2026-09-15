#!/usr/bin/env node
// Scoring de creadores para Don't Kill Rumble.
// Uso: node tools/score.mjs entrada.csv > salida.csv
// Sin dependencias. Documentación del modelo en strategy/02-segmentacion-scoring.md.

import { readFileSync } from 'node:fs';

// Umbrales de tier por plataforma (seguidores / espectadores medios en Twitch).
export const TIERS = {
  youtube: { t1: 500_000, t2: 30_000, t3: 2_000 },
  twitch:  { t1: 3_000,   t2: 100,    t3: 20 },     // espectadores medios
  tiktok:  { t1: 1_000_000, t2: 100_000, t3: 10_000 },
};

const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[%\s,]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const bool = (v) => /^(1|true|sí|si|yes|y|x)$/i.test(String(v ?? '').trim());

// Escala logarítmica 0-15 entre el umbral de Tier 3 y 2x el de Tier 1.
function audienceScore(platform, size) {
  const t = TIERS[platform] || TIERS.youtube;
  if (size <= 0) return 0;
  const lo = Math.log10(t.t3), hi = Math.log10(t.t1 * 2);
  const x = (Math.log10(size) - lo) / (hi - lo);
  return Math.round(Math.max(0, Math.min(1, x)) * 15);
}

export function score(row) {
  const platform = String(row.plataforma || row.platform || 'youtube').toLowerCase();
  const size = num(row.seguidores ?? row.followers);
  const parts = {};

  // Afinidad con el género (20)
  const genre = num(row.genero_pct ?? row.genre_pct);
  parts.genero = genre >= 50 ? 20 : genre >= 20 ? 12 : genre > 0 ? 5 : 0;

  // Afinidad con comparables (20)
  const core = num(row.comparables_nucleo ?? row.core_games);
  const adj = num(row.comparables_adyacentes ?? row.adjacent_games);
  parts.comparables = core >= 3 ? 20 : core >= 1 ? 12 : adj >= 1 ? 6 : 0;

  // Audiencia (15)
  parts.audiencia = audienceScore(platform, size);

  // Engagement (10): % (likes+comentarios)/vistas. 8 % o más = 10.
  const eng = num(row.engagement_pct);
  parts.engagement = Math.round(Math.max(0, Math.min(1, eng / 8)) * 10);

  // Frecuencia (10)
  const posts = num(row.publicaciones_mes ?? row.posts_per_month);
  const lastDays = num(row.ultimo_post_dias ?? row.last_post_days);
  const freqHi = platform === 'twitch' ? 12 : 8;
  const freqMid = platform === 'twitch' ? 4 : 3;
  parts.frecuencia = lastDays > 45 ? 0 : posts >= freqHi ? 10 : posts >= freqMid ? 6 : 0;

  // Historial indie (15). Solo cuenta si hay alguna señal de género o comparables:
  // un canal de cómics o de humor no es «indie» por no hacer Fortnite.
  const indie = num(row.indie_pct);
  const hasSignal = genre > 0 || core > 0 || adj > 0;
  parts.indie = !hasSignal ? 0 : indie >= 30 ? 15 : indie >= 10 ? 8 : 0;

  // Probabilidad de responder (10)
  let resp = 0;
  if (String(row.email || '').includes('@')) resp += 4;
  if (bool(row.keymailer)) resp += 3;
  if (bool(row.respondio_antes ?? row.replied_before)) resp += 3;
  parts.respuesta = Math.min(10, resp);

  // Ajustes
  let adj_pts = 0;
  const idioma = String(row.idioma || row.language || '').toLowerCase();
  if (idioma.startsWith('es')) adj_pts += 5;
  if (idioma.startsWith('pt')) adj_pts -= 5; // el juego no está en portugués (aún)
  if (bool(row.squad)) adj_pts += 5;
  if (bool(row.pide_pago ?? row.asks_payment)) adj_pts -= 10;
  if (bool(row.descartar ?? row.disqualify)) adj_pts -= 100;
  parts.ajustes = adj_pts;

  let total = Math.max(0, Math.min(100, Object.values(parts).reduce((a, b) => a + b, 0)));
  // Canal inactivo > 45 días: no se gasta un toque. Tope en 34 (cola de revisión en 90 días).
  if (lastDays > 45) total = Math.min(total, 34);

  const t = TIERS[platform] || TIERS.youtube;
  let tier = 'descartado';
  if (adj_pts > -100) {
    tier = size >= t.t1 ? 'T1' : size >= t.t2 ? 'T2' : size >= t.t3 ? 'T3' : 'bajo umbral';
  }

  const accion =
    total >= 75 ? 'contactar esta semana (manual)'
    : total >= 55 ? 'tanda semanal'
    : total >= 35 ? 'cola / Rumble Night abierta'
    : 'no contactar';

  const motivo = Object.entries(parts).map(([k, v]) => `${k}:${v}`).join(' ');
  return { score: total, tier, accion, motivo };
}

// CSV mínimo: coma, comillas dobles con escape "" y saltos de línea dentro de comillas.
export function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((v) => v !== ''));
  const keys = header.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ''])));
}

const q = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const file = process.argv[2];
  if (!file) {
    console.error('Uso: node tools/score.mjs entrada.csv > salida.csv');
    process.exit(1);
  }
  const rows = parseCSV(readFileSync(file, 'utf8'));
  const out = rows.map((r) => ({ ...r, ...score(r) }))
    .sort((a, b) => b.score - a.score);
  const keys = Object.keys(out[0] || {});
  process.stdout.write(keys.join(',') + '\n');
  for (const r of out) process.stdout.write(keys.map((k) => q(r[k])).join(',') + '\n');
  console.error(`${out.length} creadores puntuados. ≥75: ${out.filter((r) => r.score >= 75).length} · 55-74: ${out.filter((r) => r.score >= 55 && r.score < 75).length}`);
}
