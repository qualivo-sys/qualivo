import type { SupabaseClient } from '@supabase/supabase-js';
import type { Plan } from '../tipos';

/** Mensajes al coach incluidos en cada plan, por mes natural. */
export const LIMITE_MENSAJES: Record<Plan, number> = {
  free: 40,
  pro: 1500,
  founder: 100000,
};

function mesActual(): string {
  return new Date().toISOString().slice(0, 7);
}

export interface EstadoCuota {
  usados: number;
  limite: number;
  quedan: number;
  agotada: boolean;
}

export async function cuota(
  supabase: SupabaseClient,
  userId: string,
  plan: Plan,
): Promise<EstadoCuota> {
  const { data } = await supabase
    .from('uso_ia')
    .select('mensajes')
    .eq('user_id', userId)
    .eq('mes', mesActual())
    .maybeSingle();

  const usados = data?.mensajes ?? 0;
  const limite = LIMITE_MENSAJES[plan] ?? LIMITE_MENSAJES.free;
  return { usados, limite, quedan: Math.max(0, limite - usados), agotada: usados >= limite };
}

/**
 * Suma un mensaje al contador del mes. Va por una funcion SQL security definer
 * (`incrementar_uso`) porque el usuario no tiene permiso de escritura sobre
 * `uso_ia`: si lo tuviera, podria ponerse el contador a cero y gastar API gratis.
 */
export async function anotarUso(
  supabase: SupabaseClient,
  _userId: string,
  tokens: { entrada: number; salida: number },
): Promise<void> {
  const { error } = await supabase.rpc('incrementar_uso', {
    p_tokens_entrada: Math.max(0, Math.round(tokens.entrada)),
    p_tokens_salida: Math.max(0, Math.round(tokens.salida)),
  });
  if (error) console.error('[uso] no se pudo anotar el consumo', error.message);
}
