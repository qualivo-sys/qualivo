/** Utilidades de fecha en horario local, siempre en formato YYYY-MM-DD. */

export function hoy(zona?: string): string {
  return iso(new Date(), zona);
}

export function iso(fecha: Date, zona?: string): string {
  if (zona) {
    // en-CA da directamente YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', { timeZone: zona }).format(fecha);
  }
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function sumarDias(fechaIso: string, dias: number): string {
  const d = new Date(fechaIso + 'T12:00:00');
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Lunes de la semana a la que pertenece la fecha. */
export function inicioSemana(fechaIso: string): string {
  const d = new Date(fechaIso + 'T12:00:00');
  const dia = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dia);
  return d.toISOString().slice(0, 10);
}

export function diasEntre(desde: string, hasta: string): number {
  const a = new Date(desde + 'T12:00:00').getTime();
  const b = new Date(hasta + 'T12:00:00').getTime();
  return Math.round((b - a) / 86400000);
}

export function fechaLarga(fechaIso: string): string {
  const d = new Date(fechaIso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return fechaIso;
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function fechaCorta(fechaIso: string): string {
  const d = new Date(fechaIso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return fechaIso;
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

/** Devuelve las fechas de los ultimos n dias, de mas antigua a mas reciente. */
export function ultimosDias(n: number, hasta = hoy()): string[] {
  return Array.from({ length: n }, (_, i) => sumarDias(hasta, i - n + 1));
}

export function esHoy(fechaIso: string): boolean {
  return fechaIso === hoy();
}
