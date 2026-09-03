/**
 * Tipos de cardio con su MET (equivalente metabolico). kcal = MET × kg × horas.
 * Es la formula estandar del Compendio de Actividad Fisica; es una estimacion.
 */
export interface TipoCardio {
  id: string;
  nombre: string;
  met: number;
}

export const TIPOS_CARDIO: TipoCardio[] = [
  { id: 'andar', nombre: 'Andar (paseo)', met: 3.5 },
  { id: 'andar_rapido', nombre: 'Andar rapido (llano)', met: 5 },
  { id: 'cinta_subida', nombre: 'Cinta en subida (10-15 %)', met: 7 },
  { id: 'senderismo', nombre: 'Senderismo / andar en cuesta', met: 6 },
  { id: 'monte_mochila', nombre: 'Subir monte con mochila', met: 8 },
  { id: 'correr_suave', nombre: 'Correr suave (zona 2)', met: 8 },
  { id: 'correr', nombre: 'Correr (ritmo medio)', met: 10 },
  { id: 'correr_cuesta', nombre: 'Correr en cuesta', met: 12 },
  { id: 'eliptica', nombre: 'Eliptica', met: 5.5 },
  { id: 'bici', nombre: 'Bicicleta estatica', met: 6.5 },
  { id: 'remo', nombre: 'Remo', met: 7 },
  { id: 'hiit', nombre: 'HIIT / intervalos', met: 9.5 },
  { id: 'natacion', nombre: 'Natacion', met: 7 },
  { id: 'escaleras', nombre: 'Escaleras', met: 8 },
  { id: 'cuerda', nombre: 'Comba', met: 11 },
];

export function tipoCardio(id: string): TipoCardio | undefined {
  return TIPOS_CARDIO.find((t) => t.id === id);
}

/** Calorias estimadas de una sesion de cardio. */
export function kcalCardio(tipoId: string, minutos: number, pesoKg: number): number {
  const tipo = tipoCardio(tipoId);
  if (!tipo || minutos <= 0 || pesoKg <= 0) return 0;
  return Math.round(tipo.met * pesoKg * (minutos / 60));
}

/** Enlace para ver la tecnica de un ejercicio sin depender de imagenes propias. */
export function enlaceTecnica(nombreEjercicio: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${nombreEjercicio} tecnica correcta`)}`;
}
