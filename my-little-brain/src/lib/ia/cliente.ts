import Anthropic from '@anthropic-ai/sdk';

/**
 * Cliente de la API de Claude. La clave se lee de ANTHROPIC_API_KEY.
 * Sin clave la app funciona, pero el coach avisa de que falta configurarla.
 */
export function hayClaveIA(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function clienteIA(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/** Modelo por defecto; se puede fijar otro con ANTHROPIC_MODEL. */
export const MODELO = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

/**
 * Los clasificadores de seguridad pueden declinar una peticion. Con fallbacks
 * en modo "default" la API la reintenta sola en otro modelo en la misma llamada.
 */
export const BETA_FALLBACK = 'server-side-fallback-2026-07-01';

export function textoDe(mensaje: Anthropic.Messages.Message | Anthropic.Beta.Messages.BetaMessage): string {
  return mensaje.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}
