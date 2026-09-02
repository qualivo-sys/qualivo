import { NextResponse } from 'next/server';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TABLAS = [
  'metricas_corporales', 'comidas', 'planes_entreno', 'entrenamientos', 'series', 'foco',
  'tareas', 'habitos', 'habitos_registro', 'bienestar', 'objetivos', 'memoria',
  'chat_mensajes', 'xp_eventos', 'revisiones', 'uso_ia',
];

/** Portabilidad (art. 20 RGPD): todos los datos del usuario en un JSON. */
export async function GET() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  const usuario = data.user;
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', usuario.id).maybeSingle();

  const exportacion: Record<string, unknown> = {
    exportado_el: new Date().toISOString(),
    email: usuario.email,
    perfil,
  };

  // RLS garantiza que cada consulta solo devuelve las filas del propio usuario.
  for (const tabla of TABLAS) {
    const { data: filas, error } = await supabase.from(tabla).select('*').eq('user_id', usuario.id);
    exportacion[tabla] = error ? { error: error.message } : filas;
  }

  const nombre = `my-little-brain-${new Date().toISOString().slice(0, 10)}.json`;
  return new NextResponse(JSON.stringify(exportacion, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nombre}"`,
      'Cache-Control': 'no-store',
    },
  });
}
