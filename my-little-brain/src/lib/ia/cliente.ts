import Anthropic from '@anthropic-ai/sdk';

/**
 * Cliente de la API de Claude. La clave se lee de ANTHROPIC_API_KEY.
 * Sin clave la app funciona, pero el coach avisa de que falta configurarla.
 */
export function hayClaveIA(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Las claves "vinculadas a identidad" de la consola de Anthropic exigen decir
 * en cada peticion en que workspace actuan; las claves clasicas no. Con
 * ANTHROPIC_WORKSPACE_ID definida se manda el cabecero y valen las dos.
 */
export function clienteIA(): Anthropic {
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID;
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultHeaders: workspace ? { 'anthropic-workspace-id': workspace } : undefined,
  });
}

/** Modelo del chat; se puede fijar otro con ANTHROPIC_MODEL. */
export const MODELO = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

/**
 * Modelo de la revision semanal. Es una llamada a la semana y la que mas
 * criterio pide, asi que puede ir en un modelo mejor que el del chat.
 */
export const MODELO_REVISION = process.env.ANTHROPIC_MODEL_REVISION || MODELO;

/**
 * Los clasificadores de seguridad pueden declinar una peticion. Con fallbacks
 * en modo "default" la API la reintenta sola en otro modelo en la misma llamada.
 */
export const BETA_FALLBACK = 'server-side-fallback-2026-07-01';

type Esfuerzo = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

/**
 * No todos los modelos aceptan los mismos parametros: `fallbacks` solo existe
 * en la gama Opus/Fable, y Haiku 4.5 rechaza `effort`. Esto devuelve lo que
 * corresponde a cada uno para que cambiar de modelo sea cambiar una variable.
 */
export function parametrosModelo(modelo: string, esfuerzo: Esfuerzo) {
  const gamaAlta = /opus|fable|mythos/.test(modelo);
  const soportaEsfuerzo = !/haiku|sonnet-4-5|opus-4-5/.test(modelo);
  return {
    ...(gamaAlta ? { betas: [BETA_FALLBACK], fallbacks: 'default' as const } : {}),
    ...(soportaEsfuerzo ? { output_config: { effort: esfuerzo } } : {}),
  };
}

export function textoDe(mensaje: Anthropic.Messages.Message | Anthropic.Beta.Messages.BetaMessage): string {
  return mensaje.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}
