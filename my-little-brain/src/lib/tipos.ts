/** Tipos del dominio. Los nombres siguen las columnas de Supabase. */

export type Sexo = 'hombre' | 'mujer';
export type Objetivo =
  | 'perder_grasa' | 'ganar_musculo' | 'recomposicion' | 'fuerza'
  | 'rendimiento' | 'energia' | 'salud_mental';
export type Nivel = 'principiante' | 'intermedio' | 'avanzado';
export type Entorno = 'gimnasio' | 'casa_mancuernas' | 'casa_sin_material';
export type Actividad = 'sedentario' | 'ligera' | 'moderada' | 'alta';
export type Limitacion = 'hombro' | 'rodilla' | 'espalda_baja' | 'muneca' | 'cadera';
export type Plan = 'free' | 'pro' | 'founder';
export type CategoriaFoco = 'deep_work' | 'negocio' | 'aprendizaje' | 'idiomas' | 'lectura' | 'otro';
export type AreaObjetivo = 'cuerpo' | 'fitness' | 'productividad' | 'aprendizaje' | 'mente' | 'negocio';

export interface Perfil {
  id: string;
  email: string | null;
  nombre: string | null;
  sexo: Sexo | null;
  edad: number | null;
  altura_cm: number | null;
  ocupacion: string | null;
  objetivo: Objetivo | null;
  objetivos_extra: string[];
  nivel: Nivel | null;
  dias_semana: number | null;
  entorno: Entorno | null;
  actividad: Actividad | null;
  limitaciones: string[];
  alergias: string[];
  preferencias_comida: string | null;
  horario_comidas: string | null;
  alcohol_semanal: number | null;
  hora_dormir: string | null;
  hora_despertar: string | null;
  zona_horaria: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  onboarding: boolean;
  notas: string | null;
  creado: string;
  actualizado: string;
}

export interface MetricaCorporal {
  id: string;
  fecha: string;
  peso_kg: number | null;
  cuello_cm: number | null;
  pecho_cm: number | null;
  cintura_cm: number | null;
  cadera_cm: number | null;
  brazo_cm: number | null;
  muslo_cm: number | null;
  notas: string | null;
}

export interface Comida {
  id: string;
  fecha: string;
  momento: 'desayuno' | 'comida' | 'cena' | 'snack' | 'bebida' | null;
  descripcion: string;
  kcal: number | null;
  proteina_g: number | null;
  carbos_g: number | null;
  grasa_g: number | null;
  alcohol_ud: number;
  foto_path: string | null;
  fuente: 'chat' | 'foto' | 'manual';
  confianza: 'alta' | 'media' | 'baja' | null;
  creado: string;
}

export interface Entrenamiento {
  id: string;
  fecha: string;
  dia_plan: string | null;
  nombre: string;
  sensacion: number | null;
  duracion_min: number | null;
  notas: string | null;
  completado: boolean;
}

export interface SerieRegistro {
  id: string;
  entrenamiento_id: string;
  ejercicio_id: string;
  ejercicio_nombre: string;
  orden: number;
  serie: number;
  peso_kg: number | null;
  reps: number | null;
  rir: number | null;
  hecha: boolean;
}

export interface Foco {
  id: string;
  fecha: string;
  categoria: CategoriaFoco;
  minutos: number;
  descripcion: string | null;
}

export interface Tarea {
  id: string;
  titulo: string;
  area: string | null;
  prioridad: number;
  fecha: string | null;
  completada: boolean;
}

export interface Habito {
  id: string;
  nombre: string;
  emoji: string;
  veces_por_semana: number;
  activo: boolean;
}

export interface HabitoRegistro {
  id: string;
  habito_id: string;
  fecha: string;
  hecho: boolean;
}

export interface Bienestar {
  id: string;
  fecha: string;
  animo: number | null;
  energia: number | null;
  estres: number | null;
  ansiedad: number | null;
  motivacion: number | null;
  sueno_horas: number | null;
  sueno_calidad: number | null;
  pasos: number | null;
  notas: string | null;
}

export interface ObjetivoRegistro {
  id: string;
  area: AreaObjetivo;
  titulo: string;
  detalle: string | null;
  metrica: string | null;
  valor_objetivo: number | null;
  fecha_limite: string | null;
  estado: 'activo' | 'conseguido' | 'pausado' | 'abandonado';
}

export interface RecuerdoCoach {
  id: string;
  clave: string;
  valor: string;
  categoria: string;
  actualizado: string;
}

export interface MensajeChat {
  id: string;
  rol: 'user' | 'assistant';
  texto: string;
  acciones: AccionRegistrada[];
  creado: string;
}

/** Lo que el coach ha apuntado en un mensaje, para enseñarlo en el chat. */
export interface AccionRegistrada {
  herramienta: string;
  resumen: string;
  xp?: number;
}

export interface RevisionSemanal {
  titular: string;
  cuerpo: string;
  nutricion: string;
  entrenamiento: string;
  productividad: string;
  habitos: string;
  animo: string;
  cuello_botella: string;
  victorias: string[];
  errores: string[];
  acciones: string[];
}
