/**
 * Estado emocional. La app no intenta quitar las emociones malas: ayuda a
 * responder "¿que me esta pasando?" y "¿que accion pequena puedo hacer?".
 *
 * Las emociones son el clima. Las preocupaciones son hojas sobre el estanque.
 * El estanque sigue ahi aunque hoy no se vea con claridad.
 */
import { comparar, media } from './estadistica';
import type { Comparacion } from './estadistica';
import type { Dia } from './puntuaciones';
import type { EntradaDiario, Hoja, TemaHoja } from '../tipos';

export { comparar } from './estadistica';
export type { Comparacion } from './estadistica';

export interface Emocion {
  id: string;
  nombre: string;
  emoji: string;
  valencia: 'positiva' | 'negativa';
}

export const EMOCIONES: Emocion[] = [
  { id: 'tranquilo', nombre: 'Tranquilo', emoji: '😌', valencia: 'positiva' },
  { id: 'feliz', nombre: 'Feliz', emoji: '😄', valencia: 'positiva' },
  { id: 'motivado', nombre: 'Motivado', emoji: '🔥', valencia: 'positiva' },
  { id: 'orgulloso', nombre: 'Orgulloso', emoji: '💪', valencia: 'positiva' },
  { id: 'agradecido', nombre: 'Agradecido', emoji: '🙏', valencia: 'positiva' },
  { id: 'energetico', nombre: 'Energetico', emoji: '⚡', valencia: 'positiva' },
  { id: 'esperanzado', nombre: 'Esperanzado', emoji: '🌱', valencia: 'positiva' },
  { id: 'estresado', nombre: 'Estresado', emoji: '😤', valencia: 'negativa' },
  { id: 'ansioso', nombre: 'Ansioso', emoji: '😰', valencia: 'negativa' },
  { id: 'triste', nombre: 'Triste', emoji: '😔', valencia: 'negativa' },
  { id: 'frustrado', nombre: 'Frustrado', emoji: '😣', valencia: 'negativa' },
  { id: 'agobiado', nombre: 'Agobiado', emoji: '🥵', valencia: 'negativa' },
  { id: 'enfadado', nombre: 'Enfadado', emoji: '😠', valencia: 'negativa' },
  { id: 'solo', nombre: 'Solo', emoji: '🫥', valencia: 'negativa' },
  { id: 'desmotivado', nombre: 'Desmotivado', emoji: '😑', valencia: 'negativa' },
  { id: 'inseguro', nombre: 'Inseguro', emoji: '😬', valencia: 'negativa' },
];

export function emocion(id: string): Emocion {
  return EMOCIONES.find((e) => e.id === id) ?? { id, nombre: id, emoji: '·', valencia: 'negativa' };
}

export const TEMAS: { id: TemaHoja; nombre: string; emoji: string }[] = [
  { id: 'dinero', nombre: 'Dinero', emoji: '💶' },
  { id: 'trabajo', nombre: 'Trabajo', emoji: '💼' },
  { id: 'relaciones', nombre: 'Relaciones', emoji: '❤️' },
  { id: 'salud', nombre: 'Salud', emoji: '⚕️' },
  { id: 'futuro', nombre: 'Futuro', emoji: '🌫️' },
  { id: 'otros', nombre: 'Otros', emoji: '🍂' },
];

export const tema = (id: string) => TEMAS.find((t) => t.id === id) ?? TEMAS[TEMAS.length - 1];

/** Adivina el tema de una preocupacion escrita a mano, para no preguntar. */
export function temaDe(texto: string): TemaHoja {
  const t = texto.toLowerCase();
  if (/dinero|pasta|caja|factura|cobr|paga|deuda|hipoteca|alquiler|banco|gasto|ahorr|nomina/.test(t)) return 'dinero';
  if (/trabajo|curro|cliente|jefe|reunion|proyecto|empresa|negocio|despido|entrevista|equipo/.test(t)) return 'trabajo';
  if (/isa|pareja|novi|famili|madre|padre|herman|amig|discusion|relacion|hij/.test(t)) return 'relaciones';
  if (/salud|dolor|duele|molest|lesion|medic|analitica|peso|enferm|sueno|dormir|ansiedad|cansancio/.test(t)) return 'salud';
  if (/futuro|no se que|incertidumbre|manana|dentro de|carrera|mudar|decision/.test(t)) return 'futuro';
  return 'otros';
}

export interface PatronEmocional {
  id: string;
  texto: string;
  tono: 'bien' | 'aviso' | 'info';
  /** Cuanto separa a los dos grupos, para ordenar por relevancia. */
  fuerza: number;
}

export interface DatosPatrones {
  dias: Dia[];
  diario: EntradaDiario[];
  hojas: Hoja[];
  hoy: string;
}

/** Los patrones que la persona no ve sola: emocion frente a lo que hace. */
export function patronesEmocionales(datos: DatosPatrones): PatronEmocional[] {
  const { dias } = datos;
  const conDiario = new Set(datos.diario.map((e) => e.fecha));
  const salida: PatronEmocional[] = [];
  const anadir = (id: string, c: Comparacion | null, texto: (c: Comparacion) => string, tono: PatronEmocional['tono'], umbral = 8) => {
    if (c && Math.abs(c.cambio) >= umbral) salida.push({ id, texto: texto(c), tono, fuerza: Math.abs(c.cambio) });
  };

  anadir('entreno_animo', comparar(dias, (d) => d.entreno || d.actividad, (d) => d.animo),
    (c) => `Los dias que te mueves tu animo medio es ${c.con} y los que no, ${c.sin}: un ${Math.abs(c.cambio)} % ${c.cambio > 0 ? 'mejor' : 'peor'}.`,
    'bien');

  anadir('sueno_estres', comparar(dias, (d) => (d.suenoHoras ?? 0) >= 7, (d) => d.estres),
    (c) => c.cambio < 0
      ? `Durmiendo 7 h o mas tu estres baja de ${c.sin} a ${c.con}.`
      : `Tu estres no baja al dormir mas: mira por donde viene (${c.con} frente a ${c.sin}).`,
    'info');

  anadir('diario_estres', comparar(dias, (d) => conDiario.has(d.fecha), (d) => d.estres),
    (c) => c.cambio < 0
      ? `Los dias que escribes en el diario tu estres medio es ${c.con} en vez de ${c.sin}.`
      : `Escribes el diario sobre todo los dias dificiles (estres ${c.con} frente a ${c.sin}). Prueba a escribir tambien los buenos.`,
    'bien');

  anadir('foco_animo', comparar(dias, (d) => d.focoMin >= 60, (d) => d.animo),
    (c) => `Cuando sacas una hora de trabajo profundo tu animo sube a ${c.con} (frente a ${c.sin}).`,
    'bien');

  anadir('pasos_estres', comparar(dias, (d) => (d.pasos ?? 0) >= 8000, (d) => d.estres),
    (c) => c.cambio < 0 ? `Los dias que caminas 8.000 pasos tu estres baja a ${c.con} desde ${c.sin}.` : '',
    'bien');

  anadir('alcohol_animo', comparar(dias, (d) => d.alcoholUd > 0, (d) => d.animo),
    (c) => c.cambio < 0 ? `Los dias con alcohol tu animo medio cae a ${c.con} desde ${c.sin}.` : '',
    'aviso');

  const abiertas = datos.hojas.filter((h) => !h.cerrada);
  anadir('hojas_animo', comparar(dias, (d) => abiertas.filter((h) => h.creada === d.fecha).length > 0, (d) => d.animo),
    (c) => c.cambio < 0 ? `Los dias que apuntas una preocupacion nueva tu animo es ${c.con} frente a ${c.sin}.` : '',
    'info');

  return salida.filter((p) => p.texto).sort((a, b) => b.fuerza - a.fuerza);
}

export interface FactorDia {
  id: string;
  etiqueta: string;
  /** Presente en el X % de los mejores dias. */
  buenos: number;
  malos: number;
  diferencia: number;
}

const FACTORES: { id: string; etiqueta: string; cumple: (d: Dia) => boolean }[] = [
  { id: 'entreno', etiqueta: 'entrenar o moverte', cumple: (d) => d.entreno || d.actividad },
  { id: 'sueno', etiqueta: 'dormir 7 h o mas', cumple: (d) => (d.suenoHoras ?? 0) >= 7 },
  { id: 'foco', etiqueta: 'sacar trabajo profundo', cumple: (d) => d.focoMin >= 60 },
  { id: 'pasos', etiqueta: 'caminar 8.000 pasos', cumple: (d) => (d.pasos ?? 0) >= 8000 },
  { id: 'comer', etiqueta: 'comer segun tu plan', cumple: (d) => d.redondo },
  { id: 'alcohol', etiqueta: 'no beber alcohol', cumple: (d) => d.alcoholUd === 0 },
  { id: 'habitos', etiqueta: 'cumplir tus habitos', cumple: (d) => d.habitosTotal > 0 && d.habitosHechos >= d.habitosTotal },
];

/**
 * Que tienen en comun tus mejores dias y que tienen en comun los peores.
 * Aqui es donde la app deja de ser un tracker.
 */
export function perfilDeDias(dias: Dia[], minimo = 8): { buenos: FactorDia[]; malos: FactorDia[]; n: number } | null {
  const conAnimo = dias.filter((d) => d.animo !== null).sort((a, b) => (b.animo ?? 0) - (a.animo ?? 0));
  if (conAnimo.length < minimo) return null;

  const corte = Math.max(3, Math.round(conAnimo.length / 3));
  const mejores = conAnimo.slice(0, corte);
  const peores = conAnimo.slice(-corte);
  const pct = (lista: Dia[], cumple: (d: Dia) => boolean) => Math.round((lista.filter(cumple).length / lista.length) * 100);

  const factores = FACTORES.map((f) => {
    const buenos = pct(mejores, f.cumple);
    const malos = pct(peores, f.cumple);
    return { id: f.id, etiqueta: f.etiqueta, buenos, malos, diferencia: buenos - malos };
  }).sort((a, b) => b.diferencia - a.diferencia);

  return {
    buenos: factores.filter((f) => f.diferencia >= 25).slice(0, 3),
    malos: factores.filter((f) => f.diferencia <= -25).slice(0, 3),
    n: conAnimo.length,
  };
}

// ── Resumen y evidencias ──────────────────────────────────────────────

export interface ResumenEmocional {
  animoMedio: number | null;
  energiaMedia: number | null;
  estresMedio: number | null;
  frecuentes: { emocion: Emocion; veces: number }[];
  diasRegistrados: number;
  hojasAbiertas: Hoja[];
  hojasCerradas: Hoja[];
  temasFrecuentes: { tema: string; emoji: string; veces: number }[];
}

export function resumenEmocional(
  dias: Dia[],
  emocionesPorDia: { fecha: string; emociones: string[] }[],
  hojas: Hoja[],
  desde: string,
  hasta: string,
): ResumenEmocional {
  const rango = dias.filter((d) => d.fecha >= desde && d.fecha <= hasta);
  const cuenta = new Map<string, number>();
  for (const e of emocionesPorDia.filter((x) => x.fecha >= desde && x.fecha <= hasta)) {
    for (const id of e.emociones ?? []) cuenta.set(id, (cuenta.get(id) ?? 0) + 1);
  }
  const abiertas = hojas.filter((h) => !h.cerrada);
  const temas = new Map<string, number>();
  for (const h of hojas.filter((x) => x.creada >= desde)) temas.set(h.tema, (temas.get(h.tema) ?? 0) + 1);

  return {
    animoMedio: media(rango.map((d) => d.animo).filter((v): v is number => v !== null)),
    energiaMedia: media(rango.map((d) => d.energia).filter((v): v is number => v !== null)),
    estresMedio: media(rango.map((d) => d.estres).filter((v): v is number => v !== null)),
    frecuentes: [...cuenta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, veces]) => ({ emocion: emocion(id), veces })),
    diasRegistrados: rango.filter((d) => d.animo !== null).length,
    hojasAbiertas: abiertas,
    hojasCerradas: hojas.filter((h) => h.cerrada && h.cerrada >= desde),
    temasFrecuentes: [...temas.entries()].sort((a, b) => b[1] - a[1]).map(([id, veces]) => ({ tema: tema(id).nombre, emoji: tema(id).emoji, veces })),
  };
}

/**
 * Evidencias positivas: la mente recuerda los problemas, asi que la app
 * recuerda las pruebas de que la semana ha ido a algun sitio.
 */
export function evidenciasSemana(datos: {
  dias: Dia[];
  diario: EntradaDiario[];
  hojas: Hoja[];
  desde: string;
  hasta: string;
}): string[] {
  const rango = datos.dias.filter((d) => d.fecha >= datos.desde && d.fecha <= datos.hasta);
  const salida: string[] = [];

  const entrenos = rango.filter((d) => d.entreno).length;
  const actividades = rango.filter((d) => d.actividad).length;
  if (entrenos + actividades > 0) {
    salida.push(`Te has movido ${entrenos + actividades} ${entrenos + actividades === 1 ? 'dia' : 'dias'}${actividades ? ` (${actividades} fuera del plan)` : ''}.`);
  }

  const pesos = rango.map((d) => d.peso).filter((p): p is number => p !== null);
  if (pesos.length >= 2) {
    const cambio = Math.round((pesos[pesos.length - 1] - pesos[0]) * 10) / 10;
    if (Math.abs(cambio) >= 0.3) salida.push(`Tu peso ha ${cambio < 0 ? 'bajado' : 'subido'} ${Math.abs(cambio)} kg esta semana.`);
  }

  const foco = Math.round(rango.reduce((t, d) => t + d.focoMin, 0) / 60);
  if (foco >= 2) salida.push(`${foco} h de trabajo profundo.`);

  const redondos = rango.filter((d) => d.redondo).length;
  if (redondos) salida.push(`${redondos} ${redondos === 1 ? 'dia redondo' : 'dias redondos'}: entreno, calorias y proteina cuadrados.`);

  const retiradas = datos.hojas.filter((h) => h.cerrada && h.cerrada >= datos.desde && h.cerrada <= datos.hasta);
  for (const h of retiradas.slice(0, 2)) {
    salida.push(`Se fue una hoja del estanque: "${h.texto}"${h.accion ? ` — ${h.accion}` : ''}.`);
  }

  for (const e of datos.diario.filter((x) => x.fecha >= datos.desde && x.fecha <= datos.hasta && x.bien)) {
    for (const linea of (e.bien ?? '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 2)) {
      salida.push(linea.length > 90 ? linea.slice(0, 90) + '…' : linea);
    }
  }

  return salida.slice(0, 8);
}
