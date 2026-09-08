/**
 * Las tareas de hoy.
 *
 * Tres es la recomendacion, no un muro. Una lista de cuarenta pendientes es
 * una maquina de generar culpa y esta app no va de eso, pero hay dias que de
 * verdad traen cinco cosas importantes y quien lo sabe es la persona, no la
 * app. Asi que se pueden poner las que hagan falta: lo unico que hace la app
 * es marcar donde estaba la linea y, cuando tenga dias suficientes, contarle
 * con SUS numeros que le pasa los dias que se pone mas de tres. Un dato es
 * mas util que una norma.
 *
 * La otra decision es no dejar que nada se arrastre en silencio. Una tarea que
 * lleva cinco dias saltando de un dia al siguiente no es una tarea: es una
 * decision que no se ha tomado. La app lo dice y ofrece las tres salidas
 * honestas: hacerla, trocearla o soltarla.
 */
import type { Tarea } from '../tipos';

/**
 * Las que se recomiendan al dia. No es un tope: se pueden poner mas.
 * Sigue llamandose MAX_HOY por compatibilidad con lo que ya lo usa.
 */
export const MAX_HOY = 3;
export const RECOMENDADAS = MAX_HOY;

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
  /** Cuantas quedan hasta las tres recomendadas. 0 si ya las ha pasado. */
  huecos: number;
  /** Cuantas se ha puesto por encima de las tres. */
  extra: number;
  /** true cuando eligio tareas para hoy y las cerro todas, sean las que sean. */
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
    huecos: Math.max(0, RECOMENDADAS - deHoy.length),
    extra: Math.max(0, deHoy.length - RECOMENDADAS),
    diaCerrado: deHoy.length > 0 && abiertasHoy.length === 0,
  };
}

// ── El avance ─────────────────────────────────────────────────────────

export interface ProgresoTareas {
  /** Dias del periodo en los que eligio tareas. */
  diasConTareas: number;
  /**
   * Que tal le va segun cuantas se ponga. Es la unica forma honesta de hablar
   * del numero: con sus dias, no con una norma nuestra.
   */
  segunCuantas: { hasta3: { dias: number; cerrados: number }; masDe3: { dias: number; cerrados: number } };
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

  const grupo = (filtra: (d: { total: number }) => boolean) => {
    const suyos = conTareas.filter(filtra);
    return { dias: suyos.length, cerrados: suyos.filter((d) => d.hechas === d.total).length };
  };

  return {
    diasConTareas: conTareas.length,
    segunCuantas: {
      hasta3: grupo((d) => d.total <= RECOMENDADAS),
      masDe3: grupo((d) => d.total > RECOMENDADAS),
    },
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

  // Que le pasa a ESTA persona los dias que se pone mas de tres. Sin dias
  // suficientes en los dos grupos no decimos nada: seria una opinion.
  const { hasta3, masDe3 } = progreso.segunCuantas;
  if (dia.extra > 0 && hasta3.dias >= 3 && masDe3.dias >= 3) {
    const pctPocas = Math.round((hasta3.cerrados / hasta3.dias) * 100);
    const pctMuchas = Math.round((masDe3.cerrados / masDe3.dias) * 100);
    if (pctPocas - pctMuchas >= 20) {
      fuera.push({
        id: 'mas_de_tres',
        tono: 'info',
        texto: `Los dias de tres o menos cierras el ${pctPocas} % y los de mas, el ${pctMuchas} %. Hoy te has puesto ${dia.hoy.length + dia.hechasHoy.length}: tu sabras si el dia da para tanto.`,
      });
    } else if (pctMuchas >= pctPocas) {
      fuera.push({
        id: 'mas_de_tres',
        tono: 'bien',
        texto: `Los dias que te pones mas de tres cierras el ${pctMuchas} %, igual o mejor que los flojos. Este ritmo es el tuyo.`,
      });
    }
  }

  if (!dia.hoy.length && !dia.hechasHoy.length) {
    fuera.push({
      id: 'vacio',
      tono: 'info',
      texto: 'Elige lo que de verdad mueve el dia. Tres suele ser el numero que cunde, pero el dia es tuyo.',
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
