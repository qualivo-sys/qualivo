import { proponerAjuste, type PropuestaAjuste } from './motor/ajuste';
import { sumarDias } from './fechas';
import type { Panel } from './datos';
import type { Perfil } from './tipos';

/** Marca de los objetivos que ha fijado la propia app al ajustar. */
export const FUENTE_AJUSTE = 'ajuste automatico de la app';

/**
 * El ajuste de calorias que toca proponer hoy, o null. Se calcula igual en la
 * pagina y en la accion que lo aplica, para que no puedan discrepar.
 */
export function ajustePendiente(panel: Panel, perfil: Perfil): PropuestaAjuste | null {
  const metas = panel.metas;
  if (!metas) return null;
  // Una dieta de un especialista no se toca sola: es suya, no nuestra.
  const manual = perfil.objetivos_manual;
  if (manual && manual.fuente !== FUENTE_AJUSTE) return null;

  const desde = sumarDias(panel.hoy, -14);
  const pesajes = panel.metricas.filter((m) => m.peso_kg && m.fecha >= desde).length;
  const diasConComidas = panel.dias.filter((d) => d.fecha >= desde && d.comidas > 0).length;
  const pospuesto = perfil.preferencias?.ajuste_pospuesto ?? null;
  const ultimoAjuste = [manual?.fijado_el ?? null, pospuesto].filter(Boolean).sort().pop() ?? null;

  return proponerAjuste({
    metas,
    tendenciaKgSemana: panel.cuerpo.tendencia,
    pesajes,
    diasConComidas,
    ultimoAjuste,
    hoy: panel.hoy,
    // Ni por debajo del metabolismo basal ni de un minimo razonable.
    sueloKcal: Math.round(Math.max((metas.tmb || 1500) * 1.05, perfil.sexo === 'mujer' ? 1300 : 1600)),
  });
}
