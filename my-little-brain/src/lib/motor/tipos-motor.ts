import type { Actividad, Entorno, Limitacion, Nivel, Sexo } from '../tipos';

export type Patron =
  | 'empuje_horizontal' | 'empuje_vertical' | 'traccion_horizontal' | 'traccion_vertical'
  | 'dominante_rodilla' | 'dominante_cadera' | 'core' | 'hombro' | 'biceps' | 'triceps'
  | 'gemelo' | 'gluteo';

export type Rol = 'principal' | 'secundario' | 'accesorio';

/** Objetivos tal y como los entiende el motor de entrenamiento. */
export type ObjetivoEntreno = 'perder_grasa' | 'ganar_musculo' | 'mantener' | 'fuerza';

export interface Ejercicio {
  id: string;
  nombre: string;
  patron: Patron;
  musculos: string[];
  entornos: Entorno[];
  nivel: Nivel;
  basico: boolean;
  incremento: number;
  unilateral: boolean;
  evitarSi: Limitacion[];
  tecnica: string;
}

/** Vista normalizada del perfil con lo que necesita el motor. */
export interface PerfilEntreno {
  sexo: Sexo;
  edad: number;
  alturaCm: number;
  objetivo: ObjetivoEntreno;
  nivel: Nivel;
  diasPorSemana: number;
  entorno: Entorno;
  actividad: Actividad;
  limitaciones: Limitacion[];
}

export interface Bloque {
  ejercicioId: string;
  /** Nombre para ejercicios propios que no estan en el catalogo (id libre_…). */
  nombreLibre?: string;
  rol: Rol;
  series: number;
  repMin: number;
  repMax: number;
  rir: number;
  descansoSeg: number;
}

export interface DiaPlan {
  id: string;
  nombre: string;
  foco: string;
  bloques: Bloque[];
  cardio: string | null;
}

export interface PlanEntreno {
  generadoEl: string;
  firma: string;
  dias: DiaPlan[];
  notas: string[];
}

export interface Serie {
  pesoKg: number | null;
  reps: number | null;
  rir: number | null;
  hecha: boolean;
}

export interface EjercicioSesion {
  ejercicioId: string;
  series: Serie[];
}

/** Sesion en el formato que entiende el motor de progresion. */
export interface Sesion {
  id: string;
  fecha: string;
  diaId: string;
  nombre: string;
  ejercicios: EjercicioSesion[];
  completada: boolean;
}
