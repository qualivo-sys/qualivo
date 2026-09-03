import type { DatosNutricion, ObjetivosDiarios } from './motor/nutricion';
import { objetivosDiarios } from './motor/nutricion';
import type { ObjetivoEntreno, PerfilEntreno } from './motor/tipos-motor';
import type { Limitacion, Objetivo, Perfil } from './tipos';

const LIMITACIONES_VALIDAS: Limitacion[] = ['hombro', 'rodilla', 'espalda_baja', 'muneca', 'cadera'];

/** Los 7 objetivos del perfil se reducen a los 4 que entiende el motor de entreno. */
export function objetivoEntrenoDe(objetivo: Objetivo): ObjetivoEntreno {
  switch (objetivo) {
    case 'perder_grasa':
      return 'perder_grasa';
    case 'ganar_musculo':
    case 'recomposicion':
      return 'ganar_musculo';
    case 'fuerza':
    case 'rendimiento':
      return 'fuerza';
    default:
      return 'mantener';
  }
}

/** Vista del perfil para el motor de entrenamiento, o null si faltan datos. */
export function perfilEntreno(p: Perfil): PerfilEntreno | null {
  if (!p.sexo || !p.edad || !p.altura_cm || !p.objetivo || !p.nivel || !p.dias_semana || !p.entorno) {
    return null;
  }
  return {
    sexo: p.sexo,
    edad: p.edad,
    alturaCm: p.altura_cm,
    objetivo: objetivoEntrenoDe(p.objetivo),
    nivel: p.nivel,
    diasPorSemana: p.dias_semana,
    entorno: p.entorno,
    actividad: p.actividad ?? 'ligera',
    limitaciones: p.limitaciones.filter((l): l is Limitacion =>
      LIMITACIONES_VALIDAS.includes(l as Limitacion),
    ),
  };
}

/**
 * Objetivos diarios de calorias y macros. Si hay objetivos manuales (dieta de un
 * especialista o fijados a mano) mandan ellos; si no, se calculan. Null si falta
 * peso o datos basicos y no hay manuales.
 */
export function metasNutricion(
  p: Perfil,
  pesoKg: number | null,
  grasaPct: number | null,
): ObjetivosDiarios | null {
  const manual = p.objetivos_manual;
  if (manual && manual.kcal > 0) {
    const peso = pesoKg ?? 75;
    return {
      tmb: 0,
      gastoTotal: 0,
      kcal: Math.round(manual.kcal),
      proteinaG: Math.round(manual.proteina_g),
      grasaG: Math.round(manual.grasa_g),
      carbosG: Math.round(manual.carbos_g),
      aguaMl: Math.round((peso * 35) / 100) * 100,
      pasos: p.objetivo === 'perder_grasa' ? 10000 : 8000,
      ritmoKgSemana: 0,
      manual: manual.fuente,
    };
  }
  if (!p.sexo || !p.edad || !p.altura_cm || !p.objetivo || !pesoKg) return null;
  const datos: DatosNutricion = {
    sexo: p.sexo,
    edad: p.edad,
    alturaCm: p.altura_cm,
    actividad: p.actividad ?? 'ligera',
    objetivo: p.objetivo,
    pesoKg,
    grasaPct,
  };
  return objetivosDiarios(datos);
}

export function perfilCompleto(p: Perfil): boolean {
  return Boolean(p.onboarding && perfilEntreno(p));
}

export const ETIQUETA_OBJETIVO: Record<Objetivo, string> = {
  perder_grasa: 'Perder grasa',
  ganar_musculo: 'Ganar musculo',
  recomposicion: 'Recomposicion',
  fuerza: 'Ganar fuerza',
  rendimiento: 'Rendimiento',
  energia: 'Mas energia',
  salud_mental: 'Salud mental',
};

export const ETIQUETA_CATEGORIA_FOCO: Record<string, string> = {
  deep_work: 'Trabajo profundo',
  negocio: 'Negocio',
  aprendizaje: 'Aprendizaje',
  idiomas: 'Idiomas',
  lectura: 'Lectura',
  otro: 'Otro',
};
