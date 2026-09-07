/**
 * Tiempo dedicado a lo que cada uno decida.
 *
 * La pregunta que resuelve no es "cuantas horas has trabajado" sino "¿en que
 * se me ha ido la semana?". Por eso el reparto por actividad manda sobre el
 * total: dos personas con 20 h pueden haber tenido semanas opuestas.
 *
 * Y la segunda pregunta, la del avance: "¿voy a mas o a menos?". Se responde
 * comparando con la semana anterior y con la media de las ultimas, nunca con
 * un ideal inventado. Si alguien dedica 40 min a la guitarra y la semana
 * pasada fueron 30, eso es subir, aunque 40 min "sea poco".
 */
import { media } from './estadistica';
import type { ActividadTiempo, Foco } from '../tipos';

/** Categoria de la que cuelga una actividad cuando no se ha creado ninguna. */
export const SIN_ACTIVIDAD = 'sin-actividad';

export interface LineaActividad {
  id: string;
  nombre: string;
  emoji: string;
  minutos: number;
  sesiones: number;
  /** Porcentaje del tiempo total del periodo. */
  pct: number;
  /** Minutos a la semana que se propuso, si se marco objetivo. */
  objetivoMin: number | null;
  /** Solo con objetivo: cuanto lleva cumplido, tope 100. */
  objetivoPct: number | null;
}

export interface ResumenTiempo {
  minutos: number;
  sesiones: number;
  /** Dias del periodo en los que dedico algo de tiempo. */
  diasActivos: number;
  actividades: LineaActividad[];
  /** Minutos por dia, en el orden de las fechas pedidas. */
  porDia: { fecha: string; minutos: number }[];
}

const EMOJI_POR_DEFECTO = '⏱️';

/**
 * Reparte el tiempo de un periodo entre las actividades. Los registros
 * antiguos, que no tienen actividad, se agrupan bajo su categoria para que
 * nada de lo ya apuntado se pierda por el camino.
 */
export function resumenTiempo(
  focos: Foco[],
  actividades: ActividadTiempo[],
  fechas: string[],
  etiquetaCategoria: (id: string) => string,
): ResumenTiempo {
  const dentro = new Set(fechas);
  const rango = focos.filter((f) => dentro.has(f.fecha));
  const total = rango.reduce((t, f) => t + f.minutos, 0);

  const cubos = new Map<string, { nombre: string; emoji: string; minutos: number; sesiones: number }>();
  for (const f of rango) {
    const act = f.actividad_id ? actividades.find((a) => a.id === f.actividad_id) : null;
    const clave = act ? act.id : `${SIN_ACTIVIDAD}:${f.categoria}`;
    const cubo = cubos.get(clave) ?? {
      nombre: act ? act.nombre : etiquetaCategoria(f.categoria),
      emoji: act?.emoji || EMOJI_POR_DEFECTO,
      minutos: 0,
      sesiones: 0,
    };
    cubo.minutos += f.minutos;
    cubo.sesiones += 1;
    cubos.set(clave, cubo);
  }

  const lineas: LineaActividad[] = [...cubos.entries()].map(([id, c]) => {
    const objetivo = actividades.find((a) => a.id === id)?.objetivo_min_semana ?? null;
    return {
      id,
      nombre: c.nombre,
      emoji: c.emoji,
      minutos: c.minutos,
      sesiones: c.sesiones,
      pct: total ? Math.round((c.minutos / total) * 100) : 0,
      objetivoMin: objetivo,
      objetivoPct: objetivo ? Math.min(100, Math.round((c.minutos / objetivo) * 100)) : null,
    };
  });

  const porFecha = new Map<string, number>();
  for (const f of rango) porFecha.set(f.fecha, (porFecha.get(f.fecha) ?? 0) + f.minutos);

  return {
    minutos: total,
    sesiones: rango.length,
    diasActivos: porFecha.size,
    actividades: lineas.sort((a, b) => b.minutos - a.minutos),
    porDia: fechas.map((fecha) => ({ fecha, minutos: porFecha.get(fecha) ?? 0 })),
  };
}

/** Trocea las ultimas n semanas (la ultima es la que corre) en lunes + fechas. */
export function semanasHasta(hoy: string, n: number, inicioSemana: (f: string) => string, sumarDias: (f: string, d: number) => string) {
  const lunes = inicioSemana(hoy);
  return Array.from({ length: n }, (_, i) => {
    const desde = sumarDias(lunes, (i - n + 1) * 7);
    return { desde, fechas: Array.from({ length: 7 }, (_, d) => sumarDias(desde, d)) };
  });
}

// ── El avance ─────────────────────────────────────────────────────────

export interface Avance {
  /** Minutos de la semana en curso y de la anterior. */
  estaSemana: number;
  semanaAnterior: number;
  /** Diferencia en % respecto a la semana pasada. null si no hay con que comparar. */
  cambio: number | null;
  /** Media de minutos por semana de las semanas cerradas que tengamos. */
  mediaSemanal: number | null;
  mejorSemana: number;
  /** Semanas seguidas, hasta la ultima cerrada, con algo de tiempo dedicado. */
  semanasSeguidas: number;
  totalMinutos: number;
  /** Serie por semana, de la mas antigua a la mas reciente, para pintarla. */
  serie: { desde: string; minutos: number }[];
}

/**
 * Avance de una actividad (o de todo, si no se pasa ninguna) a partir de las
 * semanas que se le den ya troceadas. La ultima es la semana en curso y no
 * entra en la media: aun no ha terminado y ensuciaria la comparacion.
 */
export function avance(focos: Foco[], semanas: { desde: string; fechas: string[] }[], actividadId?: string): Avance {
  const suyos = actividadId ? focos.filter((f) => f.actividad_id === actividadId) : focos;

  const serie = semanas.map(({ desde, fechas }) => {
    const dentro = new Set(fechas);
    return { desde, minutos: suyos.filter((f) => dentro.has(f.fecha)).reduce((t, f) => t + f.minutos, 0) };
  });

  const estaSemana = serie.length ? serie[serie.length - 1].minutos : 0;
  const cerradas = serie.slice(0, -1);
  const semanaAnterior = cerradas.length ? cerradas[cerradas.length - 1].minutos : 0;

  // Solo cuentan las semanas cerradas desde la primera con actividad: las
  // semanas anteriores a empezar no son ceros, es que aun no existia.
  const primera = cerradas.findIndex((s) => s.minutos > 0);
  const conDatos = primera === -1 ? [] : cerradas.slice(primera);

  let seguidas = 0;
  for (const s of [...cerradas].reverse()) {
    if (s.minutos > 0) seguidas += 1;
    else break;
  }

  return {
    estaSemana,
    semanaAnterior,
    cambio: semanaAnterior > 0 ? Math.round(((estaSemana - semanaAnterior) / semanaAnterior) * 100) : null,
    mediaSemanal: conDatos.length ? Math.round(media(conDatos.map((s) => s.minutos))!) : null,
    mejorSemana: serie.reduce((m, s) => Math.max(m, s.minutos), 0),
    semanasSeguidas: seguidas,
    totalMinutos: suyos.reduce((t, f) => t + f.minutos, 0),
    serie,
  };
}

// ── Lo que veo ────────────────────────────────────────────────────────

export interface InsightTiempo {
  id: string;
  texto: string;
  tono: 'bien' | 'aviso' | 'info';
}

/**
 * Tres frases como mucho. No hay "poco tiempo": hay mas o menos que tu propia
 * semana pasada, y objetivos que tu mismo te has puesto.
 */
export function insightsTiempo(resumen: ResumenTiempo, av: Avance, diasDelPeriodo: number): InsightTiempo[] {
  const fuera: InsightTiempo[] = [];
  const h = (min: number) => `${Math.floor(min / 60)} h ${min % 60 ? `${min % 60} min` : ''}`.trim();

  if (resumen.minutos === 0) {
    return [{ id: 'vacio', tono: 'info', texto: 'Aun no has apuntado tiempo esta semana. Dale al play cuando empieces algo y se apunta solo.' }];
  }

  if (av.cambio !== null && Math.abs(av.cambio) >= 15) {
    fuera.push({
      id: 'cambio',
      tono: av.cambio > 0 ? 'bien' : 'info',
      texto: av.cambio > 0
        ? `Llevas ${h(av.estaSemana)} esta semana, un ${av.cambio} % mas que la pasada (${h(av.semanaAnterior)}).`
        : `Llevas ${h(av.estaSemana)} frente a ${h(av.semanaAnterior)} la semana pasada. Puede ser una semana rara, no pasa nada.`,
    });
  }

  const top = resumen.actividades[0];
  if (top && resumen.actividades.length > 1) {
    fuera.push({
      id: 'reparto',
      tono: 'info',
      texto: `Donde mas se te ha ido: ${top.emoji} ${top.nombre}, ${h(top.minutos)} (el ${top.pct} % de tu tiempo).`,
    });
  }

  // Objetivos que se ha puesto la persona, no numeros que le pongamos nosotros.
  const cumplidos = resumen.actividades.filter((a) => a.objetivoPct !== null && a.objetivoPct >= 100);
  const cortos = resumen.actividades.filter((a) => a.objetivoPct !== null && a.objetivoPct < 60);
  if (cumplidos.length) {
    fuera.push({
      id: 'objetivo_ok',
      tono: 'bien',
      texto: `Objetivo cumplido en ${cumplidos.map((a) => `${a.emoji} ${a.nombre}`).join(', ')}.`,
    });
  } else if (cortos.length === 1) {
    const a = cortos[0];
    fuera.push({
      id: 'objetivo_lejos',
      tono: 'aviso',
      texto: `En ${a.emoji} ${a.nombre} llevas ${h(a.minutos)} de los ${h(a.objetivoMin!)} que te propusiste. Te faltan ${h(a.objetivoMin! - a.minutos)}.`,
    });
  }

  if (av.semanasSeguidas >= 3) {
    fuera.push({ id: 'racha', tono: 'bien', texto: `${av.semanasSeguidas} semanas seguidas dedicandole tiempo. Eso es lo que acaba notandose.` });
  }

  if (resumen.diasActivos === 1 && diasDelPeriodo >= 4 && resumen.minutos >= 120) {
    fuera.push({
      id: 'concentrado',
      tono: 'info',
      texto: 'Todo el tiempo de la semana cayo en un solo dia. Repartirlo en varios ratos suele cundir mas que un atracon.',
    });
  }

  return fuera.slice(0, 3);
}

// ── El cronometro ─────────────────────────────────────────────────────

export interface Cronometro {
  actividad_id: string | null;
  descripcion: string | null;
  inicio: string | null;
  acumulado_seg: number;
}

/**
 * Segundos que lleva el cronometro. Se calcula siempre a partir de la marca de
 * tiempo guardada, nunca contando en el navegador: asi cerrar la app, cambiar
 * de movil o quedarse sin bateria no pierde el rato.
 */
export function segundosDelCronometro(c: Cronometro | null, ahora: number = Date.now()): number {
  if (!c) return 0;
  const corriendo = c.inicio ? Math.max(0, Math.floor((ahora - new Date(c.inicio).getTime()) / 1000)) : 0;
  return c.acumulado_seg + corriendo;
}

/** "1:04:07" o "12:35" si no llega a la hora. */
export function reloj(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const dd = (n: number) => String(n).padStart(2, '0');
  const horas = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  return horas ? `${horas}:${dd(min)}:${dd(s % 60)}` : `${dd(min)}:${dd(s % 60)}`;
}
