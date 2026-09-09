/**
 * Habitos que se estan cayendo.
 *
 * La regla no puede ser "dos dias sin hacerlo" a secas, porque no todos los
 * habitos son diarios: dos dias sin uno de tres veces por semana es lo normal,
 * y avisar ahi seria ruido. Asi que el listón sale de la frecuencia que cada
 * uno se puso.
 *
 * Y se cuentan solo dias laborables. Un habito que se cae el sabado y el
 * domingo no se esta cayendo: es fin de semana. Lo que importa es cuando se
 * rompe entre semana, que es cuando de verdad se pierde la costumbre.
 */
import type { Habito, HabitoRegistro } from '../tipos';

export interface HabitoOlvidado {
  id: string;
  nombre: string;
  emoji: string;
  /** Dias laborables desde la ultima vez que lo hizo. */
  diasHabiles: number;
  /** Ultima vez que lo marco. Null si nunca. */
  ultima: string | null;
  vecesPorSemana: number;
  /** A partir de cuantos dias laborables se avisa de este habito. */
  umbral: number;
}

const esFinde = (fechaIso: string): boolean => {
  const d = new Date(fechaIso + 'T12:00:00').getDay();
  return d === 0 || d === 6;
};

/**
 * Dias laborables entre dos fechas, sin contar la de inicio y contando la de
 * final. De "el viernes lo hice" a "hoy es martes" salen 2: lunes y martes.
 */
export function diasHabilesEntre(desde: string, hasta: string): number {
  let cuenta = 0;
  const d = new Date(desde + 'T12:00:00');
  const fin = new Date(hasta + 'T12:00:00');
  while (d < fin) {
    d.setDate(d.getDate() + 1);
    if (!esFinde(d.toISOString().slice(0, 10))) cuenta += 1;
  }
  return cuenta;
}

/**
 * Cuantos dias laborables se pueden dejar pasar antes de que sea una señal.
 * Un habito diario avisa a los 2; uno de tres veces por semana, a los 3.
 */
export function umbralDe(vecesPorSemana: number): number {
  return Math.max(2, Math.ceil(7 / Math.max(1, vecesPorSemana)));
}

export interface DatosHabitos {
  habitos: Habito[];
  registros: HabitoRegistro[];
  hoy: string;
  /** Fecha en que se creo cada habito, para no reñir por uno de ayer. */
  creados?: Record<string, string>;
}

/**
 * Los habitos que llevan demasiado sin hacerse, del mas abandonado al menos.
 * Hoy no cuenta: el dia no ha terminado y aun le da tiempo.
 */
export function habitosOlvidados({ habitos, registros, hoy, creados = {} }: DatosHabitos): HabitoOlvidado[] {
  const activos = habitos.filter((h) => h.activo);

  return activos
    .map((h) => {
      const hechos = registros
        .filter((r) => r.habito_id === h.id && r.hecho && r.fecha < hoy)
        .map((r) => r.fecha)
        .sort();
      const ultima = hechos.length ? hechos[hechos.length - 1] : null;
      // Sin ninguna marca, se cuenta desde que lo creo: si lo creaste ayer no
      // hay nada que reprochar, si fue hace dos semanas si.
      const desde = ultima ?? creados[h.id] ?? null;

      return {
        id: h.id,
        nombre: h.nombre,
        emoji: h.emoji,
        diasHabiles: desde ? diasHabilesEntre(desde, hoy) : 0,
        ultima,
        vecesPorSemana: h.veces_por_semana,
        umbral: umbralDe(h.veces_por_semana),
      };
    })
    .filter((h) => h.diasHabiles >= h.umbral)
    .sort((a, b) => b.diasHabiles - a.diasHabiles);
}

/** El texto del aviso. Dice el dato y una accion pequeña; no regaña. */
export function avisoHabito(h: HabitoOlvidado): string {
  const dias = `${h.diasHabiles} dias entre semana`;
  if (!h.ultima) return `${h.emoji} ${h.nombre} lleva ${dias} sin estrenarse. Hoy vale con hacerlo una vez.`;
  return `${h.emoji} ${h.nombre}: ${dias} sin hacerlo. No hace falta recuperar nada, con hacerlo hoy se corta.`;
}
