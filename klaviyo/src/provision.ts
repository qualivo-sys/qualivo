/**
 * Parametrización de una `definition` de flow exportada.
 *
 * El enfoque recomendado (y el que sigue este toolkit) es:
 *   1. Montar y validar 1 flow modelo en la UI de Klaviyo.
 *   2. Exportar su definición  (`flows:export <id>`).
 *   3. Clonarla cambiando delays, plantillas y filtros  (aquí).
 *
 * Mucho más fiable que construir el JSON gigante a mano.
 */

export type FlowParams = {
  /** Nombre del nuevo flow. */
  name?: string;
  /** Sustituye el metric id del trigger (p. ej. otro "Checkout Started"). */
  trigger_metric_id?: string;
  /**
   * Overrides por id de acción. La clave es el `id` de la acción en la
   * definición base; el valor, campos a fusionar sobre esa acción.
   *   - time-delay:      { unit, value }
   *   - send-email:      { message: { subject_line, preview_text, template_id, from_email, from_label } }
   *   - send-sms:        { message: { body } }
   */
  actions?: Record<string, Record<string, unknown>>;
};

function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

/** Fusión superficial recursiva: `patch` sobreescribe/añade sobre `base`. */
function deepMerge(base: any, patch: any): any {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) return patch;
  const out = { ...(base ?? {}) };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = deepMerge(base?.[k], v);
  }
  return out;
}

/**
 * Convierte una definición EXPORTADA (formato de lectura) al formato que exige
 * Create Flow. El formato de exportación y el de creación NO son idénticos; sin
 * esta limpieza, clonar un flow tal cual devuelve HTTP 400. Reglas detectadas:
 *
 *   - Las acciones se referencian por `temporary_id`, no por `id`
 *     ("id is not allowed to be specified on create"). Conservamos el mismo
 *     valor para que `entry_action_id` y los `links.next*` sigan apuntando bien.
 *   - En time-delay, `delay_until_weekdays` / `delay_until_time` solo se permiten
 *     si `unit` es "days"; en horas/minutos hay que quitarlos.
 *   - Los `message.id` de send-email / send-sms son ids de servidor y se rechazan
 *     al crear; se eliminan (el `template_id` sí se conserva y se reutiliza).
 *
 * Idempotente: aplicarla dos veces no rompe nada.
 */
export function sanitizeForCreate(definition: any): any {
  const def = deepClone(definition);
  if (Array.isArray(def.actions)) {
    for (const a of def.actions) {
      if (a.id !== undefined && a.temporary_id === undefined) a.temporary_id = String(a.id);
      delete a.id;

      if (a.type === 'time-delay' && a.data && a.data.unit !== 'days') {
        delete a.data.delay_until_weekdays;
        delete a.data.delay_until_time;
      }
      if ((a.type === 'send-email' || a.type === 'send-sms') && a.data?.message) {
        delete a.data.message.id;
      }
    }
  }
  return def;
}

/**
 * Aplica `params` sobre una `definition` base y devuelve una copia lista para
 * `createFlow`. No muta la entrada.
 */
export function applyParams(definition: any, params: FlowParams): any {
  const def = deepClone(definition);

  if (params.trigger_metric_id && Array.isArray(def.triggers)) {
    for (const t of def.triggers) {
      if (t.type === 'metric') t.id = params.trigger_metric_id;
    }
  }

  if (params.actions && Array.isArray(def.actions)) {
    const byId = new Map<string, any>(def.actions.map((a: any) => [String(a.id), a]));
    for (const [actionId, patch] of Object.entries(params.actions)) {
      const action = byId.get(String(actionId));
      if (!action) {
        throw new Error(
          `El id de acción "${actionId}" no existe en la definición base. ` +
            `Acciones disponibles: ${[...byId.keys()].join(', ')}`,
        );
      }
      action.data = deepMerge(action.data, patch);
    }
  }

  return def;
}
