import { NextResponse } from 'next/server';
import { clienteServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/** Vuelta del enlace de confirmacion de email de Supabase. */
export async function GET(peticion: Request) {
  const url = new URL(peticion.url);
  const codigo = url.searchParams.get('code');

  if (codigo) {
    const supabase = clienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    if (error) {
      return NextResponse.redirect(new URL('/entrar?error=enlace_caducado', url.origin));
    }
  }

  return NextResponse.redirect(new URL('/app', url.origin));
}
