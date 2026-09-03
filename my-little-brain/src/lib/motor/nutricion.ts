import type { Actividad, Objetivo, Sexo } from '../tipos';

const FACTOR_ACTIVIDAD: Record<Actividad, number> = {
  sedentario: 1.2,
  ligera: 1.375,
  moderada: 1.55,
  alta: 1.725,
};

/** Ajuste calorico sobre el gasto total, por objetivo. */
const AJUSTE: Record<Objetivo, number> = {
  perder_grasa: -0.18,
  recomposicion: -0.08,
  ganar_musculo: 0.12,
  fuerza: 0.05,
  rendimiento: 0.05,
  energia: 0,
  salud_mental: 0,
};

/** Proteina en g por kg de peso corporal cuando no se conoce la masa magra. */
const PROTEINA_G_KG: Record<Objetivo, number> = {
  perder_grasa: 2.2,
  recomposicion: 2.2,
  ganar_musculo: 2.0,
  fuerza: 2.0,
  rendimiento: 1.9,
  energia: 1.8,
  salud_mental: 1.8,
};

/** Ritmo de cambio de peso razonable, en % del peso corporal por semana. */
const RITMO_PCT_SEMANA: Record<Objetivo, number> = {
  perder_grasa: -0.7,
  recomposicion: -0.25,
  ganar_musculo: 0.25,
  fuerza: 0.15,
  rendimiento: 0,
  energia: 0,
  salud_mental: 0,
};

export interface ObjetivosDiarios {
  tmb: number;
  gastoTotal: number;
  kcal: number;
  proteinaG: number;
  grasaG: number;
  carbosG: number;
  aguaMl: number;
  pasos: number;
  ritmoKgSemana: number;
  /** Si viene de una dieta importada o fijada a mano, quien la fijo. */
  manual?: string;
}

export interface DatosNutricion {
  sexo: Sexo;
  edad: number;
  alturaCm: number;
  actividad: Actividad;
  objetivo: Objetivo;
  pesoKg: number;
  grasaPct: number | null;
}

/** Mifflin-St Jeor. */
export function tmb(d: DatosNutricion): number {
  const base = 10 * d.pesoKg + 6.25 * d.alturaCm - 5 * d.edad;
  return d.sexo === 'hombre' ? base + 5 : base - 161;
}

export function objetivosDiarios(d: DatosNutricion): ObjetivosDiarios {
  const metabolismo = tmb(d);
  const gastoTotal = metabolismo * FACTOR_ACTIVIDAD[d.actividad];
  const objetivoKcal = gastoTotal * (1 + AJUSTE[d.objetivo]);
  // Suelo de seguridad: ni por debajo del basal ni de un minimo razonable.
  const suelo = Math.max(metabolismo * 1.05, d.sexo === 'mujer' ? 1300 : 1600);
  const kcal = Math.round(Math.max(objetivoKcal, suelo) / 10) * 10;

  const magra = d.grasaPct !== null ? d.pesoKg * (1 - d.grasaPct / 100) : null;
  const proteinaG = Math.round(magra !== null ? magra * 2.4 : d.pesoKg * PROTEINA_G_KG[d.objetivo]);
  const grasaG = Math.round(Math.max(d.pesoKg * 0.8, (kcal * 0.22) / 9));
  const carbosG = Math.max(50, Math.round((kcal - proteinaG * 4 - grasaG * 9) / 4));

  return {
    tmb: Math.round(metabolismo),
    gastoTotal: Math.round(gastoTotal),
    kcal,
    proteinaG,
    grasaG,
    carbosG,
    aguaMl: Math.round((d.pesoKg * 35) / 100) * 100,
    pasos: d.objetivo === 'perder_grasa' ? 10000 : 8000,
    ritmoKgSemana: Number(((d.pesoKg * RITMO_PCT_SEMANA[d.objetivo]) / 100).toFixed(2)),
  };
}

/** Compara la tendencia real de peso con el ritmo objetivo y propone un ajuste. */
export function ajusteCalorico(
  objetivos: ObjetivosDiarios,
  tendenciaKgSemana: number | null,
  objetivo: Objetivo,
): { estado: 'ok' | 'subir' | 'bajar' | 'sin_datos'; mensaje: string } {
  if (tendenciaKgSemana === null) {
    return {
      estado: 'sin_datos',
      mensaje: 'Apunta el peso 2-3 veces por semana durante un par de semanas y te dire si hay que tocar las calorias.',
    };
  }

  const kg = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)} kg/semana`;
  const meta = objetivos.ritmoKgSemana;

  if (meta === 0) {
    if (Math.abs(tendenciaKgSemana) <= 0.2) {
      return { estado: 'ok', mensaje: `Peso estable (${kg(tendenciaKgSemana)}). Sigue igual.` };
    }
    return tendenciaKgSemana > 0
      ? { estado: 'bajar', mensaje: `Estas subiendo ${kg(tendenciaKgSemana)}. Baja ~200 kcal si no lo buscas.` }
      : { estado: 'subir', mensaje: `Estas bajando ${kg(tendenciaKgSemana)}. Sube ~200 kcal si no lo buscas.` };
  }

  const diferencia = tendenciaKgSemana - meta;
  const margen = Math.max(0.15, Math.abs(meta) * 0.4);
  if (Math.abs(diferencia) <= margen) {
    return { estado: 'ok', mensaje: `Vas a ${kg(tendenciaKgSemana)}, justo en el objetivo (${kg(meta)}). No toques nada.` };
  }
  if (diferencia > 0) {
    return meta < 0
      ? { estado: 'bajar', mensaje: `Vas a ${kg(tendenciaKgSemana)} y deberias ir a ${kg(meta)}. Baja 150-200 kcal (o suma 2.000 pasos) y revisa en 2 semanas.` }
      : { estado: 'bajar', mensaje: `Subes mas rapido de lo ideal (${kg(tendenciaKgSemana)} vs ${kg(meta)}): mucho sera grasa. Baja 150 kcal.` };
  }
  return meta < 0
    ? { estado: 'subir', mensaje: `Bajas mas rapido de lo ideal (${kg(tendenciaKgSemana)} vs ${kg(meta)}). Sube 150 kcal para no perder musculo.` }
    : { estado: 'subir', mensaje: `Vas a ${kg(tendenciaKgSemana)} y el objetivo es ${kg(meta)}. Sube 150-200 kcal y revisa en 2 semanas.` };
}
