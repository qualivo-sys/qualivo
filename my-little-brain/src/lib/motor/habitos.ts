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
import { comparar } from './estadistica';
import type { Dia } from './puntuaciones';
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
  // Los de evitar quedan fuera a proposito: ahi llevar dias sin marcar nada es
  // exactamente lo que se busca. Avisar seria decirte "llevas tres dias sin
  // rumiar, ¿todo bien?", que es lo contrario de ayudar.
  const activos = habitos.filter((h) => h.activo && h.tipo !== 'evitar');

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

// ── Habitos de evitar ─────────────────────────────────────────────────

export interface Recaida {
  fecha: string;
  nota: string | null;
}

export interface ResumenEvitar {
  id: string;
  nombre: string;
  emoji: string;
  /** Dias seguidos sin caer, contando hoy. */
  racha: number;
  /** Caidas en la ventana mirada, de la mas reciente a la mas antigua. */
  recaidas: Recaida[];
  /** Dias limpios de la ventana. */
  diasLimpios: number;
  diasMirados: number;
  /** Mejor racha en la ventana. */
  mejorRacha: number;
  caidoHoy: boolean;
}

/**
 * Como va un habito de evitar.
 *
 * Se cuenta al reves que los normales: la racha son los dias SIN registro, y
 * el dia de hoy cuenta como limpio mientras no se marque nada. Eso ultimo es
 * deliberado: empezar el dia en positivo y tener que marcar la caida es muy
 * distinto de empezar en deuda y tener que ganarse el dia.
 */
export function resumenEvitar(
  habito: Habito,
  registros: HabitoRegistro[],
  fechas: string[],
): ResumenEvitar {
  const caidas = new Set(
    registros.filter((r) => r.habito_id === habito.id && r.hecho).map((r) => r.fecha),
  );

  let racha = 0;
  for (const fecha of [...fechas].reverse()) {
    if (caidas.has(fecha)) break;
    racha += 1;
  }

  let mejor = 0;
  let corriendo = 0;
  for (const fecha of fechas) {
    if (caidas.has(fecha)) corriendo = 0;
    else {
      corriendo += 1;
      mejor = Math.max(mejor, corriendo);
    }
  }

  const dentro = new Set(fechas);
  return {
    id: habito.id,
    nombre: habito.nombre,
    emoji: habito.emoji,
    racha,
    recaidas: registros
      .filter((r) => r.habito_id === habito.id && r.hecho && dentro.has(r.fecha))
      .map((r) => ({ fecha: r.fecha, nota: r.nota ?? null }))
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
    diasLimpios: fechas.filter((f) => !caidas.has(f)).length,
    diasMirados: fechas.length,
    mejorRacha: mejor,
    caidoHoy: caidas.has(fechas[fechas.length - 1] ?? ''),
  };
}

/**
 * Como se le habla a alguien de un habito de evitar.
 *
 * Nunca en negativo por caer. Rumiar o mirar el movil cien veces no se corta a
 * base de reproches; lo que ayuda es ver el patron y que una caida no borre lo
 * hecho. Por eso el texto de una recaida mira a lo que SIGUE en pie.
 */
export function textoEvitar(r: ResumenEvitar): string {
  if (r.caidoHoy) {
    return r.diasLimpios > 1
      ? `Hoy ha pasado. Aun asi llevas ${r.diasLimpios} de ${r.diasMirados} dias limpios: un dia no borra eso.`
      : 'Hoy ha pasado. Apuntarlo ya es la mitad del trabajo: sin verlo no se cambia.';
  }
  if (r.racha === 0) return `Sin caidas apuntadas todavia.`;
  if (r.racha >= r.mejorRacha && r.racha >= 3) return `${r.racha} dias seguidos. Es tu mejor racha hasta ahora.`;
  return `${r.racha} ${r.racha === 1 ? 'dia' : 'dias'} seguidos sin caer.`;
}

/**
 * Que tienen en comun los dias que caes.
 *
 * Es lo unico que esta app puede hacer y una lista de rachas no: ya sabe cuanto
 * dormiste, como estabas de animo y si entrenaste. Rumiar no se corta con
 * fuerza de voluntad, se corta viendo que casi siempre pasa despues de una
 * noche mala. Si no hay dias suficientes en los dos grupos, no se dice nada.
 */
export function patronesRecaida(
  habitoId: string,
  registros: HabitoRegistro[],
  dias: Dia[],
): { id: string; texto: string; fuerza: number }[] {
  const caidas = new Set(registros.filter((r) => r.habito_id === habitoId && r.hecho).map((r) => r.fecha));
  const cayo = (d: Dia) => caidas.has(d.fecha);
  const fuera: { id: string; texto: string; fuerza: number }[] = [];

  const anadir = (id: string, comp: ReturnType<typeof comparar>, texto: (c: NonNullable<typeof comp>) => string) => {
    if (!comp || Math.abs(comp.cambio) < 12) return;
    fuera.push({ id, texto: texto(comp), fuerza: Math.abs(comp.cambio) });
  };

  anadir('sueno', comparar(dias, cayo, (d) => d.suenoHoras), (c) =>
    `Los dias que caes has dormido ${String(c.con).replace('.', ',')} h de media, frente a ${String(c.sin).replace('.', ',')} h los demas.`);
  anadir('animo', comparar(dias, cayo, (d) => d.animo), (c) =>
    `Tu animo esos dias es ${c.con} sobre 10, frente a ${c.sin} el resto.`);
  anadir('estres', comparar(dias, cayo, (d) => d.estres), (c) =>
    `El estres esos dias esta en ${c.con} sobre 10, frente a ${c.sin} el resto.`);
  anadir('foco', comparar(dias, cayo, (d) => (d.focoMin > 0 ? d.focoMin : null)), (c) =>
    `Esos dias haces ${Math.round(Math.abs(c.con - c.sin))} min ${c.con < c.sin ? 'menos' : 'mas'} de foco.`);

  // Entrenar es si o no, asi que va en proporcion de dias.
  const conCaida = dias.filter((d) => cayo(d));
  const sinCaida = dias.filter((d) => !cayo(d));
  if (conCaida.length >= 3 && sinCaida.length >= 3) {
    const pct = (xs: Dia[]) => Math.round((xs.filter((d) => d.entreno || d.actividad).length / xs.length) * 100);
    const dif = pct(sinCaida) - pct(conCaida);
    if (Math.abs(dif) >= 20) {
      fuera.push({
        id: 'entreno',
        texto: dif > 0
          ? `Entrenas el ${pct(sinCaida)} % de los dias limpios y solo el ${pct(conCaida)} % de los que caes.`
          : `Curiosamente caes mas los dias que entrenas (${pct(conCaida)} % frente a ${pct(sinCaida)} %).`,
        fuerza: Math.abs(dif),
      });
    }
  }

  return fuera.sort((a, b) => b.fuerza - a.fuerza).slice(0, 3);
}
