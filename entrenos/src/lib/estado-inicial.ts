import type { Estado, Perfil } from './types';

export const VERSION_ESTADO = 1;

export function perfilPorDefecto(id: string, nombre: string): Perfil {
  return {
    id,
    nombre,
    sexo: id === 'isa' ? 'mujer' : 'hombre',
    edad: 32,
    alturaCm: id === 'isa' ? 165 : 178,
    objetivo: 'perder_grasa',
    nivel: 'principiante',
    diasPorSemana: 3,
    entorno: 'gimnasio',
    actividad: 'ligera',
    limitaciones: [],
    notas: '',
    actualizado: new Date().toISOString(),
  };
}

export function estadoInicial(id: string, nombre: string): Estado {
  return {
    version: VERSION_ESTADO,
    perfil: perfilPorDefecto(id, nombre),
    mediciones: [],
    sesiones: [],
    plan: null,
  };
}

/** Rellena campos que falten al leer datos guardados por una version anterior. */
export function normalizarEstado(bruto: unknown, id: string, nombre: string): Estado {
  const base = estadoInicial(id, nombre);
  if (!bruto || typeof bruto !== 'object') return base;
  const e = bruto as Partial<Estado>;
  return {
    version: VERSION_ESTADO,
    perfil: { ...base.perfil, ...(e.perfil ?? {}), id, nombre: e.perfil?.nombre || nombre },
    mediciones: Array.isArray(e.mediciones) ? e.mediciones : [],
    sesiones: Array.isArray(e.sesiones) ? e.sesiones : [],
    plan: e.plan ?? null,
  };
}
