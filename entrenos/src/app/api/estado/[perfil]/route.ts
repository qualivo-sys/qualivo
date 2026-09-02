import { NextResponse } from 'next/server';
import { guardarEstado, hayNube, leerEstado } from '@/lib/db';
import { normalizarEstado } from '@/lib/estado-inicial';
import { buscarPerfil } from '@/lib/perfiles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Contexto {
  params: { perfil: string };
}

export async function GET(_peticion: Request, { params }: Contexto) {
  const perfil = buscarPerfil(params.perfil);
  if (!perfil) return NextResponse.json({ error: 'Perfil desconocido' }, { status: 404 });

  if (!hayNube()) {
    return NextResponse.json({ modo: 'local', estado: null });
  }

  try {
    const estado = await leerEstado(perfil.id);
    return NextResponse.json({ modo: 'nube', estado });
  } catch (error) {
    console.error('[estado] no se pudo leer de la base de datos', error);
    return NextResponse.json({ modo: 'local', estado: null, aviso: 'base_de_datos_no_disponible' });
  }
}

async function guardar(peticion: Request, { params }: Contexto) {
  const perfil = buscarPerfil(params.perfil);
  if (!perfil) return NextResponse.json({ error: 'Perfil desconocido' }, { status: 404 });
  if (!hayNube()) return NextResponse.json({ modo: 'local', guardado: false });

  let cuerpo: unknown;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 });
  }

  const estado = normalizarEstado(cuerpo, perfil.id, perfil.nombre);
  try {
    await guardarEstado(perfil.id, estado);
    return NextResponse.json({ modo: 'nube', guardado: true });
  } catch (error) {
    console.error('[estado] no se pudo guardar en la base de datos', error);
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
  }
}

export async function PUT(peticion: Request, contexto: Contexto) {
  return guardar(peticion, contexto);
}

/** sendBeacon (al cerrar la pestaña) solo sabe hacer POST. */
export async function POST(peticion: Request, contexto: Contexto) {
  return guardar(peticion, contexto);
}
