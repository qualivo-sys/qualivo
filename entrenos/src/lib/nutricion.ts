import type { Actividad, Objetivo, Perfil } from './types';

const FACTOR_ACTIVIDAD: Record<Actividad, number> = {
  sedentario: 1.2,
  ligera: 1.375,
  moderada: 1.55,
  alta: 1.725,
};

/** Ajuste calorico sobre el gasto total, por objetivo. */
const AJUSTE: Record<Objetivo, number> = {
  perder_grasa: -0.18,
  ganar_musculo: 0.12,
  mantener: 0,
  fuerza: 0.05,
};

/** Proteina en g por kg de peso corporal. */
const PROTEINA_G_KG: Record<Objetivo, number> = {
  perder_grasa: 2.2,
  ganar_musculo: 2.0,
  mantener: 1.8,
  fuerza: 2.0,
};

/** Ritmo de cambio de peso razonable, en % del peso corporal por semana. */
const RITMO_PCT_SEMANA: Record<Objetivo, number> = {
  perder_grasa: -0.7,
  ganar_musculo: 0.25,
  mantener: 0,
  fuerza: 0.15,
};

export interface PlanNutricional {
  tmb: number;
  gastoTotal: number;
  calorias: number;
  proteinaG: number;
  grasaG: number;
  carbosG: number;
  aguaMl: number;
  pasos: number;
  ritmoKgSemana: number;
  /** Kcal por gramo de cada macro, para la tabla. */
  desglose: { nombre: string; gramos: number; kcal: number; pct: number }[];
}

/** Mifflin-St Jeor. */
export function tmb(perfil: Perfil, pesoKg: number): number {
  const base = 10 * pesoKg + 6.25 * perfil.alturaCm - 5 * perfil.edad;
  return perfil.sexo === 'hombre' ? base + 5 : base - 161;
}

export function planNutricional(perfil: Perfil, pesoKg: number, grasaPct: number | null): PlanNutricional {
  const metabolismo = tmb(perfil, pesoKg);
  const gastoTotal = metabolismo * FACTOR_ACTIVIDAD[perfil.actividad];
  const objetivoKcal = gastoTotal * (1 + AJUSTE[perfil.objetivo]);
  // Suelo de seguridad: nunca por debajo del metabolismo basal ni de un minimo
  // razonable. Un deficit mas agresivo se come el musculo y no hay quien lo aguante.
  const suelo = Math.max(metabolismo * 1.05, perfil.sexo === 'mujer' ? 1300 : 1600);
  const calorias = Math.round(Math.max(objetivoKcal, suelo) / 10) * 10;

  // Con grasa corporal conocida ajustamos la proteina a la masa magra (mas preciso
  // cuando hay bastante grasa que perder).
  const magra = grasaPct !== null ? pesoKg * (1 - grasaPct / 100) : null;
  const proteinaG = Math.round(magra !== null ? magra * 2.4 : pesoKg * PROTEINA_G_KG[perfil.objetivo]);
  const grasaG = Math.round(Math.max(pesoKg * 0.8, (calorias * 0.22) / 9));
  const kcalRestantes = calorias - proteinaG * 4 - grasaG * 9;
  const carbosG = Math.max(50, Math.round(kcalRestantes / 4));

  const macros = [
    { nombre: 'Proteina', gramos: proteinaG, kcal: proteinaG * 4 },
    { nombre: 'Grasa', gramos: grasaG, kcal: grasaG * 9 },
    { nombre: 'Carbohidratos', gramos: carbosG, kcal: carbosG * 4 },
  ];
  const totalKcal = macros.reduce((a, m) => a + m.kcal, 0) || 1;

  return {
    tmb: Math.round(metabolismo),
    gastoTotal: Math.round(gastoTotal),
    calorias,
    proteinaG,
    grasaG,
    carbosG,
    aguaMl: Math.round((pesoKg * 35) / 100) * 100,
    pasos: perfil.objetivo === 'perder_grasa' ? 10000 : 8000,
    ritmoKgSemana: Number(((pesoKg * RITMO_PCT_SEMANA[perfil.objetivo]) / 100).toFixed(2)),
    desglose: macros.map((m) => ({ ...m, pct: Math.round((m.kcal / totalKcal) * 100) })),
  };
}

/**
 * Compara la tendencia real de peso con el ritmo objetivo y propone un ajuste.
 * Es la parte que convierte esto en un plan vivo en vez de una tabla fija.
 */
export function ajusteCalorico(
  plan: PlanNutricional,
  tendenciaKgSemana: number | null,
  objetivo: Objetivo,
): { estado: 'ok' | 'subir' | 'bajar' | 'sin_datos'; mensaje: string } {
  if (tendenciaKgSemana === null) {
    return {
      estado: 'sin_datos',
      mensaje: 'Apunta el peso al menos 2 veces por semana durante 2-3 semanas y aqui te dire si hay que tocar las calorias.',
    };
  }

  const objetivoRitmo = plan.ritmoKgSemana;
  const diferencia = tendenciaKgSemana - objetivoRitmo;
  const kg = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)} kg/semana`;

  if (objetivo === 'mantener') {
    if (Math.abs(tendenciaKgSemana) <= 0.2) {
      return { estado: 'ok', mensaje: `Peso estable (${kg(tendenciaKgSemana)}). Sigue igual.` };
    }
    return tendenciaKgSemana > 0
      ? { estado: 'bajar', mensaje: `Estas subiendo ${kg(tendenciaKgSemana)}. Baja ~200 kcal si no lo buscas.` }
      : { estado: 'subir', mensaje: `Estas bajando ${kg(tendenciaKgSemana)}. Sube ~200 kcal si no lo buscas.` };
  }

  const margen = Math.max(0.15, Math.abs(objetivoRitmo) * 0.4);
  if (Math.abs(diferencia) <= margen) {
    return { estado: 'ok', mensaje: `Vas a ${kg(tendenciaKgSemana)}, justo en el objetivo (${kg(objetivoRitmo)}). No toques nada.` };
  }
  if (diferencia > 0) {
    return objetivo === 'perder_grasa'
      ? { estado: 'bajar', mensaje: `Vas a ${kg(tendenciaKgSemana)} y el objetivo es ${kg(objetivoRitmo)}. Baja 150-200 kcal (o suma 2.000 pasos) y revisa en 2 semanas.` }
      : { estado: 'bajar', mensaje: `Subes mas rapido de lo ideal (${kg(tendenciaKgSemana)} vs ${kg(objetivoRitmo)}): mucho sera grasa. Baja 150 kcal.` };
  }
  return objetivo === 'perder_grasa'
    ? { estado: 'subir', mensaje: `Bajas mas rapido de lo ideal (${kg(tendenciaKgSemana)} vs ${kg(objetivoRitmo)}). Sube 150 kcal para no perder musculo.` }
    : { estado: 'subir', mensaje: `Vas a ${kg(tendenciaKgSemana)} y el objetivo es ${kg(objetivoRitmo)}. Sube 150-200 kcal y revisa en 2 semanas.` };
}
