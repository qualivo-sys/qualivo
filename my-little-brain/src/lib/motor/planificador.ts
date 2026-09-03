import { EJERCICIOS, ejercicio } from './ejercicios';
import type { Bloque, DiaPlan, Ejercicio, ObjetivoEntreno, Patron, PerfilEntreno, PlanEntreno, Rol } from './tipos-motor';
import type { Nivel } from '../tipos';

interface Hueco {
  patron: Patron;
  rol: Rol;
}

interface Plantilla {
  id: string;
  nombre: string;
  foco: string;
  huecos: Hueco[];
}

const h = (patron: Patron, rol: Rol): Hueco => ({ patron, rol });

const FULL_A: Plantilla = {
  id: 'fb_a', nombre: 'Full body A', foco: 'Pierna + empuje',
  huecos: [h('dominante_rodilla', 'principal'), h('empuje_horizontal', 'secundario'), h('traccion_horizontal', 'secundario'), h('dominante_cadera', 'accesorio'), h('core', 'accesorio')],
};
const FULL_B: Plantilla = {
  id: 'fb_b', nombre: 'Full body B', foco: 'Cadera + vertical',
  huecos: [h('dominante_cadera', 'principal'), h('empuje_vertical', 'secundario'), h('traccion_vertical', 'secundario'), h('dominante_rodilla', 'accesorio'), h('core', 'accesorio')],
};
const FULL_C: Plantilla = {
  id: 'fb_c', nombre: 'Full body C', foco: 'Torso + gluteo',
  huecos: [h('empuje_horizontal', 'principal'), h('traccion_horizontal', 'secundario'), h('dominante_rodilla', 'secundario'), h('gluteo', 'accesorio'), h('hombro', 'accesorio')],
};
const TORSO_A: Plantilla = {
  id: 'torso_a', nombre: 'Torso A', foco: 'Pecho y espalda',
  huecos: [h('empuje_horizontal', 'principal'), h('traccion_vertical', 'principal'), h('empuje_vertical', 'secundario'), h('traccion_horizontal', 'secundario'), h('hombro', 'accesorio'), h('triceps', 'accesorio')],
};
const TORSO_B: Plantilla = {
  id: 'torso_b', nombre: 'Torso B', foco: 'Hombro y dorsal',
  huecos: [h('empuje_vertical', 'principal'), h('traccion_horizontal', 'principal'), h('empuje_horizontal', 'secundario'), h('traccion_vertical', 'secundario'), h('biceps', 'accesorio'), h('hombro', 'accesorio')],
};
const PIERNA_A: Plantilla = {
  id: 'pierna_a', nombre: 'Pierna A', foco: 'Cuadriceps',
  huecos: [h('dominante_rodilla', 'principal'), h('dominante_cadera', 'secundario'), h('dominante_rodilla', 'accesorio'), h('gemelo', 'accesorio'), h('core', 'accesorio')],
};
const PIERNA_B: Plantilla = {
  id: 'pierna_b', nombre: 'Pierna B', foco: 'Isquios y gluteo',
  huecos: [h('dominante_cadera', 'principal'), h('dominante_rodilla', 'secundario'), h('gluteo', 'accesorio'), h('gemelo', 'accesorio'), h('core', 'accesorio')],
};
const EMPUJE: Plantilla = {
  id: 'empuje', nombre: 'Empuje', foco: 'Pecho, hombro y triceps',
  huecos: [h('empuje_horizontal', 'principal'), h('empuje_vertical', 'secundario'), h('empuje_horizontal', 'secundario'), h('hombro', 'accesorio'), h('triceps', 'accesorio')],
};
const TIRON: Plantilla = {
  id: 'tiron', nombre: 'Tiron', foco: 'Espalda y biceps',
  huecos: [h('traccion_vertical', 'principal'), h('traccion_horizontal', 'secundario'), h('traccion_horizontal', 'accesorio'), h('hombro', 'accesorio'), h('biceps', 'accesorio')],
};
const TORSO_COMPLETO: Plantilla = {
  id: 'torso_c', nombre: 'Torso completo', foco: 'Empuje + tiron',
  huecos: [h('empuje_horizontal', 'principal'), h('traccion_horizontal', 'principal'), h('empuje_vertical', 'secundario'), h('traccion_vertical', 'secundario'), h('core', 'accesorio')],
};

/** Reparto semanal segun los dias disponibles. */
function plantillas(dias: number): Plantilla[] {
  switch (Math.max(2, Math.min(6, dias))) {
    case 2: return [FULL_A, FULL_B];
    case 3: return [FULL_A, FULL_B, FULL_C];
    case 4: return [TORSO_A, PIERNA_A, TORSO_B, PIERNA_B];
    case 5: return [EMPUJE, TIRON, PIERNA_A, TORSO_COMPLETO, PIERNA_B];
    default: return [EMPUJE, TIRON, PIERNA_A, { ...EMPUJE, id: 'empuje_b', nombre: 'Empuje B' }, { ...TIRON, id: 'tiron_b', nombre: 'Tiron B' }, PIERNA_B];
  }
}

/** Si un patron no tiene ejercicios validos (por material o lesion), se busca aqui. */
const RESPALDO: Partial<Record<Patron, Patron[]>> = {
  hombro: ['empuje_vertical', 'empuje_horizontal'],
  biceps: ['traccion_horizontal', 'traccion_vertical'],
  triceps: ['empuje_horizontal', 'empuje_vertical'],
  gluteo: ['dominante_cadera', 'dominante_rodilla'],
  gemelo: ['dominante_rodilla'],
  traccion_vertical: ['traccion_horizontal'],
  empuje_vertical: ['empuje_horizontal'],
  dominante_cadera: ['dominante_rodilla'],
  dominante_rodilla: ['dominante_cadera'],
};

const RANGO_NIVEL: Record<Nivel, number> = { principiante: 0, intermedio: 1, avanzado: 2 };

const ISOMETRICOS = new Set(['plancha', 'plancha_lateral', 'hollow_hold']);

export function esIsometrico(id: string): boolean {
  return ISOMETRICOS.has(id);
}

/** Numero maximo de ejercicios por sesion segun experiencia. */
function tope(nivel: Nivel): number {
  return nivel === 'principiante' ? 5 : nivel === 'intermedio' ? 6 : 7;
}

function candidatos(perfil: PerfilEntreno, patron: Patron): Ejercicio[] {
  return EJERCICIOS.filter(
    (e) =>
      e.patron === patron &&
      e.entornos.includes(perfil.entorno) &&
      RANGO_NIVEL[e.nivel] <= RANGO_NIVEL[perfil.nivel] &&
      !e.evitarSi.some((l) => perfil.limitaciones.includes(l)),
  );
}

function elegir(
  perfil: PerfilEntreno,
  hueco: Hueco,
  usadosPlan: Set<string>,
  usadosDia: Set<string>,
): Ejercicio | null {
  const patrones: Patron[] = [hueco.patron, ...(RESPALDO[hueco.patron] ?? [])];

  for (const patron of patrones) {
    const lista = candidatos(perfil, patron).filter((e) => !usadosDia.has(e.id));
    if (!lista.length) continue;

    // El ejercicio principal debe ser un basico; los accesorios, preferiblemente no.
    const ordenados = [...lista].sort((a, b) => puntuar(b, hueco.rol) - puntuar(a, hueco.rol));
    const frescos = ordenados.filter((e) => !usadosPlan.has(e.id));
    const elegido = frescos[0] ?? ordenados[0];
    if (elegido) return elegido;
  }
  return null;
}

function puntuar(e: Ejercicio, rol: Rol): number {
  const posicion = EJERCICIOS.findIndex((x) => x.id === e.id);
  const orden = (EJERCICIOS.length - posicion) / 100; // respeta el orden del catalogo
  if (rol === 'principal') return (e.basico ? 10 : 0) + orden;
  if (rol === 'secundario') return (e.basico ? 4 : 3) + orden;
  return (e.basico ? 0 : 5) + orden;
}

export function prescripcion(rol: Rol, objetivo: ObjetivoEntreno, nivel: Nivel, ejercicioId: string): Omit<Bloque, 'ejercicioId' | 'rol'> {
  if (esIsometrico(ejercicioId)) {
    return { series: 3, repMin: 30, repMax: 45, rir: 1, descansoSeg: 60 };
  }

  let series: number;
  let repMin: number;
  let repMax: number;
  let rir: number;
  let descansoSeg: number;

  if (rol === 'principal') {
    if (objetivo === 'fuerza') {
      series = 4; repMin = 4; repMax = 6; rir = 2; descansoSeg = 180;
    } else if (objetivo === 'ganar_musculo') {
      series = 4; repMin = 6; repMax = 8; rir = 2; descansoSeg = 150;
    } else {
      series = 3; repMin = 6; repMax = 10; rir = 2; descansoSeg = 120;
    }
  } else if (rol === 'secundario') {
    series = 3; repMin = 8; repMax = 12; rir = 2; descansoSeg = 105;
    if (objetivo === 'fuerza') { repMin = 6; repMax = 8; descansoSeg = 120; }
  } else {
    series = 3; repMin = 12; repMax = 15; rir = 1; descansoSeg = 60;
    if (objetivo === 'perder_grasa') { descansoSeg = 45; }
  }

  if (nivel === 'principiante') {
    series = Math.max(2, series - 1);
    rir = Math.min(3, rir + 1);
  } else if (nivel === 'avanzado' && rol === 'principal') {
    series += 1;
  }

  return { series, repMin, repMax, rir, descansoSeg };
}

function cardio(objetivo: ObjetivoEntreno): string | null {
  switch (objetivo) {
    case 'perder_grasa':
      return '12-15 min de cinta o eliptica a ritmo comodo al acabar + objetivo de 10.000 pasos diarios.';
    case 'ganar_musculo':
      return '5-10 min suaves de vuelta a la calma. Nada mas: la energia va a la barra.';
    case 'fuerza':
      return 'Opcional: 15-20 min en zona 2 en un dia sin entreno.';
    default:
      return '20 min en zona 2 (puedes hablar mientras) 1-2 veces por semana.';
  }
}

function notas(perfil: PerfilEntreno): string[] {
  const base = [
    'Calienta 5-8 min: movilidad + 2 series ligeras del primer ejercicio del dia.',
    'RIR = repeticiones en recamara. RIR 2 significa parar con 2 repeticiones de margen antes del fallo.',
    'Progresion doble: cuando completes TODAS las series en el limite alto del rango con el RIR objetivo, sube el peso el proximo dia.',
    'Cada 5-6 semanas haz una semana de descarga: mismo peso, la mitad de series.',
    'Descansa al menos un dia entre sesiones que repitan los mismos musculos.',
  ];
  if (perfil.objetivo === 'perder_grasa') {
    base.push('En deficit la fuerza puede estancarse: mantener el peso en la barra ya es buena senal.');
  }
  if (perfil.objetivo === 'ganar_musculo') {
    base.push('Duerme 7-9 h: sin descanso no hay musculo, por muchas series que hagas.');
  }
  if (perfil.limitaciones.length) {
    base.push(`Plan adaptado a tus molestias (${perfil.limitaciones.join(', ')}): se han excluido los ejercicios mas agresivos. Si algo duele, para.`);
  }
  return base;
}

/** Huella de los campos del perfil que afectan al plan. */
export function firmaPerfil(p: PerfilEntreno): string {
  const crudo = [p.objetivo, p.nivel, p.diasPorSemana, p.entorno, [...p.limitaciones].sort().join('-')].join('|');
  let hash = 5381;
  for (let i = 0; i < crudo.length; i++) hash = ((hash << 5) + hash + crudo.charCodeAt(i)) | 0;
  return Math.abs(hash).toString(36);
}

export function generarPlan(perfil: PerfilEntreno): PlanEntreno {
  const usadosPlan = new Set<string>();
  const dias: DiaPlan[] = plantillas(perfil.diasPorSemana).map((plantilla, indice) => {
    const usadosDia = new Set<string>();
    const bloques: Bloque[] = [];

    for (const hueco of plantilla.huecos.slice(0, tope(perfil.nivel))) {
      const elegido = elegir(perfil, hueco, usadosPlan, usadosDia);
      if (!elegido) continue;
      usadosDia.add(elegido.id);
      usadosPlan.add(elegido.id);
      bloques.push({
        ejercicioId: elegido.id,
        rol: hueco.rol,
        ...prescripcion(hueco.rol, perfil.objetivo, perfil.nivel, elegido.id),
      });
    }

    return {
      id: `d${indice + 1}`,
      nombre: `Dia ${indice + 1} · ${plantilla.nombre}`,
      foco: plantilla.foco,
      bloques,
      cardio: cardio(perfil.objetivo),
    };
  });

  return {
    generadoEl: new Date().toISOString(),
    firma: firmaPerfil(perfil),
    dias,
    notas: notas(perfil),
  };
}

export function planDesactualizado(plan: PlanEntreno | null, perfil: PerfilEntreno): boolean {
  // Un plan importado de un especialista no depende del perfil: nunca caduca.
  return !!plan && plan.firma !== 'importado' && plan.firma !== firmaPerfil(perfil);
}

/** Series totales por grupo muscular en la semana, para revisar el volumen. */
export function volumenSemanal(plan: PlanEntreno): { musculo: string; series: number }[] {
  const total = new Map<string, number>();
  for (const dia of plan.dias) {
    for (const bloque of dia.bloques) {
      const e = ejercicio(bloque.ejercicioId);
      if (!e) continue;
      const principal = e.musculos[0] ?? 'otros';
      total.set(principal, (total.get(principal) ?? 0) + bloque.series);
    }
  }
  return [...total.entries()]
    .map(([musculo, series]) => ({ musculo, series }))
    .sort((a, b) => b.series - a.series);
}
