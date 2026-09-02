/** Modelo de datos de la app. Todo se guarda por perfil en un unico documento. */

export type Sexo = 'hombre' | 'mujer';
export type Objetivo = 'perder_grasa' | 'ganar_musculo' | 'mantener' | 'fuerza';
export type Nivel = 'principiante' | 'intermedio' | 'avanzado';
export type Entorno = 'gimnasio' | 'casa_mancuernas' | 'casa_sin_material';
export type Actividad = 'sedentario' | 'ligera' | 'moderada' | 'alta';
export type Limitacion = 'hombro' | 'rodilla' | 'espalda_baja' | 'muneca' | 'cadera';

export type Patron =
  | 'empuje_horizontal'
  | 'empuje_vertical'
  | 'traccion_horizontal'
  | 'traccion_vertical'
  | 'dominante_rodilla'
  | 'dominante_cadera'
  | 'core'
  | 'hombro'
  | 'biceps'
  | 'triceps'
  | 'gemelo'
  | 'gluteo';

export type Rol = 'principal' | 'secundario' | 'accesorio';

export interface Ejercicio {
  id: string;
  nombre: string;
  patron: Patron;
  musculos: string[];
  entornos: Entorno[];
  /** Nivel minimo recomendado para incluirlo en el plan. */
  nivel: Nivel;
  /** Basico = multiarticular pesado, candidato a ejercicio principal del dia. */
  basico: boolean;
  /** Salto de carga razonable al progresar, en kg. */
  incremento: number;
  unilateral: boolean;
  /** Se descarta si el perfil marca alguna de estas limitaciones. */
  evitarSi: Limitacion[];
  tecnica: string;
}

export interface Perfil {
  id: string;
  nombre: string;
  sexo: Sexo;
  edad: number;
  alturaCm: number;
  objetivo: Objetivo;
  nivel: Nivel;
  diasPorSemana: number;
  entorno: Entorno;
  actividad: Actividad;
  limitaciones: Limitacion[];
  notas: string;
  actualizado: string;
}

export interface Medicion {
  id: string;
  fecha: string; // YYYY-MM-DD
  pesoKg: number;
  cuelloCm?: number | null;
  pechoCm?: number | null;
  cinturaCm?: number | null;
  caderaCm?: number | null;
  brazoCm?: number | null;
  musloCm?: number | null;
  notas?: string;
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
  notas?: string;
}

export interface Sesion {
  id: string;
  fecha: string; // YYYY-MM-DD
  diaId: string;
  nombre: string;
  ejercicios: EjercicioSesion[];
  sensacion: number | null; // 1-5
  notas?: string;
  completada: boolean;
}

export interface Bloque {
  ejercicioId: string;
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

export interface Plan {
  generadoEl: string;
  /** Huella de los datos del perfil con los que se genero (para avisar si cambian). */
  firma: string;
  dias: DiaPlan[];
  notas: string[];
}

export interface Estado {
  version: number;
  perfil: Perfil;
  mediciones: Medicion[];
  sesiones: Sesion[];
  plan: Plan | null;
}

export type ModoAlmacenamiento = 'nube' | 'local';
