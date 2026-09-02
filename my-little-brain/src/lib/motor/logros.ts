import type { Dia } from './puntuaciones';

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  /** 0-1: cuanto lleva conseguido. */
  progreso: number;
  conseguido: boolean;
  meta: string;
}

export interface EntradaLogros {
  dias: Dia[];
  racha: number;
  entrenosTotales: number;
  comidasTotales: number;
  tonelajeTotal: number;
  revisiones: number;
  pesajes: number;
}

const definir = (
  id: string,
  emoji: string,
  nombre: string,
  descripcion: string,
  valor: number,
  objetivo: number,
  unidad: string,
): Logro => ({
  id,
  nombre,
  descripcion,
  emoji,
  progreso: Math.max(0, Math.min(1, valor / objetivo)),
  conseguido: valor >= objetivo,
  meta: `${Math.min(valor, objetivo).toLocaleString('es-ES')} / ${objetivo.toLocaleString('es-ES')} ${unidad}`,
});

/** Logros derivados de los datos: no hay tabla que mantener ni estado que corromper. */
export function logros(entrada: EntradaLogros): Logro[] {
  const { dias } = entrada;
  const semanaCompleta = (() => {
    let mejor = 0;
    let actual = 0;
    for (const dia of dias) {
      const registrado = dia.comidas > 0 || dia.entreno || dia.focoMin > 0 || dia.animo !== null;
      actual = registrado ? actual + 1 : 0;
      mejor = Math.max(mejor, actual);
    }
    return mejor;
  })();

  return [
    definir('primer_paso', '🌱', 'Primer paso', 'Registra tu primer dia', semanaCompleta, 1, 'dia'),
    definir('semana_entera', '📅', 'Semana entera', 'Siete dias seguidos registrando', semanaCompleta, 7, 'dias'),
    definir('mes_de_racha', '🔥', 'Mes de racha', '30 dias seguidos de actividad', entrada.racha, 30, 'dias'),
    definir('diez_entrenos', '💪', 'Diez entrenos', 'Completa 10 sesiones', entrada.entrenosTotales, 10, 'entrenos'),
    definir('cincuenta_entrenos', '🏋️', 'Cincuenta entrenos', 'Completa 50 sesiones', entrada.entrenosTotales, 50, 'entrenos'),
    definir('cien_comidas', '🍽️', 'Cien comidas', 'Registra 100 comidas', entrada.comidasTotales, 100, 'comidas'),
    definir('diez_toneladas', '🚚', 'Diez toneladas', 'Mueve 10.000 kg en total', Math.round(entrada.tonelajeTotal), 10000, 'kg'),
    definir('bascula_fiel', '⚖️', 'Bascula fiel', 'Pesate 20 veces', entrada.pesajes, 20, 'pesajes'),
    definir('cuatro_revisiones', '🧭', 'Un mes de revisiones', 'Genera 4 revisiones semanales', entrada.revisiones, 4, 'revisiones'),
  ];
}
