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

export async function anotarUso(
  supabase: SupabaseClient,
  userId: string,
  tokens: { entrada: number; salida: number },
): Promise<void> {
  const mes = mesActual();
  const { data } = await supabase
    .from('uso_ia')
    .select('mensajes, tokens_entrada, tokens_salida')
    .eq('user_id', userId)
    .eq('mes', mes)
    .maybeSingle();

  await supabase.from('uso_ia').upsert(
    {
      user_id: userId,
      mes,
      mensajes: (data?.mensajes ?? 0) + 1,
      tokens_entrada: (data?.tokens_entrada ?? 0) + tokens.entrada,
      tokens_salida: (data?.tokens_salida ?? 0) + tokens.salida,
      actualizado: new Date().toISOString(),
    },
    { onConflict: 'user_id,mes' },
  );
}
