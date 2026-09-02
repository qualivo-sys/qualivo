import { NextResponse } from 'next/server';
import { enviarAviso, hayPush } from '@/lib/push';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Manda un aviso de prueba a los navegadores del propio usuario. */
export async function POST() {
  if (!hayPush()) return NextResponse.json({ error: 'Los avisos no estan configurados.' }, { status: 503 });

  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: subs } = await supabase
    .from('push_suscripciones')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', data.user.id);

  const resultado = await enviarAviso(supabase, subs ?? [], {
    titulo: 'Funciona',
    cuerpo: 'Asi te avisare por la manana y por la noche. Toca para abrir el coach.',
    url: '/app/coach',
    tag: 'prueba',
  });
  return NextResponse.json(resultado);
}
