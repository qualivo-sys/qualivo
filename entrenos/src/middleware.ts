import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_ACCESO, hashCodigo } from '@/lib/acceso';

/**
 * Si APP_PASSCODE esta definida, la app pide un codigo antes de entrar.
 * Sin la variable, no hay puerta: util en local o si prefieres URL abierta.
 */
export async function middleware(peticion: NextRequest) {
  const codigo = process.env.APP_PASSCODE;
  if (!codigo) return NextResponse.next();

  const cookie = peticion.cookies.get(COOKIE_ACCESO)?.value;
  if (cookie && cookie === (await hashCodigo(codigo))) return NextResponse.next();

  const destino = peticion.nextUrl.clone();
  destino.pathname = '/acceso';
  destino.search = `?destino=${encodeURIComponent(peticion.nextUrl.pathname)}`;
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: ['/((?!acceso|api/acceso|_next/static|_next/image|favicon.ico).*)'],
};
