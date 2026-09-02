import { ejercicio } from './ejercicios';
import { esIsometrico } from './planificador';
import type { Bloque, EjercicioSesion, Plan, Serie, Sesion } from './types';

export function redondear(peso: number, incremento: number): number {
  const paso = incremento > 0 ? incremento : 1;
  return Math.max(0, Math.round(peso / paso) * paso);
}

function seriesValidas(registro: EjercicioSesion): Serie[] {
  return registro.series.filter((s) => s.hecha && s.reps !== null && s.reps > 0);
}

export interface Referencia {
  fecha: string;
  series: Serie[];
}

/** Ultima vez que se registro ese ejercicio con datos utiles. */
export function ultimaVez(sesiones: Sesion[], ejercicioId: string): Referencia | null {
  const orden = [...sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  for (const sesion of orden) {
    const registro = sesion.ejercicios.find((e) => e.ejercicioId === ejercicioId);
    if (!registro) continue;
    const series = seriesValidas(registro);
    if (series.length) return { fecha: sesion.fecha, series };
  }
  return null;
}

export interface Sugerencia {
  pesoKg: number | null;
  texto: string;
  referencia: Referencia | null;
  tipo: 'primera_vez' | 'subir' | 'mantener' | 'bajar';
}

/**
 * Progresion doble: primero se sube de repeticiones dentro del rango y, cuando
 * se completa el rango alto en todas las series con el RIR objetivo, se sube peso.
 */
export function sugerencia(bloque: Bloque, sesiones: Sesion[]): Sugerencia {
  const info = ejercicio(bloque.ejercicioId);
  const incremento = info?.incremento ?? 2.5;
  const referencia = ultimaVez(sesiones, bloque.ejercicioId);

  if (!referencia) {
    return {
      pesoKg: null,
      texto: esIsometrico(bloque.ejercicioId)
        ? `Primera vez: busca aguantar ${bloque.repMin}-${bloque.repMax} s con tecnica impecable.`
        : 'Primera vez: usa un peso con el que llegues al limite alto del rango dejandote 2 repeticiones. Ese sera tu punto de partida.',
      referencia: null,
      tipo: 'primera_vez',
    };
  }

  const series = referencia.series;
  const pesos = series.map((s) => s.pesoKg ?? 0);
  const pesoBase = Math.max(...pesos);
  const corporal = incremento === 0 || pesoBase === 0;

  const completadas = series.length >= bloque.series;
  const todasArriba = series.every((s) => (s.reps ?? 0) >= bloque.repMax);
  const rirOk = series.every((s) => s.rir === null || s.rir <= bloque.rir);
  const algunaCorta = series.some((s) => (s.reps ?? 0) < bloque.repMin);

  if (completadas && todasArriba && rirOk) {
    if (corporal) {
      return {
        pesoKg: null,
        texto: `Completaste ${bloque.repMax} reps en todas las series: toca ponerlo mas dificil (lastre, mas rango o 3 s de bajada).`,
        referencia,
        tipo: 'subir',
      };
    }
    const nuevo = redondear(pesoBase + incremento, incremento);
    return {
      pesoKg: nuevo,
      texto: `Cerraste el rango con ${pesoBase} kg: sube a ${nuevo} kg y vuelve a ${bloque.repMin} reps.`,
      referencia,
      tipo: 'subir',
    };
  }

  if (algunaCorta && !corporal) {
    const nuevo = redondear(pesoBase * 0.9, incremento);
    return {
      pesoKg: nuevo,
      texto: `La ultima vez te quedaste por debajo de ${bloque.repMin} reps. Baja a ${nuevo} kg y reconstruye el rango.`,
      referencia,
      tipo: 'bajar',
    };
  }

  const mejor = Math.max(...series.map((s) => s.reps ?? 0));
  return {
    pesoKg: corporal ? null : pesoBase,
    texto: corporal
      ? `Ultima vez: ${mejor} reps. Objetivo de hoy: al menos una repeticion mas.`
      : `Mantén ${pesoBase} kg y suma repeticiones (vas por ${mejor} de ${bloque.repMax}).`,
    referencia,
    tipo: 'mantener',
  };
}

/** 1RM estimado (formula de Epley). Solo orientativo. */
export function unaRm(pesoKg: number, reps: number): number {
  if (reps <= 1) return pesoKg;
  return pesoKg * (1 + reps / 30);
}

export function mejorMarca(sesiones: Sesion[], ejercicioId: string): { pesoKg: number; reps: number; e1rm: number; fecha: string } | null {
  let mejor: { pesoKg: number; reps: number; e1rm: number; fecha: string } | null = null;
  for (const sesion of sesiones) {
    const registro = sesion.ejercicios.find((e) => e.ejercicioId === ejercicioId);
    if (!registro) continue;
    for (const s of seriesValidas(registro)) {
      const peso = s.pesoKg ?? 0;
      const reps = s.reps ?? 0;
      if (peso <= 0) continue;
      const e1rm = unaRm(peso, reps);
      if (!mejor || e1rm > mejor.e1rm) mejor = { pesoKg: peso, reps, e1rm, fecha: sesion.fecha };
    }
  }
  return mejor;
}

/** Tonelaje de una sesion: suma de peso x repeticiones. */
export function tonelaje(sesion: Sesion): number {
  let total = 0;
  for (const registro of sesion.ejercicios) {
    for (const s of seriesValidas(registro)) {
      total += (s.pesoKg ?? 0) * (s.reps ?? 0);
    }
  }
  return Math.round(total);
}

export function seriesCompletadas(sesion: Sesion): number {
  return sesion.ejercicios.reduce((total, e) => total + seriesValidas(e).length, 0);
}

/** Siguiente dia del plan segun la rotacion (el que sigue al ultimo entrenado). */
export function proximoDia(plan: Plan, sesiones: Sesion[]): string {
  if (!plan.dias.length) return '';
  const completadas = sesiones
    .filter((s) => s.completada)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
  const ultima = completadas[0];
  if (!ultima) return plan.dias[0].id;
  const indice = plan.dias.findIndex((d) => d.id === ultima.diaId);
  if (indice === -1) return plan.dias[0].id;
  return plan.dias[(indice + 1) % plan.dias.length].id;
}

export function sesionesPorSemana(sesiones: Sesion[], semanas = 4): { semana: string; total: number }[] {
  const conteo = new Map<string, number>();
  const corte = Date.now() - semanas * 7 * 86400000;
  for (const s of sesiones) {
    if (!s.completada) continue;
    const t = new Date(s.fecha + 'T12:00:00').getTime();
    if (!Number.isFinite(t) || t < corte) continue;
    const clave = inicioSemana(s.fecha);
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  }
  return [...conteo.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([semana, total]) => ({ semana, total }));
}

export function inicioSemana(fecha: string): string {
  const d = new Date(fecha + 'T12:00:00');
  const dia = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - dia);
  return d.toISOString().slice(0, 10);
}
