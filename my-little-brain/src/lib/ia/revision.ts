import type { Panel } from '../datos';
import { fechaCorta, inicioSemana, sumarDias } from '../fechas';
import { correlaciones, type Dia } from '../motor/puntuaciones';
import { ETIQUETA_OBJETIVO } from '../perfil';
import type { RevisionSemanal } from '../tipos';

export interface EstadisticasSemana {
  desde: string;
  hasta: string;
  dias: Dia[];
  entrenos: number;
  entrenosObjetivo: number;
  kcalMedia: number | null;
  proteinaMedia: number | null;
  diasConRegistro: number;
  diasConAlcohol: number;
  alcoholTotal: number;
  focoHoras: number;
  habitosPct: number | null;
  suenoMedio: number | null;
  animoMedio: number | null;
  energiaMedia: number | null;
  estresMedio: number | null;
  pesoInicio: number | null;
  pesoFin: number | null;
  cambioPeso: number | null;
}

const media = (valores: (number | null)[]): number | null => {
  const limpios = valores.filter((v): v is number => v !== null && Number.isFinite(v));
  if (!limpios.length) return null;
  return limpios.reduce((a, b) => a + b, 0) / limpios.length;
};

/** Los numeros de la semana, calculados por la app (la IA solo los interpreta). */
export function estadisticasSemana(panel: Panel, lunes: string): EstadisticasSemana {
  const domingo = sumarDias(lunes, 6);
  const dias = panel.dias.filter((d) => d.fecha >= lunes && d.fecha <= domingo);
  const conRegistro = dias.filter((d) => d.comidas > 0);
  const pesos = dias.filter((d) => d.peso !== null);

  const habitosPosibles = dias.reduce((total, d) => total + d.habitosTotal, 0);
  const habitosHechos = dias.reduce((total, d) => total + d.habitosHechos, 0);

  return {
    desde: lunes,
    hasta: domingo,
    dias,
    entrenos: dias.filter((d) => d.entreno).length,
    entrenosObjetivo: panel.perfil.dias_semana ?? 3,
    kcalMedia: conRegistro.length
      ? Math.round(conRegistro.reduce((t, d) => t + d.kcal, 0) / conRegistro.length)
      : null,
    proteinaMedia: conRegistro.length
      ? Math.round(conRegistro.reduce((t, d) => t + d.proteina, 0) / conRegistro.length)
      : null,
    diasConRegistro: conRegistro.length,
    diasConAlcohol: dias.filter((d) => d.alcoholUd > 0).length,
    alcoholTotal: dias.reduce((t, d) => t + d.alcoholUd, 0),
    focoHoras: Number((dias.reduce((t, d) => t + d.focoMin, 0) / 60).toFixed(1)),
    habitosPct: habitosPosibles ? Math.round((habitosHechos / habitosPosibles) * 100) : null,
    suenoMedio: media(dias.map((d) => d.suenoHoras)),
    animoMedio: media(dias.map((d) => d.animo)),
    energiaMedia: media(dias.map((d) => d.energia)),
    estresMedio: media(dias.map((d) => d.estres)),
    pesoInicio: pesos[0]?.peso ?? null,
    pesoFin: pesos[pesos.length - 1]?.peso ?? null,
    cambioPeso:
      pesos.length >= 2 ? Number(((pesos[pesos.length - 1].peso ?? 0) - (pesos[0].peso ?? 0)).toFixed(2)) : null,
  };
}

const n = (valor: number | null, decimales = 1) =>
  valor === null || !Number.isFinite(valor) ? 'sin datos' : valor.toFixed(decimales);

/** Prompt de la revision: datos duros dentro, narrativa fuera. */
export function promptRevision(panel: Panel, stats: EstadisticasSemana): string {
  const correl = correlaciones(panel.dias.slice(-30));
  const detalleDias = stats.dias
    .map(
      (d) =>
        `${fechaCorta(d.fecha)}: ${d.kcal || '—'} kcal, ${d.proteina || '—'} g prot, ${d.entreno ? 'entreno' : 'sin entreno'}, ${d.focoMin} min foco, ${d.alcoholUd || 0} ud alcohol, sueno ${d.suenoHoras ?? '—'} h, animo ${d.animo ?? '—'}`,
    )
    .join('\n');

  return `Semana del ${stats.desde} al ${stats.hasta}.

OBJETIVO DEL USUARIO: ${panel.perfil.objetivo ? ETIQUETA_OBJETIVO[panel.perfil.objetivo] : 'sin definir'}.
Meta diaria: ${panel.metas ? `${panel.metas.kcal} kcal y ${panel.metas.proteinaG} g de proteina` : 'sin calcular'}.
Ritmo de peso objetivo: ${panel.metas ? `${panel.metas.ritmoKgSemana} kg/semana` : 'sin calcular'}.

NUMEROS DE LA SEMANA (calculados por la app, no los recalcules)
- Entrenos: ${stats.entrenos} de ${stats.entrenosObjetivo}.
- Nutricion: ${stats.diasConRegistro}/7 dias registrados, media ${stats.kcalMedia ?? 'sin datos'} kcal y ${stats.proteinaMedia ?? 'sin datos'} g de proteina.
- Alcohol: ${stats.alcoholTotal} unidades en ${stats.diasConAlcohol} dias.
- Foco: ${stats.focoHoras} h.
- Habitos: ${stats.habitosPct === null ? 'sin habitos definidos' : `${stats.habitosPct}% de cumplimiento`}.
- Sueno medio: ${n(stats.suenoMedio)} h. Animo ${n(stats.animoMedio)}/10, energia ${n(stats.energiaMedia)}/10, estres ${n(stats.estresMedio)}/10.
- Peso: de ${stats.pesoInicio ?? '—'} kg a ${stats.pesoFin ?? '—'} kg (${stats.cambioPeso === null ? 'sin datos' : `${stats.cambioPeso > 0 ? '+' : ''}${stats.cambioPeso} kg`}).
- Puntuaciones de la semana: nutricion ${panel.puntuaciones.nutricion ?? '—'}, entrenamiento ${panel.puntuaciones.entrenamiento ?? '—'}, foco ${panel.puntuaciones.foco ?? '—'}, habitos ${panel.puntuaciones.habitos ?? '—'}, mente ${panel.puntuaciones.mente ?? '—'}.

DIA A DIA
${detalleDias}

${correl.length ? `CORRELACIONES DE LOS ULTIMOS 30 DIAS (r de Pearson)\n${correl.map((c) => `- ${c.variable} vs ${c.contra}: r = ${c.r} (n = ${c.n})`).join('\n')}` : 'Sin correlaciones significativas todavia.'}

Escribe la revision semanal. Reglas:
- Usa solo estos numeros. Si algo no esta medido, dilo en vez de suponerlo.
- Identifica UN cuello de botella: la palanca que, si la mueve, arrastra a las demas. Justificalo con los datos o con las correlaciones.
- Las acciones para la semana que viene son tres, concretas y medibles.
- Tono de jefe de operaciones de su vida: directo, sin peloteo, sin frases de coach de Instagram.

Responde SOLO con un objeto JSON valido, sin texto alrededor ni bloques de codigo, con estas claves:
{"titular": "una frase que resuma la semana",
 "cuerpo": "2-4 frases con la lectura general",
 "nutricion": "1-2 frases",
 "entrenamiento": "1-2 frases",
 "productividad": "1-2 frases",
 "habitos": "1-2 frases",
 "animo": "1-2 frases sobre sueno, animo y energia",
 "cuello_botella": "el cuello de botella y por que, con datos",
 "victorias": ["2-3 cosas que ha hecho bien"],
 "errores": ["1-3 cosas que le estan costando"],
 "acciones": ["3 acciones concretas para la proxima semana"]}`;
}

/** Extrae el JSON de la respuesta aunque venga envuelto en texto o en ```json. */
export function parsearRevision(texto: string): RevisionSemanal | null {
  const limpio = texto.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const inicio = limpio.indexOf('{');
  const fin = limpio.lastIndexOf('}');
  if (inicio === -1 || fin === -1) return null;

  try {
    const bruto = JSON.parse(limpio.slice(inicio, fin + 1)) as Partial<RevisionSemanal>;
    const lista = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
    return {
      titular: bruto.titular ?? 'Revision de la semana',
      cuerpo: bruto.cuerpo ?? '',
      nutricion: bruto.nutricion ?? '',
      entrenamiento: bruto.entrenamiento ?? '',
      productividad: bruto.productividad ?? '',
      habitos: bruto.habitos ?? '',
      animo: bruto.animo ?? '',
      cuello_botella: bruto.cuello_botella ?? '',
      victorias: lista(bruto.victorias),
      errores: lista(bruto.errores),
      acciones: lista(bruto.acciones),
    };
  } catch {
    return null;
  }
}

export { inicioSemana };
