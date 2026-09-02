import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Cliente de Supabase para server components y route handlers.
 * Lee y refresca la sesion desde las cookies de la peticion.
 */
export function clienteServidor() {
  const almacen = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return almacen.getAll();
        },
        setAll(nuevas) {
          try {
            nuevas.forEach(({ name, value, options }) => almacen.set(name, value, options));
          } catch {
            // En server components no se pueden escribir cookies: lo hace el middleware.
          }
        },
      },
    },
  );
}

export function hayConfiguracionSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Usuario autenticado o null. Verificado contra el servidor de Supabase. */
export async function usuarioActual() {
  if (!hayConfiguracionSupabase()) return null;
  try {
    const { data } = await clienteServidor().auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}
