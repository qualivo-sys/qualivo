import { hoy, inicioSemana, sumarDias, ultimosDias } from '../fechas';
import type { Bienestar, Comida, Entrenamiento, Foco, Habito, HabitoRegistro, MetricaCorporal } from '../tipos';

/** Todo lo que pasa en un dia, ya agregado. Es la unidad de calculo de la app. */
export interface Dia {
  fecha: string;
  kcal: number;
  proteina: number;
  alcoholUd: number;
  comidas: number;
  entreno: boolean;
  seriesEntreno: number;
  focoMin: number;
  habitosHechos: number;
  habitosTotal: number;
  animo: number | null;
  energia: number | null;
  estres: number | null;
  suenoHoras: number | null;
  suenoCalidad: number | null;
  peso: number | null;
}

export interface FuentesDatos {
  comidas: Comida[];
  entrenamientos: Entrenamiento[];
  foco: Foco[];
  habitos: Habito[];
  registros: HabitoRegistro[];
  bienestar: Bienestar[];
  metricas: MetricaCorporal[];
}

/** Agrega todas las fuentes en una serie de dias, de mas antiguo a mas reciente. */
export function construirDias(fuentes: FuentesDatos, fechas: string[]): Dia[] {
  const habitosActivos = fuentes.habitos.filter((h) => h.activo);
  const porFecha = <T extends { fecha: string }>(lista: T[], fecha: string) =>
    lista.filter((x) => x.fecha === fecha);

  return fechas.map((fecha) => {
    const comidas = porFecha(fuentes.comidas, fecha);
    const entrenos = porFecha(fuentes.entrenamientos, fecha).filter((e) => e.completado);
    const focos = porFecha(fuentes.foco, fecha);
    const registros = porFecha(fuentes.registros, fecha).filter((r) => r.hecho);
    const animo = fuentes.bienestar.find((b) => b.fecha === fecha) ?? null;
    const metrica = fuentes.metricas.find((m) => m.fecha === fecha) ?? null;

    return {
      fecha,
      kcal: suma(comidas.map((c) => c.kcal ?? 0)),
      proteina: suma(comidas.map((c) => c.proteina_g ?? 0)),
      alcoholUd: suma(comidas.map((c) => Number(c.alcohol_ud ?? 0))),
      comidas: comidas.length,
      entreno: entrenos.length > 0,
      seriesEntreno: 0,
      focoMin: suma(focos.map((f) => f.minutos)),
      habitosHechos: registros.length,
      habitosTotal: habitosActivos.length,
      animo: animo?.animo ?? null,
      energia: animo?.energia ?? null,
      estres: animo?.estres ?? null,
      suenoHoras: animo?.sueno_horas ?? null,
      suenoCalidad: animo?.sueno_calidad ?? null,
      peso: metrica?.peso_kg ?? null,
    };
  });
}

function suma(valores: number[]): number {
  return valores.reduce((a, b) => a + b, 0);
}

function media(valores: (number | null)[]): number | null {
  const limpios = valores.filter((v): v is number => v !== null && Number.isFinite(v));
  if (!limpios.length) return null;
  return limpios.reduce((a, b) => a + b, 0) / limpios.length;
}

export interface Puntuaciones {
  nutricion: number | null;
  entrenamiento: number | null;
  foco: number | null;
  habitos: number | null;
  mente: number | null;
  global: number | null;
}

export interface MetasSemana {
  kcal: number | null;
  proteinaG: number | null;
  entrenos: number;
  focoHoras: number;
}

/**
 * Puntuaciones 0-100 por area sobre un conjunto de dias.
 * Cada area devuelve null si no hay datos suficientes: no inventamos notas.
 */
export function puntuar(dias: Dia[], metas: MetasSemana): Puntuaciones {
  const conRegistro = dias.filter((d) => d.comidas > 0);
  const nutricion = (() => {
    const objetivoKcal = metas.kcal;
    if (!conRegistro.length || !objetivoKcal) return null;
    const aciertos = conRegistro.filter((d) => Math.abs(d.kcal - objetivoKcal) <= objetivoKcal * 0.12).length;
    const proteinaOk = metas.proteinaG
      ? conRegistro.filter((d) => d.proteina >= metas.proteinaG! * 0.85).length / conRegistro.length
      : 0.5;
    const cobertura = conRegistro.length / Math.max(dias.length, 1);
    return acotar(((aciertos / conRegistro.length) * 0.5 + proteinaOk * 0.3 + cobertura * 0.2) * 100);
  })();

  const entrenamiento = metas.entrenos
    ? acotar((dias.filter((d) => d.entreno).length / metas.entrenos) * 100)
    : null;

  const focoTotal = suma(dias.map((d) => d.focoMin)) / 60;
  const foco = metas.focoHoras ? acotar((focoTotal / metas.focoHoras) * 100) : null;

  const totalPosible = suma(dias.map((d) => Math.min(d.habitosTotal, d.habitosTotal)));
  const habitos = totalPosible
    ? acotar((suma(dias.map((d) => d.habitosHechos)) / totalPosible) * 100)
    : null;

  const animoMedio = media(dias.map((d) => d.animo));
  const energiaMedia = media(dias.map((d) => d.energia));
  const estresMedio = media(dias.map((d) => d.estres));
  const mente =
    animoMedio === null && energiaMedia === null
      ? null
      : acotar(
          (((animoMedio ?? 5) + (energiaMedia ?? 5) + (10 - (estresMedio ?? 5))) / 30) * 100,
        );

  const partes = [nutricion, entrenamiento, foco, habitos, mente].filter(
    (p): p is number => p !== null,
  );
  const global = partes.length ? acotar(partes.reduce((a, b) => a + b, 0) / partes.length) : null;

  return { nutricion, entrenamiento, foco, habitos, mente, global };
}

function acotar(valor: number): number {
  return Math.max(0, Math.min(100, Math.round(valor)));
}

// ── Gamificacion ────────────────────────────────────────────────────────

export const XP_POR_ACCION: Record<string, number> = {
  comida: 5,
  peso: 10,
  medidas: 15,
  entreno: 40,
  foco: 5,
  habito: 8,
  checkin: 10,
  revision: 25,
  objetivo: 30,
};

export interface Progreso {
  xp: number;
  nivel: number;
  xpNivel: number;
  xpSiguienteNivel: number;
  porcentaje: number;
}

/** Curva de nivel: cada nivel cuesta un poco mas que el anterior. */
export function progreso(xpTotal: number): Progreso {
  const nivel = Math.floor(Math.sqrt(xpTotal / 120)) + 1;
  const xpNivelActual = 120 * (nivel - 1) ** 2;
  const xpNivelSiguiente = 120 * nivel ** 2;
  const dentro = xpTotal - xpNivelActual;
  const necesario = xpNivelSiguiente - xpNivelActual;
  return {
    xp: xpTotal,
    nivel,
    xpNivel: dentro,
    xpSiguienteNivel: necesario,
    porcentaje: Math.round((dentro / necesario) * 100),
  };
}

/** Dias consecutivos hasta hoy (o ayer, para no romper la racha antes de acostarse). */
export function racha(fechasConActividad: string[], hoyIso: string = hoy()): number {
  const set = new Set(fechasConActividad);
  let cursor = set.has(hoyIso) ? hoyIso : sumarDias(hoyIso, -1);
  let total = 0;
  while (set.has(cursor)) {
    total += 1;
    cursor = sumarDias(cursor, -1);
  }
  return total;
}

// ── Correlaciones (para la revision semanal) ────────────────────────────

export interface Correlacion {
  variable: string;
  contra: string;
  r: number;
  n: number;
}

function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length;
  if (n < 4) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

/**
 * Correlaciones entre lo que haces y como te sientes o rindes.
 * Se calculan aqui (no las inventa la IA) y se le pasan al coach como dato.
 */
export function correlaciones(dias: Dia[]): Correlacion[] {
  const pares: { variable: string; contra: string; x: (d: Dia) => number | null; y: (d: Dia) => number | null }[] = [
    { variable: 'horas de sueño', contra: 'energia', x: (d) => d.suenoHoras, y: (d) => d.energia },
    { variable: 'horas de sueño', contra: 'minutos de foco', x: (d) => d.suenoHoras, y: (d) => d.focoMin },
    { variable: 'horas de sueño', contra: 'animo', x: (d) => d.suenoHoras, y: (d) => d.animo },
    { variable: 'alcohol', contra: 'energia del dia siguiente', x: (d) => d.alcoholUd, y: (d) => d.energia },
    { variable: 'entrenar', contra: 'animo', x: (d) => (d.entreno ? 1 : 0), y: (d) => d.animo },
    { variable: 'minutos de foco', contra: 'animo', x: (d) => d.focoMin, y: (d) => d.animo },
    { variable: 'calorias', contra: 'energia', x: (d) => (d.comidas ? d.kcal : null), y: (d) => d.energia },
  ];

  const salida: Correlacion[] = [];
  for (const par of pares) {
    const desplazar = par.contra.includes('siguiente');
    const xs: number[] = [];
    const ys: number[] = [];
    dias.forEach((dia, i) => {
      const siguiente = desplazar ? dias[i + 1] : dia;
      if (!siguiente) return;
      const x = par.x(dia);
      const y = par.y(siguiente);
      if (x === null || y === null) return;
      xs.push(x);
      ys.push(y);
    });
    const r = pearson(xs, ys);
    if (r !== null && Math.abs(r) >= 0.35) {
      salida.push({ variable: par.variable, contra: par.contra, r: Number(r.toFixed(2)), n: xs.length });
    }
  }
  return salida.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
}

/** Fechas de la semana (lunes a domingo) a la que pertenece una fecha. */
export function semanaDe(fecha: string): string[] {
  const lunes = inicioSemana(fecha);
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

export { ultimosDias };
