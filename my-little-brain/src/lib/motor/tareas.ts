/**
 * Las tareas de hoy.
 *
 * La decision de producto es el limite. Una lista de cuarenta pendientes no
 * ayuda a nadie: es una maquina de generar culpa, y esta app no va de eso. Lo
 * que si funciona es elegir tres cosas por la manana y saber por la noche si
 * salieron. Todo lo demas es mochila, y la mochila no se mira cada dia.
 *
 * La otra decision es no dejar que nada se arrastre en silencio. Una tarea que
 * lleva cinco dias saltando de un dia al siguiente no es una tarea: es una
 * decision que no se ha tomado. La app lo dice y ofrece las tres salidas
 * honestas: hacerla, trocearla o soltarla.
 */
import type { Tarea } from '../tipos';

/** Tres. Ni una mas: si todo es importante, nada lo es. */
export const MAX_HOY = 3;

/** A partir de aqui una tarea deja de ser una tarea y es una decision pendiente. */
export const POSPUESTA_DEMASIADO = 3;

export interface TareasDelDia {
  /** Las elegidas para hoy y aun sin hacer. */
  hoy: Tarea[];
  /** Las de hoy que ya estan cerradas. */
  hechasHoy: Tarea[];
  /** Venian de dias anteriores y siguen abiertas. */
  arrastradas: Tarea[];
  /** Lo que no es de hoy: sin fecha o para mas adelante. */
  mochila: Tarea[];
  /** Cuantas de las tres quedan libres. */
  huecos: number;
  /** true cuando eligio tareas para hoy y las cerro todas. */
  diaCerrado: boolean;
}

export function tareasDelDia(tareas: Tarea[], hoy: string): TareasDelDia {
  const deHoy = tareas.filter((t) => t.fecha === hoy);
  const hechasHoy = deHoy.filter((t) => t.completada);
  const abiertasHoy = deHoy.filter((t) => !t.completada);

  return {
    hoy: [...abiertasHoy].sort((a, b) => a.prioridad - b.prioridad),
    hechasHoy,
    arrastradas: tareas
      .filter((t) => !t.completada && t.fecha !== null && t.fecha < hoy)
      .sort((a, b) => (a.fecha! < b.fecha! ? -1 : 1)),
    mochila: tareas
      .filter((t) => !t.completada && (t.fecha === null || t.fecha > hoy))
      .sort((a, b) => a.prioridad - b.prioridad),
    huecos: Math.max(0, MAX_HOY - deHoy.length),
    diaCerrado: deHoy.length > 0 && abiertasHoy.length === 0,
  };
}

// ── El avance ─────────────────────────────────────────────────────────

export interface ProgresoTareas {
  /** Dias del periodo en los que eligio tareas. */
  diasConTareas: number;
  /** Dias en los que cerro todas las que se habia puesto. */
  diasCerrados: number;
  hechas: number;
  /** Dias seguidos cerrando el dia, contando hacia atras desde hoy. */
  racha: number;
  /** 0-100. null si no eligio tareas ningun dia. */
  pct: number | null;
}

/**
 * El avance mira los dias en los que la persona ELIGIO tareas. Un dia sin
 * tareas elegidas no es un dia fallado: es un dia que no uso esto. Contarlo
 * como cero seria mentir y, sobre todo, castigar por no usar la app.
 */
export function progresoTareas(tareas: Tarea[], fechas: string[]): ProgresoTareas {
  const porDia = fechas.map((fecha) => {
    const delDia = tareas.filter((t) => t.fecha === fecha);
    return { fecha, total: delDia.length, hechas: delDia.filter((t) => t.completada).length };
  });

  const conTareas = porDia.filter((d) => d.total > 0);
  const cerrados = conTareas.filter((d) => d.hechas === d.total);

  let racha = 0;
  for (const d of [...porDia].reverse()) {
    if (d.total === 0) continue; // un dia sin tareas no rompe la racha, se salta
    if (d.hechas === d.total) racha += 1;
    else break;
  }

  return {
    diasConTareas: conTareas.length,
    diasCerrados: cerrados.length,
    hechas: conTareas.reduce((t, d) => t + d.hechas, 0),
    racha,
    pct: conTareas.length ? Math.round((cerrados.length / conTareas.length) * 100) : null,
  };
}

// ── Lo que veo ────────────────────────────────────────────────────────

export interface InsightTareas {
  id: string;
  texto: string;
  tono: 'bien' | 'aviso' | 'info';
}

export function insightsTareas(dia: TareasDelDia, progreso: ProgresoTareas): InsightTareas[] {
  const fuera: InsightTareas[] = [];

  if (dia.diaCerrado) {
    fuera.push({
      id: 'cerrado',
      tono: 'bien',
      texto: progreso.racha >= 2
        ? `Dia cerrado, y van ${progreso.racha} seguidos. Eso es lo que mueve las cosas.`
        : 'Dia cerrado. Lo que te propusiste esta hecho.',
    });
  }

  // Lo que lleva demasiado tiempo saltando de un dia al siguiente.
  const atascada = [...dia.arrastradas, ...dia.hoy]
    .filter((t) => t.pospuesta >= POSPUESTA_DEMASIADO)
    .sort((a, b) => b.pospuesta - a.pospuesta)[0];
  if (atascada) {
    fuera.push({
      id: 'atascada',
      tono: 'aviso',
      texto: `"${atascada.titulo}" lleva ${atascada.pospuesta} dias pasando de un dia al siguiente. Eso ya no es una tarea, es una decision: hazla hoy, partela en algo de diez minutos, o suéltala sin remordimiento.`,
    });
  } else if (dia.arrastradas.length >= 3) {
    fuera.push({
      id: 'arrastre',
      tono: 'info',
      texto: `Tienes ${dia.arrastradas.length} cosas de dias anteriores. No las metas todas hoy: elige una y manda el resto a la mochila.`,
    });
  }

  if (!dia.hoy.length && !dia.hechasHoy.length) {
    fuera.push({
      id: 'vacio',
      tono: 'info',
      texto: 'Elige como mucho tres cosas para hoy. Si eliges diez, no vas a hacer ninguna.',
    });
  } else if (dia.hoy.length && progreso.pct !== null && progreso.diasConTareas >= 4) {
    fuera.push({
      id: 'historial',
      tono: 'info',
      texto: `Cierras el dia el ${progreso.pct} % de las veces que te pones tareas (${progreso.diasCerrados} de ${progreso.diasConTareas} dias).`,
    });
  }

  return fuera.slice(0, 3);
}
