import { NextResponse } from 'next/server';
import { COOKIE_ACCESO, hashCodigo } from '@/lib/acceso';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(peticion: Request) {
  const esperado = process.env.APP_PASSCODE;
  if (!esperado) return NextResponse.json({ ok: true });

  let codigo = '';
  try {
    const cuerpo = (await peticion.json()) as { codigo?: string };
    codigo = (cuerpo.codigo ?? '').trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (codigo !== esperado) {
    return NextResponse.json({ ok: false, error: 'Codigo incorrecto' }, { status: 401 });
  }

  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(COOKIE_ACCESO, await hashCodigo(esperado), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
  return respuesta;
}
