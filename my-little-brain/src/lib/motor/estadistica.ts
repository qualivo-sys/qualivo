/**
 * Estadistica minima compartida por los motores.
 *
 * Todo lo de aqui esta pensado para muestras pequenas y sucias: una persona
 * que apunta 9 dias de 14. Antes de decir "esto te pasa por aquello" exigimos
 * un minimo de dias en los dos grupos; si no llega, devolvemos null y la app
 * se calla. Es preferible no decir nada a inventarse una correlacion.
 */

export const media = (xs: number[]): number | null =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

/** Desviacion tipica poblacional, en las mismas unidades que la muestra. */
export function desviacion(xs: number[]): number | null {
  const m = media(xs);
  if (m === null || xs.length < 2) return null;
  return Math.sqrt(xs.reduce((t, x) => t + (x - m) ** 2, 0) / xs.length);
}

export interface Comparacion {
  con: number;
  sin: number;
  nCon: number;
  nSin: number;
  /** Diferencia relativa en % (positiva = mejor con el factor). */
  cambio: number;
}

/**
 * Compara una metrica entre los dias que cumplen algo y los que no.
 * Devuelve null si algun grupo no llega al minimo de dias.
 */
export function comparar<T>(
  dias: T[],
  cumple: (d: T) => boolean,
  metrica: (d: T) => number | null,
  minimo = 3,
): Comparacion | null {
  const valor = (xs: T[]) => xs.map(metrica).filter((v): v is number => v !== null && Number.isFinite(v));
  const con = valor(dias.filter(cumple));
  const sin = valor(dias.filter((d) => !cumple(d)));
  if (con.length < minimo || sin.length < minimo) return null;
  const mc = media(con)!;
  const ms = media(sin)!;
  if (ms === 0) return null;
  return {
    con: Math.round(mc * 10) / 10,
    sin: Math.round(ms * 10) / 10,
    nCon: con.length,
    nSin: sin.length,
    cambio: Math.round(((mc - ms) / ms) * 100),
  };
}
