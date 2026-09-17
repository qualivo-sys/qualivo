// Scoring unificado YouTube + Twitch. Devuelve {score, tier, action, reason}.
import { CORE_2026, CORE_CLASSIC } from './normalize.mjs';

const isCore2026 = (games) => games.some((g) => CORE_2026.includes(g) || CORE_2026.some((c) => g.toLowerCase().includes(c)));
const isCoreClassic = (games) => games.some((g) => CORE_CLASSIC.includes(g) || CORE_CLASSIC.some((c) => g.toLowerCase().includes(c)));

export function scoreCreator(c, opts = {}) {
  const parts = {};
  const games = c.games || [];

  // Afinidad: qué juega AHORA pesa más que el histórico del género (lección 17 sep).
  parts.afinidad = isCore2026(games) ? 22 : isCoreClassic(games) ? 18 : games.length ? 10 : 0;

  // Audiencia real. En Twitch, espectadores en directo; en YouTube, vistas medias.
  const a = c.audience || 0;
  parts.audiencia = c.platform === 'twitch'
    ? (a >= 300 ? 20 : a >= 100 ? 17 : a >= 40 ? 13 : a >= 15 ? 8 : 3)
    : (a >= 100000 ? 20 : a >= 20000 ? 17 : a >= 5000 ? 13 : a >= 500 ? 8 : 3);

  // Tamaño del canal, con techo bajo: nadie entra solo por ser grande.
  const f = c.followers || 0;
  parts.tamano = f >= 500000 ? 12 : f >= 100000 ? 11 : f >= 20000 ? 9 : f >= 5000 ? 7 : f >= 1000 ? 4 : 1;

  // Engagement (solo YouTube; en Twitch lo aproxima "audiencia").
  parts.engagement = c.platform === 'youtube'
    ? Math.round(Math.max(0, Math.min(1, (c.engagement || 0) / 8)) * 10) : 5;

  // Canal alcanzable.
  parts.contacto = (c.email ? 6 : 0) + (c.links?.some((l) => /discord|twitter|x\.com/i.test(l)) ? 3 : 0);

  // Prueba social de la plataforma.
  parts.plataforma = c.partner ? 4 : c.affiliate ? 2 : 0;

  // Ajustes de mercado.
  let adj = 0;
  if (c.lang === 'es' && opts.spanishInScope !== false) adj += 5;
  if (c.lang === 'pt') adj -= 5;                      // el juego no está en portugués
  if (c.lang && !['es', 'en', 'pt'].includes(c.lang)) adj -= 12; // fuera de idiomas soportados
  if (c.collabs?.length) adj += 5;                    // graba en squad
  parts.ajustes = adj;

  let score = Math.max(0, Math.min(100, Object.values(parts).reduce((x, y) => x + y, 0)));
  // Canal parado: no gastar un toque.
  if (c.platform === 'youtube' && c.lastPostDays > 45) score = Math.min(score, 34);

  const tier = c.platform === 'twitch'
    ? (f >= 200000 || a >= 1000 ? 'T1' : f >= 20000 || a >= 100 ? 'T2' : f >= 2000 ? 'T3' : 'bajo umbral')
    : (f >= 500000 ? 'T1' : f >= 30000 ? 'T2' : f >= 2000 ? 'T3' : 'bajo umbral');

  const action = score >= 70 ? 'contactar esta semana (manual)'
    : score >= 55 ? 'tanda semanal'
    : score >= 35 ? 'cola / Rumble Night abierta' : 'no contactar';

  return { score, tier, action, reason: Object.entries(parts).map(([k, v]) => `${k}:${v}`).join(' ') };
}
