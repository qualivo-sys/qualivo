import { NextResponse } from 'next/server';
import { clienteServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/** Solo aceptamos destinos dentro de la app: nada de redirigir a otros dominios. */
function destinoSeguro(valor: string | null): string {
  if (!valor || !valor.startsWith('/') || valor.startsWith('//')) return '/app';
  return valor;
}

/** Vuelta de los enlaces de email de Supabase (confirmacion y recuperacion). */
export async function GET(peticion: Request) {
  const url = new URL(peticion.url);
  const codigo = url.searchParams.get('code');
  const siguiente = destinoSeguro(url.searchParams.get('siguiente'));

  if (codigo) {
    const supabase = clienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    if (error) {
      return NextResponse.redirect(new URL('/entrar?error=enlace_caducado', url.origin));
    }
  }

  return NextResponse.redirect(new URL(siguiente, url.origin));
}
