/**
 * Descanso: sueno, agua y cafeina.
 *
 * Filosofia, igual que en el resto de la app: no culpabilizar. Dormir mal una
 * noche no es un fracaso, es un dato. Lo que de verdad ayuda no es el numero
 * de horas de anoche, sino dos cosas que casi nadie mira:
 *
 *  1. La REGULARIDAD. Acostarse siempre a la misma hora vale mas que dormir
 *     nueve horas un sabado. Por eso medimos la dispersion de la hora de
 *     acostarse, no solo la media de horas.
 *  2. El PRECIO. Que le cuesta a tu dia dormir poco: cuanto come, cuanto
 *     entrena y como se siente esa persona los dias que ha dormido mal.
 *     Ese numero mueve mas que cualquier consejo generico.
 *
 * El agua es lo contrario: no tiene misterio, solo friccion. Aqui la unica
 * decision de producto es que apuntarla cueste un toque.
 */
import { comparar, desviacion, media } from './estadistica';
import type { Dia } from './puntuaciones';

// ── Agua ──────────────────────────────────────────────────────────────

export const VASO_ML = 250;
export const BOTELLA_ML = 500;

/** Techo por si alguien se equivoca tecleando: 8 litros en un dia no es real. */
export const AGUA_MAX_ML = 8000;

export interface ContextoAgua {
  pesoKg: number;
  /** Entreno o actividad hoy: se suda y hay que reponer. */
  entreno?: boolean;
  /** Unidades de alcohol del dia: cada una deshidrata. */
  alcoholUd?: number;
}

/**
 * Objetivo de agua del dia en ml. La base (35 ml por kilo) es la misma que usa
 * el motor de nutricion; aqui se le suman los extras del dia concreto.
 */
export function objetivoAgua({ pesoKg, entreno = false, alcoholUd = 0 }: ContextoAgua): number {
  const base = (pesoKg || 75) * 35;
  const extra = (entreno ? 500 : 0) + Math.min(alcoholUd, 6) * 250;
  return Math.round((base + extra) / 100) * 100;
}

/** Las piezas del objetivo, para poder explicarle a la persona de donde sale. */
export function desgloseAgua(ctx: ContextoAgua): { etiqueta: string; ml: number }[] {
  const partes = [{ etiqueta: 'por tu peso', ml: Math.round(((ctx.pesoKg || 75) * 35) / 100) * 100 }];
  if (ctx.entreno) partes.push({ etiqueta: 'por el entreno', ml: 500 });
  const porAlcohol = Math.min(ctx.alcoholUd ?? 0, 6) * 250;
  if (porAlcohol) partes.push({ etiqueta: 'por el alcohol', ml: porAlcohol });
  return partes;
}

export interface ResumenAgua {
  hoyMl: number;
  objetivoMl: number;
  /** 0-100, tope 100 para la barra. */
  pct: number;
  vasosQueFaltan: number;
  mediaMl: number | null;
  /** Dias de la ventana en los que llego al objetivo. */
  diasCumplidos: number;
  diasConDato: number;
  /** Dias seguidos, hasta hoy, llegando al objetivo. */
  racha: number;
}

export function resumenAgua(dias: Dia[], objetivoMl: number, hoy: string): ResumenAgua {
  const hoyMl = dias.find((d) => d.fecha === hoy)?.aguaMl ?? 0;
  const conDato = dias.filter((d) => d.aguaMl > 0);
  // La racha mira de hoy hacia atras y para en el primer dia que no llego.
  // Hoy sin terminar no rompe la racha: aun le queda dia por delante.
  let racha = 0;
  for (const d of [...dias].reverse()) {
    if (d.aguaMl >= objetivoMl) racha += 1;
    else if (d.fecha !== hoy) break;
  }
  return {
    hoyMl,
    objetivoMl,
    pct: Math.min(100, Math.round((hoyMl / objetivoMl) * 100)),
    vasosQueFaltan: Math.max(0, Math.ceil((objetivoMl - hoyMl) / VASO_ML)),
    mediaMl: conDato.length ? Math.round(media(conDato.map((d) => d.aguaMl))!) : null,
    diasCumplidos: conDato.filter((d) => d.aguaMl >= objetivoMl).length,
    diasConDato: conDato.length,
    racha,
  };
}

// ── Sueno ─────────────────────────────────────────────────────────────

export const OBJETIVO_SUENO_H = 7.5;

/**
 * El objetivo sale del horario que la persona dijo querer en el onboarding
 * (hora_dormir / hora_despertar). Si no lo puso, 7,5 h. No inventamos una
 * cifra "ideal": usamos la suya y medimos cuanto se acerca.
 */
export function objetivoSueno(horaDormir: string | null, horaDespertar: string | null): number {
  const h = horasDeSueno(horaDormir, horaDespertar);
  if (h === null) return OBJETIVO_SUENO_H;
  return Math.min(11, Math.max(5, h));
}

/** "23:30" -> 1410. Devuelve null si no es una hora valida. */
export function minutosDeHora(hora: string | null): number | null {
  if (!hora) return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(hora);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/**
 * Horas entre acostarse y levantarse, cruzando la medianoche.
 * Se redondea a un decimal porque nadie duerme con precision de segundos.
 */
export function horasDeSueno(inicio: string | null, fin: string | null): number | null {
  const a = minutosDeHora(inicio);
  const b = minutosDeHora(fin);
  if (a === null || b === null) return null;
  const minutos = b > a ? b - a : b + 1440 - a;
  // Mas de 14 h o menos de 2 h casi siempre es un dedazo con el am/pm.
  if (minutos < 120 || minutos > 840) return null;
  return Math.round((minutos / 60) * 10) / 10;
}

/**
 * La hora de acostarse en minutos desde las 18:00, para poder promediarla sin
 * que las 00:30 y las 23:30 parezcan estar a 23 horas de distancia.
 */
export function minutosDesdeLasSeis(hora: string | null): number | null {
  const m = minutosDeHora(hora);
  if (m === null) return null;
  return m >= 18 * 60 ? m - 18 * 60 : m + 6 * 60;
}

/** 330 -> "23:30". Inversa de minutosDesdeLasSeis. */
export function horaDesdeLasSeis(minutos: number): string {
  const total = Math.round(minutos + 18 * 60) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export interface ResumenSueno {
  mediaHoras: number | null;
  noches: number;
  /** Cuanto baila la hora de acostarse, en minutos. Cuanto menos, mejor. */
  regularidadMin: number | null;
  horaHabitual: string | null;
  /**
   * La hora a la que ya se acuesta en sus mejores noches. Es la que se propone
   * cuando el horario baila: proponer la media de un desastre no ayuda, y esta
   * ya la ha conseguido, asi que no es una meta inventada.
   */
  horaBuena: string | null;
  /** Horas que faltan respecto al objetivo en la ventana mirada. */
  deudaHoras: number;
  nochesCortas: number;
  calidadMedia: number | null;
  objetivoHoras: number;
}

export function resumenSueno(dias: Dia[], objetivoHoras = OBJETIVO_SUENO_H): ResumenSueno {
  const conSueno = dias.filter((d) => d.suenoHoras !== null);
  const horas = conSueno.map((d) => d.suenoHoras!);
  const acostadas = dias
    .map((d) => minutosDesdeLasSeis(d.suenoInicio))
    .filter((v): v is number => v !== null);
  const calidades = dias.map((d) => d.suenoCalidad).filter((v): v is number => v !== null);
  const habitual = acostadas.length >= 2 ? media(acostadas) : null;
  // Mediana de la mitad mas temprana: robusta frente a una noche suelta.
  const tempranas = [...acostadas].sort((a, b) => a - b).slice(0, Math.max(1, Math.ceil(acostadas.length / 2)));
  const buena = tempranas.length ? tempranas[Math.floor((tempranas.length - 1) / 2)] : null;

  return {
    mediaHoras: horas.length ? Math.round(media(horas)! * 10) / 10 : null,
    noches: horas.length,
    regularidadMin: acostadas.length >= 3 ? Math.round(desviacion(acostadas)!) : null,
    horaHabitual: habitual === null ? null : horaDesdeLasSeis(habitual),
    horaBuena: buena === null ? null : horaDesdeLasSeis(buena),
    deudaHoras: Math.round(horas.reduce((t, h) => t + Math.max(0, objetivoHoras - h), 0) * 10) / 10,
    nochesCortas: horas.filter((h) => h < 6.5).length,
    calidadMedia: calidades.length ? Math.round(media(calidades)! * 10) / 10 : null,
    objetivoHoras,
  };
}

// ── Que te cuesta dormir mal ──────────────────────────────────────────

export interface PatronDescanso {
  id: string;
  texto: string;
  tono: 'bien' | 'aviso' | 'info';
  /** Para ordenar por relevancia: cuanto separa a los dos grupos. */
  fuerza: number;
}

const CORTO_H = 6.5;

/**
 * El precio real de dormir poco, en las cosas que la app ya sabe de la persona.
 * Solo hablamos cuando hay dias suficientes en los dos grupos.
 */
export function impactoSueno(dias: Dia[]): PatronDescanso[] {
  const fuera: PatronDescanso[] = [];
  const corto = (d: Dia) => (d.suenoHoras ?? 99) < CORTO_H;
  const anadir = (id: string, comp: ReturnType<typeof comparar>, texto: (c: NonNullable<typeof comp>) => string,
    tono: PatronDescanso['tono'] = 'aviso') => {
    if (!comp || Math.abs(comp.cambio) < 12) return;
    fuera.push({ id, texto: texto(comp), tono, fuerza: Math.abs(comp.cambio) });
  };

  anadir('energia', comparar(dias, corto, (d) => d.energia), (c) =>
    `Los dias que duermes menos de ${CORTO_H} h tu energia baja de ${c.sin} a ${c.con} sobre 10.`);
  anadir('animo', comparar(dias, corto, (d) => d.animo), (c) =>
    `Con menos de ${CORTO_H} h tu animo pasa de ${c.sin} a ${c.con} sobre 10.`);
  anadir('estres', comparar(dias, corto, (d) => d.estres), (c) =>
    `Durmiendo poco tu estres sube de ${c.sin} a ${c.con} sobre 10.`);
  anadir('kcal', comparar(dias, corto, (d) => (d.kcal > 0 ? d.kcal : null)), (c) =>
    c.cambio > 0
      ? `Los dias de dormir poco comes ${Math.round(c.con - c.sin)} kcal mas. No es falta de fuerza de voluntad: es el hambre que da no dormir.`
      : `Los dias de dormir poco comes ${Math.round(c.sin - c.con)} kcal menos.`);
  anadir('foco', comparar(dias, corto, (d) => (d.focoMin > 0 ? d.focoMin : null)), (c) =>
    `Con menos de ${CORTO_H} h haces ${Math.round(Math.abs(c.con - c.sin))} min menos de foco al dia.`);

  // Entrenar es si/no, asi que va en proporcion de dias y no en media.
  const cortos = dias.filter((d) => d.suenoHoras !== null && corto(d));
  const largos = dias.filter((d) => d.suenoHoras !== null && !corto(d));
  if (cortos.length >= 3 && largos.length >= 3) {
    const pct = (xs: Dia[]) => Math.round((xs.filter((d) => d.entreno || d.actividad).length / xs.length) * 100);
    const pc = pct(cortos);
    const pl = pct(largos);
    if (pl - pc >= 20) {
      fuera.push({
        id: 'entreno',
        texto: `Entrenas el ${pl} % de los dias que duermes bien y solo el ${pc} % de los que duermes poco.`,
        tono: 'aviso',
        fuerza: pl - pc,
      });
    }
  }

  // La cafeina tardia: el unico habito con el que se puede hacer algo hoy mismo.
  anadir('cafeina', comparar(dias, (d) => (minutosDeHora(d.cafeinaUltima) ?? 0) >= 16 * 60, (d) => d.suenoHoras), (c) =>
    c.cambio < 0
      ? `Los dias que tomas el ultimo cafe despues de las 16:00 duermes ${Math.round(Math.abs(c.con - c.sin) * 60)} min menos.`
      : `Tomar cafe por la tarde no te esta quitando sueno (${c.con} h frente a ${c.sin} h).`,
    'info');

  return fuera.sort((a, b) => b.fuerza - a.fuerza);
}

// ── Lo que veo ────────────────────────────────────────────────────────

export interface InsightDescanso {
  id: string;
  texto: string;
  tono: 'alerta' | 'aviso' | 'bien' | 'info';
}

export interface DatosInsights {
  dias: Dia[];
  sueno: ResumenSueno;
  agua: ResumenAgua;
  hoy: string;
  /** La hora a la que dijo que queria acostarse, para contrastarla. */
  horaObjetivo?: string | null;
}

/**
 * Cuatro frases como mucho, las mas urgentes primero. Ninguna regana: dicen
 * que pasa y, cuando la hay, una accion pequena.
 */
export function insightsDescanso({ dias, sueno, agua, hoy, horaObjetivo }: DatosInsights): InsightDescanso[] {
  const fuera: InsightDescanso[] = [];

  // Sueno
  const ultimas = dias.filter((d) => d.suenoHoras !== null).slice(-3);
  if (ultimas.length === 3 && ultimas.every((d) => d.suenoHoras! < 6.5)) {
    fuera.push({
      id: 'racha_corta',
      tono: 'alerta',
      texto: 'Tres noches seguidas por debajo de 6,5 h. Hoy no hace falta nada heroico: acuestate media hora antes.',
    });
  } else if (sueno.mediaHoras !== null && sueno.mediaHoras < 6.5 && sueno.noches >= 4) {
    fuera.push({
      id: 'media_baja',
      tono: 'aviso',
      texto: `Duermes ${sueno.mediaHoras} h de media. Es la palanca que mas te cambiaria el resto: energia, hambre y ganas de entrenar.`,
    });
  } else if (sueno.mediaHoras !== null && sueno.mediaHoras >= sueno.objetivoHoras - 0.3 && sueno.noches >= 5) {
    fuera.push({
      id: 'sueno_bien',
      tono: 'bien',
      texto: `${sueno.mediaHoras} h de media. Esto es lo que hace que todo lo demas cueste menos.`,
    });
  }

  if (sueno.regularidadMin !== null && sueno.horaHabitual) {
    if (sueno.regularidadMin >= 60) {
      fuera.push({
        id: 'irregular',
        tono: 'aviso',
        texto: `Te acuestas a horas muy distintas (${sueno.regularidadMin} min de diferencia entre unas noches y otras). Tu cuerpo no sabe cuando toca apagar.${sueno.horaBuena ? ` Tus mejores noches te acuestas sobre las ${sueno.horaBuena}: prueba a repetir esa hora y moverte solo media hora.` : ' Elige una hora y muevete solo media hora alrededor.'}`,
      });
    } else if (sueno.regularidadMin <= 30 && sueno.noches >= 5) {
      fuera.push({
        id: 'regular',
        tono: 'bien',
        texto: `Te acuestas casi siempre sobre las ${sueno.horaHabitual}. Esa regularidad vale mas que una noche larga suelta.`,
      });
    }
  }

  // Lo que dijiste que querias frente a lo que haces. Sin reganar: el dato.
  const objetivoMin = minutosDesdeLasSeis(horaObjetivo ?? null);
  const habitualMin = minutosDesdeLasSeis(sueno.horaHabitual);
  if (objetivoMin !== null && habitualMin !== null && sueno.noches >= 4) {
    const retraso = Math.round(habitualMin - objetivoMin);
    if (retraso >= 30) {
      fuera.push({
        id: 'retraso',
        tono: 'info',
        texto: `Querias acostarte a las ${horaObjetivo} y te acuestas de media a las ${sueno.horaHabitual}: ${retraso} min mas tarde. O adelantas la hora, o cambias el objetivo por uno que si sea el tuyo.`,
      });
    } else if (retraso <= 10 && retraso >= -30) {
      fuera.push({
        id: 'a_la_hora',
        tono: 'bien',
        texto: `Te estas acostando a la hora que te propusiste, sobre las ${horaObjetivo}.`,
      });
    }
  }

  if (sueno.deudaHoras >= 5) {
    fuera.push({
      id: 'deuda',
      tono: 'aviso',
      texto: `Llevas ${sueno.deudaHoras} h de sueno por debajo de tu objetivo en esta racha de dias. No se recupera de golpe un domingo: se recupera acostandose antes varios dias.`,
    });
  }

  // Agua
  if (agua.hoyMl === 0) {
    fuera.push({ id: 'agua_cero', tono: 'info', texto: `Hoy no has apuntado agua. Tu objetivo son ${(agua.objetivoMl / 1000).toFixed(1)} l, unos ${Math.round(agua.objetivoMl / VASO_ML)} vasos.` });
  } else if (agua.pct >= 100) {
    fuera.push({
      id: 'agua_hecha',
      tono: 'bien',
      texto: agua.racha >= 3 ? `Objetivo de agua cumplido, ${agua.racha} dias seguidos.` : 'Objetivo de agua cumplido hoy.',
    });
  } else if (agua.vasosQueFaltan > 0) {
    fuera.push({
      id: 'agua_faltan',
      tono: agua.pct < 40 ? 'aviso' : 'info',
      texto: `Te faltan ${agua.vasosQueFaltan} ${agua.vasosQueFaltan === 1 ? 'vaso' : 'vasos'} para tu objetivo de hoy.`,
    });
  }

  const hoyDia = dias.find((d) => d.fecha === hoy);
  if (hoyDia && (hoyDia.entreno || hoyDia.actividad) && agua.pct < 70) {
    fuera.push({
      id: 'agua_entreno',
      tono: 'aviso',
      texto: 'Hoy has entrenado y vas por debajo de la mitad del agua. Un vaso ahora te ahorra el dolor de cabeza de esta noche.',
    });
  }

  const orden = { alerta: 0, aviso: 1, bien: 2, info: 3 };
  return fuera.sort((a, b) => orden[a.tono] - orden[b.tono]).slice(0, 4);
}
