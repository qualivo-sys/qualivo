/**
 * Ajuste automatico de calorias: lo que hace un nutricionista cada dos semanas.
 * Compara la tendencia real de peso con el ritmo objetivo y, cuando hay datos
 * suficientes, propone un cambio concreto de calorias en vez de un consejo vago.
 */
import type { ObjetivosDiarios } from './nutricion';

/** Kcal por kilo de tejido: la referencia clasica son 7.700 kcal/kg. */
const KCAL_POR_KG = 7700;

export interface PropuestaAjuste {
  kcalActuales: number;
  kcalNuevas: number;
  /** Cambio propuesto: negativo baja calorias, positivo las sube. */
  delta: number;
  proteinaG: number;
  carbosG: number;
  grasaG: number;
  tendencia: number;
  ritmoObjetivo: number;
  titulo: string;
  detalle: string;
}

export interface DatosAjuste {
  metas: ObjetivosDiarios;
  tendenciaKgSemana: number | null;
  /** Pesajes en las ultimas dos semanas: sin datos no se toca nada. */
  pesajes: number;
  /** Dias con comidas registradas en las ultimas dos semanas. */
  diasConComidas: number;
  /** Fecha del ultimo ajuste (propio o pospuesto), para no dar la lata. */
  ultimoAjuste: string | null;
  hoy: string;
  /** Suelo de seguridad: nunca proponemos bajar de aqui. */
  sueloKcal: number;
}

const kg = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)} kg/semana`;
const dias = (desde: string, hasta: string) =>
  Math.round((new Date(hasta + 'T12:00:00').getTime() - new Date(desde + 'T12:00:00').getTime()) / 86400000);

/**
 * Devuelve el ajuste a proponer, o null si no toca: o vas bien, o no hay datos
 * suficientes, o hace menos de dos semanas del ultimo cambio.
 */
export function proponerAjuste(d: DatosAjuste): PropuestaAjuste | null {
  const { metas, tendenciaKgSemana: tendencia } = d;
  if (tendencia === null) return null;
  // Sin pesarse y sin apuntar comida, cambiar el numero no arregla nada.
  if (d.pesajes < 4 || d.diasConComidas < 7) return null;
  if (d.ultimoAjuste && dias(d.ultimoAjuste, d.hoy) < 14) return null;

  const meta = metas.ritmoKgSemana;
  const diferencia = tendencia - meta;
  // Mismo margen que el mensaje de "vas bien": no se toca por ruido de bascula.
  const margen = meta === 0 ? 0.2 : Math.max(0.15, Math.abs(meta) * 0.4);
  if (Math.abs(diferencia) <= margen) return null;

  // Cada kg/semana de desvio son ~1.100 kcal/dia; se acota a un cambio prudente.
  const bruto = -(diferencia * KCAL_POR_KG) / 7;
  const signo = bruto < 0 ? -1 : 1;
  const magnitud = Math.min(300, Math.max(100, Math.round(Math.abs(bruto) / 25) * 25));
  let kcalNuevas = Math.round((metas.kcal + signo * magnitud) / 10) * 10;
  kcalNuevas = Math.max(d.sueloKcal, kcalNuevas);
  const delta = kcalNuevas - metas.kcal;
  // Si el suelo de seguridad deja el cambio en nada, no merece la pena molestar.
  if (Math.abs(delta) < 50) return null;

  // La proteina no se toca; el cambio va a carbohidratos y, si no cabe, a grasa.
  const proteinaG = metas.proteinaG;
  let grasaG = metas.grasaG;
  let carbosG = Math.round((kcalNuevas - proteinaG * 4 - grasaG * 9) / 4);
  if (carbosG < 50) {
    carbosG = 50;
    grasaG = Math.max(30, Math.round((kcalNuevas - proteinaG * 4 - carbosG * 4) / 9));
  }

  const baja = delta < 0;
  const titulo = baja
    ? `Toca bajar ${Math.abs(delta)} kcal al dia`
    : `Toca subir ${delta} kcal al dia`;
  const detalle = meta === 0
    ? `Llevas ${kg(tendencia)} y el plan era mantener el peso. Con ${kcalNuevas} kcal deberias estabilizarte.`
    : `Vas a ${kg(tendencia)} y el objetivo es ${kg(meta)}. Con ${kcalNuevas} kcal al dia el ritmo deberia cuadrar; lo reviso en dos semanas.`;

  return { kcalActuales: metas.kcal, kcalNuevas, delta, proteinaG, carbosG, grasaG, tendencia, ritmoObjetivo: meta, titulo, detalle };
}
