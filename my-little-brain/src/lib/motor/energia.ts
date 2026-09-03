/**
 * Balance de energia del dia: lo que gastas (basal, pasos, fuerza, cardio y
 * otras actividades) frente a lo que comes. Son estimaciones, como en
 * cualquier app; lo util es la tendencia y el orden de magnitud.
 */
import { kcalCardio } from './cardio';
import type { Entrenamiento, Objetivo } from '../tipos';

export interface GastoDia {
  basal: number;
  pasos: number;
  fuerza: number;
  cardio: number;
  actividades: number;
  total: number;
}

/** Una fila de entrenamientos sin dia del plan y con tipo de cardio es una actividad libre. */
export function esActividad(e: Entrenamiento): boolean {
  return !e.dia_plan && Boolean(e.cardio_tipo);
}

const MET_FUERZA = 5;
const MINUTOS_FUERZA_POR_DEFECTO = 45;

export function gastoDia(p: {
  tmbKcal: number;
  pesoKg: number;
  pasos: number | null;
  entrenamientos: Entrenamiento[];
}): GastoDia {
  const peso = p.pesoKg > 0 ? p.pesoKg : 75;
  // Basal × 1,2: vivir sin contar pasos ni entrenos, que van aparte para no duplicar.
  const basal = Math.round(p.tmbKcal * 1.2);
  const pasos = Math.round((p.pasos ?? 0) * 0.0005 * peso);
  let fuerza = 0;
  let cardio = 0;
  let actividades = 0;
  for (const e of p.entrenamientos.filter((x) => x.completado)) {
    if (esActividad(e)) {
      actividades += e.cardio_kcal ?? kcalCardio(e.cardio_tipo ?? '', e.cardio_min ?? 0, peso);
      continue;
    }
    const minutos = Math.max(0, (e.duracion_min ?? MINUTOS_FUERZA_POR_DEFECTO) - (e.cardio_min ?? 0));
    fuerza += Math.round(MET_FUERZA * peso * (minutos / 60));
    cardio += e.cardio_kcal ?? 0;
  }
  return { basal, pasos, fuerza, cardio, actividades, total: basal + pasos + fuerza + cardio + actividades };
}

export interface BalanceEnergia {
  gasto: GastoDia;
  consumido: number;
  /** Comido menos gastado: negativo es deficit. */
  neto: number;
  tono: 'bien' | 'aviso' | 'alerta' | 'info';
  texto: string;
}

export function balanceEnergia(consumido: number, gasto: GastoDia, objetivo: Objetivo | null, finDelDia: boolean): BalanceEnergia {
  const neto = consumido - gasto.total;
  const quiereDeficit = objetivo === 'perder_grasa' || objetivo === 'recomposicion';
  const quiereSuperavit = objetivo === 'ganar_musculo' || objetivo === 'fuerza';
  const n = Math.abs(Math.round(neto)).toLocaleString('es-ES');

  if (!consumido) {
    return { gasto, consumido, neto, tono: 'info', texto: `Llevas gastadas ~${gasto.total.toLocaleString('es-ES')} kcal. Apunta lo que comes y te digo el balance.` };
  }
  if (!finDelDia && neto < -300) {
    return { gasto, consumido, neto, tono: 'info', texto: `De momento vas ${n} kcal por debajo de lo gastado. Aun queda dia: el balance real se ve por la noche.` };
  }
  if (neto < -900) {
    return { gasto, consumido, neto, tono: 'alerta', texto: `Deficit de ${n} kcal, demasiado grande: asi se pierde musculo y energia. Come mas, sobre todo proteina y carbos.` };
  }
  if (neto < -150) {
    return {
      gasto, consumido, neto,
      tono: quiereSuperavit ? 'aviso' : 'bien',
      texto: quiereSuperavit
        ? `Deficit de ${n} kcal, pero tu objetivo es ganar musculo: hoy te has quedado corto de comida.`
        : `Deficit de ${n} kcal: ritmo sano para perder grasa sin perder musculo.`,
    };
  }
  if (neto <= 150) {
    return { gasto, consumido, neto, tono: quiereDeficit ? 'aviso' : 'bien', texto: quiereDeficit ? `Balance neutro (${n} kcal): hoy no pierdes grasa. Manana un poco menos o mas pasos.` : `Balance equilibrado: mantienes peso.` };
  }
  if (neto <= 500) {
    return { gasto, consumido, neto, tono: quiereSuperavit ? 'bien' : 'aviso', texto: quiereSuperavit ? `Superavit de ${n} kcal: justo lo que toca para construir musculo.` : `Superavit de ${n} kcal. Si buscas perder grasa, recorta 200-300 kcal o suma 3.000 pasos.` };
  }
  return { gasto, consumido, neto, tono: 'alerta', texto: `Superavit de ${n} kcal: la mayor parte se guarda como grasa. Manana dia normal, sin compensar pasando hambre.` };
}

/** Un "dia redondo": entreno o actividad, calorias en rango y proteina cubierta. */
export function esDiaRedondo(d: { entreno: boolean; actividad: boolean; kcal: number; proteina: number; comidas: number }, meta: { kcal: number | null; proteina: number | null }): boolean {
  if (!meta.kcal || !meta.proteina || d.comidas === 0) return false;
  const movido = d.entreno || d.actividad;
  const kcalOk = Math.abs(d.kcal - meta.kcal) <= meta.kcal * 0.12;
  const proteinaOk = d.proteina >= meta.proteina * 0.85;
  return movido && kcalOk && proteinaOk;
}
