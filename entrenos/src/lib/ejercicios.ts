import type { Ejercicio, Entorno, Limitacion, Nivel, Patron } from './types';

const GYM: Entorno[] = ['gimnasio'];
const GYM_MANC: Entorno[] = ['gimnasio', 'casa_mancuernas'];
const TODOS: Entorno[] = ['gimnasio', 'casa_mancuernas', 'casa_sin_material'];

function mk(
  id: string,
  nombre: string,
  patron: Patron,
  musculos: string[],
  entornos: Entorno[],
  opciones: {
    nivel?: Nivel;
    basico?: boolean;
    incremento?: number;
    unilateral?: boolean;
    evitarSi?: Limitacion[];
    tecnica: string;
  },
): Ejercicio {
  return {
    id,
    nombre,
    patron,
    musculos,
    entornos,
    nivel: opciones.nivel ?? 'principiante',
    basico: opciones.basico ?? false,
    incremento: opciones.incremento ?? 2,
    unilateral: opciones.unilateral ?? false,
    evitarSi: opciones.evitarSi ?? [],
    tecnica: opciones.tecnica,
  };
}

/**
 * Catalogo de ejercicios. El orden dentro de cada patron importa: el generador
 * prefiere los primeros, asi que los mas completos van arriba.
 */
export const EJERCICIOS: Ejercicio[] = [
  // ── Empuje horizontal ──────────────────────────────────────
  mk('press_banca', 'Press de banca con barra', 'empuje_horizontal', ['pecho', 'triceps', 'hombro'], GYM, {
    basico: true, incremento: 2.5, nivel: 'principiante',
    tecnica: 'Escapulas retraidas y pies clavados. Baja a la linea del pezon tocando el pecho sin rebotar.',
  }),
  mk('press_banca_inclinado_mancuernas', 'Press inclinado con mancuernas', 'empuje_horizontal', ['pecho superior', 'hombro', 'triceps'], GYM_MANC, {
    basico: true, incremento: 2,
    tecnica: 'Banco a 30°. Codos a 45° del torso, no abiertos del todo. Baja hasta notar estiramiento en el pecho.',
  }),
  mk('press_banca_mancuernas', 'Press de banca con mancuernas', 'empuje_horizontal', ['pecho', 'triceps'], GYM_MANC, {
    basico: true, incremento: 2,
    tecnica: 'Recorrido mas amplio que con barra y mas amable con el hombro. Muneca alineada con el antebrazo.',
  }),
  mk('fondos_paralelas', 'Fondos en paralelas', 'empuje_horizontal', ['pecho inferior', 'triceps'], GYM, {
    basico: true, incremento: 2.5, nivel: 'intermedio', evitarSi: ['hombro'],
    tecnica: 'Torso ligeramente inclinado adelante. Baja hasta que el brazo forme 90° y no mas.',
  }),
  mk('flexiones', 'Flexiones', 'empuje_horizontal', ['pecho', 'triceps', 'core'], TODOS, {
    basico: true, incremento: 0,
    tecnica: 'Cuerpo en linea recta, gluteo apretado. Si son faciles, elevalas los pies o frena 3 s la bajada.',
  }),
  mk('press_maquina_pecho', 'Press de pecho en maquina', 'empuje_horizontal', ['pecho', 'triceps'], GYM, {
    incremento: 5,
    tecnica: 'Ideal para acumular series sin fatiga tecnica. Controla 2 s la vuelta.',
  }),
  mk('aperturas_polea', 'Cruces en polea', 'empuje_horizontal', ['pecho'], GYM, {
    incremento: 2.5,
    tecnica: 'Codo semiflexionado y fijo. Junta las manos por delante del pecho, no de la cara.',
  }),
  mk('aperturas_mancuernas', 'Aperturas con mancuernas', 'empuje_horizontal', ['pecho'], GYM_MANC, {
    incremento: 1, evitarSi: ['hombro'],
    tecnica: 'Peso moderado. Abre hasta sentir estiramiento, sin pasar la linea del hombro.',
  }),

  // ── Empuje vertical ────────────────────────────────────────
  mk('press_militar_barra', 'Press militar con barra', 'empuje_vertical', ['hombro', 'triceps'], GYM, {
    basico: true, incremento: 2.5, nivel: 'intermedio', evitarSi: ['hombro'],
    tecnica: 'De pie, gluteo y abdomen apretados. Mete la cabeza al pasar la barra por la frente.',
  }),
  mk('press_hombro_mancuernas', 'Press de hombro con mancuernas', 'empuje_vertical', ['hombro', 'triceps'], GYM_MANC, {
    basico: true, incremento: 2,
    tecnica: 'Sentado con respaldo. Codos ligeramente adelantados, no en cruz.',
  }),
  mk('press_arnold', 'Press Arnold', 'empuje_vertical', ['hombro'], GYM_MANC, {
    incremento: 1, nivel: 'intermedio',
    tecnica: 'Rota de palmas hacia ti a palmas al frente mientras subes. Peso ligero.',
  }),
  mk('flexiones_pica', 'Flexiones en pica', 'empuje_vertical', ['hombro', 'triceps'], TODOS, {
    incremento: 0, nivel: 'intermedio',
    tecnica: 'Cadera alta formando una V. La cabeza baja por delante de las manos.',
  }),
  mk('press_maquina_hombro', 'Press de hombro en maquina', 'empuje_vertical', ['hombro'], GYM, {
    incremento: 5,
    tecnica: 'Ajusta el asiento para que las manos queden a la altura de las orejas.',
  }),

  // ── Traccion horizontal ────────────────────────────────────
  mk('remo_barra', 'Remo con barra', 'traccion_horizontal', ['dorsal', 'trapecio', 'biceps'], GYM, {
    basico: true, incremento: 2.5, nivel: 'intermedio', evitarSi: ['espalda_baja'],
    tecnica: 'Cadera atras, espalda neutra a 45°. Lleva la barra al ombligo, sin tirones de lumbar.',
  }),
  mk('remo_mancuerna', 'Remo con mancuerna a una mano', 'traccion_horizontal', ['dorsal', 'biceps'], GYM_MANC, {
    basico: true, incremento: 2, unilateral: true,
    tecnica: 'Apoya rodilla y mano en el banco. Tira con el codo pegado, llevando la mancuerna a la cadera.',
  }),
  mk('remo_polea', 'Remo en polea baja', 'traccion_horizontal', ['dorsal', 'trapecio', 'biceps'], GYM, {
    incremento: 5,
    tecnica: 'Pecho arriba, sin balancear el torso. Junta las escapulas al final del tiron.',
  }),
  mk('remo_maquina', 'Remo en maquina', 'traccion_horizontal', ['dorsal', 'biceps'], GYM, {
    incremento: 5,
    tecnica: 'Pecho apoyado: quita la lumbar de la ecuacion. Perfecto si arrastras molestias de espalda.',
  }),
  mk('remo_invertido', 'Remo invertido', 'traccion_horizontal', ['dorsal', 'biceps', 'core'], TODOS, {
    basico: true, incremento: 0,
    tecnica: 'Barra a la altura de la cadera o una mesa solida. Cuanto mas horizontal el cuerpo, mas dificil.',
  }),

  // ── Traccion vertical ──────────────────────────────────────
  mk('dominadas', 'Dominadas', 'traccion_vertical', ['dorsal', 'biceps'], TODOS, {
    basico: true, incremento: 2.5, nivel: 'intermedio',
    tecnica: 'Barra fija o de puerta. Si no llegas a las reps, hazlas negativas de 4 s o con goma.',
  }),
  mk('jalon_polea', 'Jalon al pecho', 'traccion_vertical', ['dorsal', 'biceps'], GYM, {
    basico: true, incremento: 5,
    tecnica: 'Agarre algo mas ancho que los hombros. Lleva la barra al pecho, no a la nuca.',
  }),
  mk('dominadas_asistidas', 'Dominadas asistidas en maquina', 'traccion_vertical', ['dorsal', 'biceps'], GYM, {
    incremento: 5,
    tecnica: 'Baja la asistencia poco a poco: es tu puente hacia la dominada libre.',
  }),
  mk('pullover_mancuerna', 'Pullover con mancuerna', 'traccion_vertical', ['dorsal', 'pecho'], GYM_MANC, {
    incremento: 2, evitarSi: ['hombro'],
    tecnica: 'Tumbado, brazos casi rectos. Lleva la mancuerna por detras de la cabeza sin arquear la lumbar.',
  }),

  // ── Dominante de rodilla ───────────────────────────────────
  mk('sentadilla_barra', 'Sentadilla con barra', 'dominante_rodilla', ['cuadriceps', 'gluteo', 'core'], GYM, {
    basico: true, incremento: 5, nivel: 'intermedio', evitarSi: ['espalda_baja'],
    tecnica: 'Pies a la anchura de los hombros. Baja hasta que la cadera pase la rodilla manteniendo el pecho arriba.',
  }),
  mk('sentadilla_goblet', 'Sentadilla goblet', 'dominante_rodilla', ['cuadriceps', 'gluteo'], GYM_MANC, {
    basico: true, incremento: 2,
    tecnica: 'Mancuerna pegada al pecho. Es la mejor forma de aprender el patron de sentadilla.',
  }),
  mk('prensa_piernas', 'Prensa de piernas', 'dominante_rodilla', ['cuadriceps', 'gluteo'], GYM, {
    basico: true, incremento: 10, evitarSi: ['rodilla'],
    tecnica: 'No bloquees la rodilla arriba ni despegues la lumbar del respaldo abajo.',
  }),
  mk('sentadilla_bulgara', 'Sentadilla bulgara', 'dominante_rodilla', ['cuadriceps', 'gluteo'], TODOS, {
    incremento: 2, unilateral: true, nivel: 'intermedio',
    tecnica: 'Pie de atras en un banco. Da un paso largo para repartir mas al gluteo.',
  }),
  mk('zancadas', 'Zancadas', 'dominante_rodilla', ['cuadriceps', 'gluteo'], TODOS, {
    incremento: 2, unilateral: true, evitarSi: ['rodilla'],
    tecnica: 'Paso largo y torso erguido. Baja la rodilla de atras casi al suelo.',
  }),
  mk('sentadilla_peso_corporal', 'Sentadilla sin peso', 'dominante_rodilla', ['cuadriceps', 'gluteo'], TODOS, {
    incremento: 0,
    tecnica: 'Sube el reto haciendola lenta (3 s bajando) o con pausa de 2 s abajo.',
  }),
  mk('step_up', 'Subidas al cajon', 'dominante_rodilla', ['cuadriceps', 'gluteo'], TODOS, {
    incremento: 2, unilateral: true,
    tecnica: 'Cajon a la altura de la rodilla. Sube empujando con el talon, sin impulso de la pierna de abajo.',
  }),
  mk('extension_cuadriceps', 'Extension de cuadriceps', 'dominante_rodilla', ['cuadriceps'], GYM, {
    incremento: 5, evitarSi: ['rodilla'],
    tecnica: 'Aprieta 1 s arriba. Sirve para rematar el cuadriceps sin cargar la espalda.',
  }),

  // ── Dominante de cadera ────────────────────────────────────
  mk('peso_muerto', 'Peso muerto convencional', 'dominante_cadera', ['isquios', 'gluteo', 'espalda'], GYM, {
    basico: true, incremento: 5, nivel: 'intermedio', evitarSi: ['espalda_baja'],
    tecnica: 'Barra pegada a la pierna, espalda neutra. Empuja el suelo, no tires con la espalda.',
  }),
  mk('peso_muerto_rumano', 'Peso muerto rumano', 'dominante_cadera', ['isquios', 'gluteo'], GYM_MANC, {
    basico: true, incremento: 2.5,
    tecnica: 'Rodilla casi fija, lleva la cadera atras. Baja hasta media espinilla notando el isquio.',
  }),
  mk('hip_thrust', 'Hip thrust', 'dominante_cadera', ['gluteo', 'isquios'], GYM_MANC, {
    basico: true, incremento: 5,
    tecnica: 'Espalda apoyada en el banco, barbilla al pecho. Aprieta el gluteo 1 s arriba.',
  }),
  mk('curl_femoral', 'Curl femoral tumbado', 'dominante_cadera', ['isquios'], GYM, {
    incremento: 5,
    tecnica: 'Sin despegar la cadera. Baja el peso en 3 s.',
  }),
  mk('peso_muerto_una_pierna', 'Peso muerto a una pierna', 'dominante_cadera', ['isquios', 'gluteo', 'core'], TODOS, {
    incremento: 2, unilateral: true, nivel: 'intermedio',
    tecnica: 'Cadera cuadrada al suelo. Trabaja mucho el equilibrio: empieza sin peso.',
  }),
  mk('puente_gluteo', 'Puente de gluteo', 'dominante_cadera', ['gluteo'], TODOS, {
    incremento: 0,
    tecnica: 'Talones cerca del gluteo. Sube hasta formar linea recta rodilla-cadera-hombro.',
  }),
  mk('buenos_dias', 'Buenos dias', 'dominante_cadera', ['isquios', 'lumbar'], GYM, {
    incremento: 2.5, nivel: 'avanzado', evitarSi: ['espalda_baja'],
    tecnica: 'Peso ligero y espalda neutra. Es un ejercicio tecnico, no de cargar.',
  }),

  // ── Core ───────────────────────────────────────────────────
  mk('plancha', 'Plancha', 'core', ['core'], TODOS, {
    incremento: 0,
    tecnica: 'Costillas abajo y gluteo apretado. Mejor 30 s perfectos que 2 min con la cadera caida.',
  }),
  mk('plancha_lateral', 'Plancha lateral', 'core', ['oblicuos', 'core'], TODOS, {
    incremento: 0, unilateral: true,
    tecnica: 'Cadera bien alta, cuerpo en linea. Aguanta el mismo tiempo por lado.',
  }),
  mk('rueda_abdominal', 'Rueda abdominal', 'core', ['core'], GYM_MANC, {
    incremento: 0, nivel: 'intermedio', evitarSi: ['espalda_baja'],
    tecnica: 'Empieza de rodillas y llega solo hasta donde puedas mantener la lumbar sin arquear.',
  }),
  mk('elevacion_piernas_colgado', 'Elevacion de piernas colgado', 'core', ['core'], GYM, {
    incremento: 0, nivel: 'intermedio',
    tecnica: 'Sin balanceo. Enrolla la pelvis hacia arriba, no solo subas las piernas.',
  }),
  mk('crunch_polea', 'Crunch en polea', 'core', ['core'], GYM, {
    incremento: 2.5,
    tecnica: 'De rodillas, redondea la espalda alta acercando codos a rodillas.',
  }),
  mk('pallof_press', 'Pallof press', 'core', ['core', 'oblicuos'], GYM, {
    incremento: 2.5, unilateral: true,
    tecnica: 'Antirotacion: resiste el giro de la polea mientras estiras los brazos.',
  }),
  mk('hollow_hold', 'Hollow hold', 'core', ['core'], TODOS, {
    incremento: 0, nivel: 'intermedio',
    tecnica: 'Lumbar pegada al suelo. Si se despega, sube mas los brazos y las piernas.',
  }),

  // ── Hombro ─────────────────────────────────────────────────
  mk('elevaciones_laterales', 'Elevaciones laterales', 'hombro', ['deltoides lateral'], GYM_MANC, {
    incremento: 1,
    tecnica: 'Peso ligero, sube hasta la altura del hombro guiando con el codo. Nada de impulso.',
  }),
  mk('face_pull', 'Face pull', 'hombro', ['deltoides posterior', 'trapecio'], GYM, {
    incremento: 2.5,
    tecnica: 'Cuerda a la altura de la cara. Separa las manos al final. Oro para la salud del hombro.',
  }),
  mk('pajaro', 'Pajaro con mancuernas', 'hombro', ['deltoides posterior'], GYM_MANC, {
    incremento: 1,
    tecnica: 'Torso a 45°, codos semiflexionados. Abre pensando en los omoplatos.',
  }),

  // ── Biceps ─────────────────────────────────────────────────
  mk('curl_barra', 'Curl con barra', 'biceps', ['biceps'], GYM, {
    incremento: 2.5,
    tecnica: 'Codos pegados al costado. Sin balancear la espalda.',
  }),
  mk('curl_mancuernas', 'Curl con mancuernas', 'biceps', ['biceps'], GYM_MANC, {
    incremento: 1,
    tecnica: 'Supina la muneca al subir. Baja en 2-3 s.',
  }),
  mk('curl_martillo', 'Curl martillo', 'biceps', ['biceps', 'braquial'], GYM_MANC, {
    incremento: 1,
    tecnica: 'Agarre neutro. Es el que mas engrosa el brazo por fuera.',
  }),

  // ── Triceps ────────────────────────────────────────────────
  mk('extension_polea', 'Extension de triceps en polea', 'triceps', ['triceps'], GYM, {
    incremento: 2.5,
    tecnica: 'Codos quietos junto al cuerpo. Solo se mueve el antebrazo.',
  }),
  mk('press_frances', 'Press frances', 'triceps', ['triceps'], GYM_MANC, {
    incremento: 2, evitarSi: ['muneca'],
    tecnica: 'Baja hacia la frente controlando. Si molesta el codo, cambia a polea.',
  }),
  mk('fondos_banco', 'Fondos en banco', 'triceps', ['triceps'], TODOS, {
    incremento: 0, evitarSi: ['hombro'],
    tecnica: 'Cadera pegada al banco. Baja hasta 90° de codo, no mas.',
  }),
  mk('patada_triceps', 'Patada de triceps', 'triceps', ['triceps'], GYM_MANC, {
    incremento: 1, unilateral: true,
    tecnica: 'Brazo paralelo al suelo, extiende y aprieta 1 s.',
  }),

  // ── Gemelo ─────────────────────────────────────────────────
  mk('elevacion_talones', 'Elevacion de talones de pie', 'gemelo', ['gemelo'], TODOS, {
    incremento: 2.5,
    tecnica: 'Rango completo: estira abajo 2 s y aprieta arriba 1 s.',
  }),
  mk('elevacion_talones_sentado', 'Elevacion de talones sentado', 'gemelo', ['soleo'], GYM, {
    incremento: 2.5,
    tecnica: 'Con la rodilla flexionada trabaja mas el soleo. Reps altas.',
  }),

  // ── Gluteo ─────────────────────────────────────────────────
  mk('patada_gluteo_polea', 'Patada de gluteo en polea', 'gluteo', ['gluteo'], GYM, {
    incremento: 2.5, unilateral: true,
    tecnica: 'Sin arquear la lumbar: el movimiento sale de la cadera.',
  }),
  mk('abduccion_cadera', 'Abductores en maquina', 'gluteo', ['gluteo medio'], GYM, {
    incremento: 5,
    tecnica: 'Inclina un poco el torso adelante para incidir mas en el gluteo medio.',
  }),
  mk('puente_gluteo_una_pierna', 'Puente de gluteo a una pierna', 'gluteo', ['gluteo'], TODOS, {
    incremento: 0, unilateral: true,
    tecnica: 'Cadera nivelada. Pausa de 1 s arriba en cada repeticion.',
  }),
];

const POR_ID = new Map(EJERCICIOS.map((e) => [e.id, e]));

export function ejercicio(id: string): Ejercicio | undefined {
  return POR_ID.get(id);
}

export function nombreEjercicio(id: string): string {
  return POR_ID.get(id)?.nombre ?? id;
}

/** Ejercicios del mismo patron validos para el perfil, para poder sustituir uno. */
export function alternativas(id: string, entorno: Entorno, limitaciones: Limitacion[]): Ejercicio[] {
  const base = POR_ID.get(id);
  if (!base) return [];
  return EJERCICIOS.filter(
    (e) =>
      e.patron === base.patron &&
      e.entornos.includes(entorno) &&
      !e.evitarSi.some((l) => limitaciones.includes(l)),
  );
}
