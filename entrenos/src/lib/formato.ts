import type { Actividad, Entorno, Limitacion, Nivel, Objetivo, Sexo } from './types';

export const ETIQUETA_OBJETIVO: Record<Objetivo, string> = {
  perder_grasa: 'Perder grasa',
  ganar_musculo: 'Ganar musculo',
  mantener: 'Mantenerme',
  fuerza: 'Ganar fuerza',
};

export const ETIQUETA_NIVEL: Record<Nivel, string> = {
  principiante: 'Principiante (menos de 1 año)',
  intermedio: 'Intermedio (1-3 años)',
  avanzado: 'Avanzado (3+ años)',
};

export const ETIQUETA_ENTORNO: Record<Entorno, string> = {
  gimnasio: 'Gimnasio completo',
  casa_mancuernas: 'Casa con mancuernas',
  casa_sin_material: 'Casa sin material',
};

export const ETIQUETA_ACTIVIDAD: Record<Actividad, string> = {
  sedentario: 'Sedentaria (oficina, poco movimiento)',
  ligera: 'Ligera (paseos, algo de pie)',
  moderada: 'Moderada (bastante de pie o pasos)',
  alta: 'Alta (trabajo fisico)',
};

export const ETIQUETA_SEXO: Record<Sexo, string> = {
  hombre: 'Hombre',
  mujer: 'Mujer',
};

export const ETIQUETA_LIMITACION: Record<Limitacion, string> = {
  hombro: 'Hombro',
  rodilla: 'Rodilla',
  espalda_baja: 'Espalda baja',
  muneca: 'Muñeca',
  cadera: 'Cadera',
};

export const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export function hoy(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function fechaLarga(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function fechaCorta(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

export function diasDesde(iso: string): number {
  const d = new Date(iso + 'T12:00:00').getTime();
  if (!Number.isFinite(d)) return 0;
  return Math.floor((Date.now() - d) / 86400000);
}

export function num(valor: number | null | undefined, decimales = 1): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  return valor.toLocaleString('es-ES', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

export function entero(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  return Math.round(valor).toLocaleString('es-ES');
}

export function minSeg(segundos: number): string {
  if (segundos < 60) return `${segundos} s`;
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return seg ? `${min} min ${seg} s` : `${min} min`;
}

export function id(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
