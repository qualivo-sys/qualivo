/**
 * Objetivos que se miden solos.
 *
 * Un objetivo escrito en una lista no sirve de nada: a los tres dias es una
 * frase que da mala conciencia al leerla. Lo que le da valor aqui es que la
 * app YA tiene los datos. Si tu objetivo es bajar 5 kg no hace falta que
 * apuntes nada: se sabe tu peso. Si es entrenar cuatro veces por semana, se
 * sabe cuantas llevas. Solo hay que teclear en los que nadie puede medir por
 * ti, del tipo "cerrar 3 clientes".
 *
 * Y la segunda idea: el objetivo no regana, proyecta. En vez de "vas mal",
 * dice "a este ritmo llegas el 12 de noviembre y tu fecha es el 30 de
 * octubre". Con eso decides tu si cambias el ritmo o cambias la fecha.
 */
import type { Dia } from './puntuaciones';
import type { ResumenCuerpo } from './cuerpo';
import type { ObjetivoRegistro } from '../tipos';

export interface Metrica {
  id: string;
  nombre: string;
  unidad: string;
  /** false cuando solo lo puede saber la persona. */
  automatica: boolean;
  /** Como se lee "mejor": para el peso a veces es bajar y a veces subir. */
  ayuda: string;
}

export const METRICAS: Metrica[] = [
  { id: 'peso', nombre: 'Peso', unidad: 'kg', automatica: true, ayuda: 'Se lee de tus pesajes.' },
  { id: 'cintura', nombre: 'Cintura', unidad: 'cm', automatica: true, ayuda: 'Se lee de tus medidas.' },
  { id: 'grasa', nombre: 'Grasa corporal', unidad: '%', automatica: true, ayuda: 'Se estima con tus medidas.' },
  { id: 'entrenos_semana', nombre: 'Entrenos por semana', unidad: 'al mes', automatica: true, ayuda: 'Entrenos de los ultimos 30 dias.' },
  { id: 'foco_semana', nombre: 'Tiempo dedicado', unidad: 'h al mes', automatica: true, ayuda: 'Tu tiempo apuntado en los ultimos 30 dias.' },
  { id: 'sueno', nombre: 'Horas de sueno', unidad: 'h', automatica: true, ayuda: 'Media de las ultimas dos semanas.' },
  { id: 'manual', nombre: 'Lo cuento yo', unidad: '', automatica: false, ayuda: 'Para lo que solo sabes tu: clientes, capitulos, kilometros.' },
];

export const metrica = (id: string | null): Metrica =>
  METRICAS.find((m) => m.id === id) ?? METRICAS[METRICAS.length - 1];

export const ETIQUETA_AREA: Record<string, string> = {
  cuerpo: 'Cuerpo',
  fitness: 'Entreno',
  productividad: 'Productividad',
  aprendizaje: 'Aprendizaje',
  mente: 'Mente',
  negocio: 'Negocio',
};

export interface FuentesObjetivos {
  cuerpo: ResumenCuerpo;
  dias: Dia[];
  hoy: string;
}

/**
 * El valor de ahora. Devuelve null cuando aun no hay con que medirlo, que no
 * es lo mismo que cero: un objetivo sin datos se queda sin barra en vez de
 * enseñar un 0 % que no significa nada.
 */
export function valorActual(objetivo: ObjetivoRegistro, fuentes: FuentesObjetivos): number | null {
  const ultimos = (n: number) => fuentes.dias.slice(-n);
  const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const media = (xs: number[]) => (xs.length ? suma(xs) / xs.length : null);

  switch (objetivo.metrica) {
    case 'peso':
      return fuentes.cuerpo.peso;
    case 'cintura':
      return fuentes.cuerpo.cintura;
    case 'grasa':
      return fuentes.cuerpo.grasaPct === null ? null : Math.round(fuentes.cuerpo.grasaPct * 10) / 10;
    case 'entrenos_semana':
      return ultimos(30).filter((d) => d.entreno || d.actividad).length;
    case 'foco_semana':
      return Math.round((suma(ultimos(30).map((d) => d.focoMin)) / 60) * 10) / 10;
    case 'sueno': {
      const horas = ultimos(14).map((d) => d.suenoHoras).filter((h): h is number => h !== null);
      const m = media(horas);
      return m === null ? null : Math.round(m * 10) / 10;
    }
    default:
      return objetivo.valor_actual ?? null;
  }
}

export interface Medicion {
  inicial: number | null;
  actual: number | null;
  meta: number | null;
  /** 0-100 recorrido desde donde partio hasta la meta. null si no se puede medir. */
  pct: number | null;
  /** 'subir' cuando la meta esta por encima del punto de partida. */
  direccion: 'subir' | 'bajar';
  automatica: boolean;
  /** Lo que falta, en las unidades de la metrica. */
  falta: number | null;
  conseguido: boolean;
}

export function medir(objetivo: ObjetivoRegistro, fuentes: FuentesObjetivos): Medicion {
  const info = metrica(objetivo.metrica);
  const actual = valorActual(objetivo, fuentes);
  const meta = objetivo.valor_objetivo;
  // Sin punto de partida, se toma el valor de ahora: a partir de hoy se mide.
  const inicial = objetivo.valor_inicial ?? actual;
  const direccion: 'subir' | 'bajar' = meta !== null && inicial !== null && meta < inicial ? 'bajar' : 'subir';

  if (actual === null || meta === null || inicial === null || inicial === meta) {
    return { inicial, actual, meta, pct: null, direccion, automatica: info.automatica, falta: null, conseguido: false };
  }

  const recorrido = (actual - inicial) / (meta - inicial);
  const conseguido = direccion === 'bajar' ? actual <= meta : actual >= meta;

  return {
    inicial,
    actual,
    meta,
    pct: Math.max(0, Math.min(100, Math.round(recorrido * 100))),
    direccion,
    automatica: info.automatica,
    falta: Math.round(Math.abs(meta - actual) * 10) / 10,
    conseguido,
  };
}

// ── El ritmo ──────────────────────────────────────────────────────────

export interface Ritmo {
  /** Unidades por semana desde que empezo. null si no hay bastante recorrido. */
  porSemana: number | null;
  /** Fecha a la que llegaria manteniendo este ritmo. */
  llegada: string | null;
  /** Dias que quedan hasta la fecha limite. Negativo si ya paso. */
  diasHastaLimite: number | null;
  /** true cuando la proyeccion cae dentro de la fecha que se puso. */
  aTiempo: boolean | null;
}

/**
 * A que ritmo va y cuando llegaria. No dice si esta bien o mal: da la fecha y
 * que decida la persona si cambia el ritmo o cambia la fecha.
 */
export function ritmo(
  objetivo: ObjetivoRegistro,
  medicion: Medicion,
  creado: string,
  hoy: string,
  sumarDias: (fecha: string, dias: number) => string,
  diasEntre: (a: string, b: string) => number,
): Ritmo {
  const limite = objetivo.fecha_limite;
  const diasHastaLimite = limite ? diasEntre(hoy, limite) : null;

  const desde = creado.slice(0, 10);
  const semanas = diasEntre(desde, hoy) / 7;
  if (medicion.inicial === null || medicion.actual === null || medicion.meta === null || semanas < 1) {
    return { porSemana: null, llegada: null, diasHastaLimite, aTiempo: null };
  }

  const avanzado = medicion.actual - medicion.inicial;
  const queda = medicion.meta - medicion.actual;
  const porSemana = Math.round((avanzado / semanas) * 100) / 100;

  // Sin avance, o avanzando hacia el lado contrario, no hay fecha de llegada.
  if (porSemana === 0 || Math.sign(porSemana) !== Math.sign(queda || porSemana)) {
    return { porSemana, llegada: null, diasHastaLimite, aTiempo: diasHastaLimite === null ? null : false };
  }

  const semanasQueFaltan = queda / porSemana;
  const llegada = sumarDias(hoy, Math.ceil(semanasQueFaltan * 7));

  return {
    porSemana,
    llegada,
    diasHastaLimite,
    aTiempo: limite ? llegada <= limite : null,
  };
}

// ── Cuanto te falta, tal y como vas ───────────────────────────────────

export interface Proyeccion {
  /** Lo que falta hasta la meta, en las unidades de la metrica. */
  falta: number;
  /** Ritmo real por semana, con su signo. */
  porSemana: number | null;
  /** Semanas que quedan al ritmo actual. */
  semanas: number | null;
  llegada: string | null;
  /** Dias hasta la fecha que se puso. Negativo si ya paso. */
  diasHastaLimite: number | null;
  aTiempo: boolean | null;
  /**
   * A que ritmo tendria que ir para llegar a su fecha. Es el dato que de
   * verdad ayuda: no "vas mal", sino "tendrias que ir a 0,52 y vas a 0,35".
   */
  ritmoNecesario: number | null;
  /** true cuando el ritmo actual le aleja de la meta en vez de acercarle. */
  alejandose: boolean;
  conseguido: boolean;
}

/**
 * Cuanto falta y cuando llegarias al ritmo que llevas AHORA.
 *
 * El ritmo se pasa de fuera a proposito: para el peso, la tendencia que ya
 * calcula el motor de cuerpo (suavizada, con varios pesajes) es mucho mejor
 * que dividir el avance entre las semanas transcurridas, y ademas esta
 * disponible desde el primer dia sin esperar a acumular historial.
 */
export function proyectar(
  medicion: Medicion,
  porSemana: number | null,
  hoy: string,
  fechaLimite: string | null,
  sumarDias: (fecha: string, dias: number) => string,
  diasEntre: (a: string, b: string) => number,
): Proyeccion {
  const diasHastaLimite = fechaLimite ? diasEntre(hoy, fechaLimite) : null;
  const base = {
    falta: medicion.falta ?? 0,
    porSemana,
    diasHastaLimite,
    conseguido: medicion.conseguido,
  };

  if (medicion.actual === null || medicion.meta === null || medicion.conseguido) {
    return { ...base, semanas: null, llegada: null, aTiempo: null, ritmoNecesario: null, alejandose: false };
  }

  const queda = medicion.meta - medicion.actual;
  // Lo que tendria que moverse cada semana para llegar justo a su fecha.
  const ritmoNecesario = diasHastaLimite !== null && diasHastaLimite > 0
    ? Math.round((queda / (diasHastaLimite / 7)) * 100) / 100
    : null;

  if (porSemana === null || porSemana === 0) {
    return { ...base, semanas: null, llegada: null, aTiempo: diasHastaLimite === null ? null : false, ritmoNecesario, alejandose: false };
  }

  // Ir hacia el otro lado no da fecha de llegada: daria una fecha del pasado.
  if (Math.sign(porSemana) !== Math.sign(queda)) {
    return { ...base, semanas: null, llegada: null, aTiempo: diasHastaLimite === null ? null : false, ritmoNecesario, alejandose: true };
  }

  const semanas = Math.round((queda / porSemana) * 10) / 10;
  const llegada = sumarDias(hoy, Math.ceil(semanas * 7));

  return {
    ...base,
    semanas,
    llegada,
    aTiempo: fechaLimite ? llegada <= fechaLimite : null,
    ritmoNecesario,
    alejandose: false,
  };
}

// ── Lo que veo ────────────────────────────────────────────────────────

export interface InsightObjetivo {
  id: string;
  texto: string;
  tono: 'bien' | 'aviso' | 'info';
}

export interface ObjetivoConMedida {
  objetivo: ObjetivoRegistro;
  medicion: Medicion;
  ritmo: Ritmo;
  /** Tareas abiertas colgadas de este objetivo. */
  tareasAbiertas: number;
}

/**
 * Tres frases. La mas util casi siempre es la misma: "esto lleva un mes sin
 * moverse". Un objetivo parado no es un fracaso, es una pregunta.
 */
export function insightsObjetivos(lista: ObjetivoConMedida[]): InsightObjetivo[] {
  const fuera: InsightObjetivo[] = [];
  const activos = lista.filter((o) => o.objetivo.estado === 'activo');

  if (!activos.length) {
    return [{
      id: 'vacio',
      tono: 'info',
      texto: 'Un objetivo funciona cuando se puede medir. "Estar mas en forma" no; "bajar a 78 kg antes de diciembre" si.',
    }];
  }

  const logrado = activos.find((o) => o.medicion.conseguido);
  if (logrado) {
    fuera.push({
      id: 'conseguido',
      tono: 'bien',
      texto: `Ya has llegado a "${logrado.objetivo.titulo}". Dalo por conseguido y pon el siguiente.`,
    });
  }

  // Lo que va tarde, con la fecha en la mano en vez de una bronca.
  const tarde = activos.find((o) => o.ritmo.aTiempo === false && o.ritmo.diasHastaLimite !== null && !o.medicion.conseguido);
  if (tarde) {
    fuera.push({
      id: 'tarde',
      tono: 'aviso',
      texto: tarde.ritmo.llegada
        ? `A este ritmo llegarias a "${tarde.objetivo.titulo}" despues de tu fecha. O aprietas, o mueves la fecha: las dos son decisiones validas.`
        : `"${tarde.objetivo.titulo}" no se esta moviendo hacia donde quieres. Merece la pena mirar si el objetivo sigue siendo el bueno.`,
    });
  }

  // Objetivos sin ninguna tarea que los empuje: el sintoma clasico.
  const sinTareas = activos.filter((o) => o.tareasAbiertas === 0);
  if (sinTareas.length === activos.length && activos.length > 0) {
    fuera.push({
      id: 'sin_tareas',
      tono: 'info',
      texto: 'Ninguno de tus objetivos tiene nada concreto que hacer esta semana. Un objetivo sin una tarea al lado es un deseo.',
    });
  }

  const bien = activos.find((o) => o.ritmo.aTiempo === true && (o.medicion.pct ?? 0) >= 40);
  if (bien && fuera.length < 3) {
    fuera.push({
      id: 'en_camino',
      tono: 'bien',
      texto: `"${bien.objetivo.titulo}" va en hora: llevas el ${bien.medicion.pct} % del camino.`,
    });
  }

  return fuera.slice(0, 3);
}
