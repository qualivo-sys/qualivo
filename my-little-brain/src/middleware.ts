import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const RUTAS_PRIVADAS = ['/app'];

/** Refresca la sesion en cada navegacion y protege /app. */
export async function middleware(peticion: NextRequest) {
  let respuesta = NextResponse.next({ request: peticion });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return respuesta;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return peticion.cookies.getAll();
      },
      setAll(nuevas) {
        nuevas.forEach(({ name, value }) => peticion.cookies.set(name, value));
        respuesta = NextResponse.next({ request: peticion });
        nuevas.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const privada = RUTAS_PRIVADAS.some((r) => peticion.nextUrl.pathname.startsWith(r));

  if (privada && !data.user) {
    const destino = peticion.nextUrl.clone();
    destino.pathname = '/entrar';
    destino.search = `?siguiente=${encodeURIComponent(peticion.nextUrl.pathname)}`;
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|iconos|.*\\.png$).*)'],
};
