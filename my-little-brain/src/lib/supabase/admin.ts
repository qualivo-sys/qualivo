import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con service role: se salta RLS. Solo para procesos sin usuario
 * (webhook de Stripe, tareas programadas). Nunca se importa desde el navegador.
 */
export function clienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function hayServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
