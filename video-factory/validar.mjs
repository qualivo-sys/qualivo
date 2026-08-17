// Las reglas del director, comprobadas en código. Un prompt se puede ignorar.
// Devuelve la lista de incumplimientos; vacía significa que el storyboard pasa.

const DETALLE = ['close_up', 'extreme_close_up'];

export function validarStoryboard(sb) {
  const fallos = [];
  for (const p of sb.planos ?? []) {
    if (p.origen !== 'generado') continue;
    const en = `plano ${p.n}`;

    // Regla 6: nada con acción compleja se genera a ciegas.
    if (p.action_complexity === 'high' && !p.reference_required)
      fallos.push(`${en}: action_complexity high sin reference_required. Regla 6: simplificar, dividir o pedir referencia.`);

    // Regla 3 y 4: un detalle no se saca de una referencia de plano general.
    if (DETALLE.includes(p.tipo_plano) && p.reference_quality === 'low' && !p.reference_required)
      fallos.push(`${en}: plano detalle con referencia pobre y sin reference_required. Regla 3.`);

    // Regla 5: pedir referencia sin decir cuál no sirve de nada.
    if (p.reference_required && !p.reference_needed_desc)
      fallos.push(`${en}: reference_required sin describir qué imagen hace falta. Regla 5.`);

    // Justificación obligatoria: si no se puede escribir, el plano no está listo.
    if (!p.justificacion || p.justificacion.trim().length < 80)
      fallos.push(`${en}: justificación vacía o de relleno.`);
  }
  return fallos;
}
