/**
 * Comidas habituales: lo que esta persona come de verdad, sacado de su propio
 * historial. Casi todo el mundo repite las mismas diez o quince cosas, asi que
 * apuntarlas otra vez deberia ser un toque, no volver a escribirlas.
 */
import { normalizar } from './alimentos';
import { MOMENTOS, type MomentoDia } from './dieta';
import type { Comida } from '../tipos';

export interface ComidaHabitual {
  /** Clave estable (descripcion normalizada), para React y para deduplicar. */
  clave: string;
  descripcion: string;
  momento: Comida['momento'];
  kcal: number;
  proteina: number;
  carbos: number;
  grasa: number;
  alcoholUd: number;
  veces: number;
  ultima: string;
  /** Ya se ha apuntado hoy (se sigue mostrando, pero al final y avisando). */
  hoy: boolean;
}

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Franja del dia segun la hora, para dar prioridad a lo que se come a esa hora. */
export function momentoDeHora(hora: number): MomentoDia {
  return MOMENTOS.find((m) => hora < m.hasta)?.id ?? 'cena';
}

/**
 * Las comidas que mas repite, ordenadas por lo util que es ofrecerselas ahora:
 * cuenta cuantas veces las ha apuntado, cuanto hace de la ultima y si encajan
 * con la franja del dia en la que esta.
 */
export function comidasHabituales(
  comidas: Comida[],
  opciones: { hoy: string; hora: number; limite?: number },
): ComidaHabitual[] {
  const franja = momentoDeHora(opciones.hora);
  const grupos = new Map<string, Comida[]>();

  for (const comida of comidas) {
    // Sin calorias no sirve de nada repetirla, y las descripciones larguisimas
    // (las que escribe el coach al detalle) no son una "comida habitual".
    if (!comida.kcal || !comida.descripcion || comida.descripcion.length > 90) continue;
    const clave = normalizar(comida.descripcion);
    if (!clave) continue;
    grupos.set(clave, [...(grupos.get(clave) ?? []), comida]);
  }

  const habituales = [...grupos.entries()].map(([clave, lista]) => {
    const ordenadas = [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
    const reciente = ordenadas[0];
    const momentos = lista.map((c) => c.momento).filter(Boolean);
    return {
      clave,
      descripcion: reciente.descripcion,
      // El momento mas repetido: si siempre lo desayuna, se apunta como desayuno.
      momento: momentos.sort(
        (a, b) => momentos.filter((m) => m === b).length - momentos.filter((m) => m === a).length,
      )[0] ?? null,
      kcal: Math.round(media(lista.map((c) => c.kcal ?? 0))),
      proteina: Math.round(media(lista.map((c) => c.proteina_g ?? 0))),
      carbos: Math.round(media(lista.map((c) => c.carbos_g ?? 0))),
      grasa: Math.round(media(lista.map((c) => c.grasa_g ?? 0))),
      alcoholUd: Number(media(lista.map((c) => Number(c.alcohol_ud ?? 0))).toFixed(1)),
      veces: lista.length,
      ultima: reciente.fecha,
      hoy: ordenadas.some((c) => c.fecha === opciones.hoy),
    };
  });

  const dias = (desde: string) =>
    Math.max(0, Math.round((new Date(opciones.hoy + 'T12:00:00').getTime() - new Date(desde + 'T12:00:00').getTime()) / 86400000));

  const puntos = (h: ComidaHabitual) =>
    h.veces * 3 +
    Math.max(0, 14 - dias(h.ultima)) / 2 + // lo de esta semana pesa mas
    (h.momento === franja ? 6 : 0) + // lo que come a esta hora, primero
    (h.hoy ? -20 : 0); // lo ya apuntado hoy, al final

  return habituales
    .filter((h) => h.veces > 1 || dias(h.ultima) <= 7) // una sola vez y hace un mes no es un habito
    .sort((a, b) => puntos(b) - puntos(a) || a.descripcion.localeCompare(b.descripcion))
    .slice(0, opciones.limite ?? 8);
}
