import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hayPush } from '@/lib/push';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Esquema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

/** Clave publica para que el navegador se suscriba. */
export async function GET() {
  return NextResponse.json({ activo: hayPush(), clavePublica: process.env.VAPID_PUBLIC_KEY ?? null });
}

/** Guarda la suscripcion del navegador actual. */
export async function POST(peticion: Request) {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  let cuerpo: z.infer<typeof Esquema>;
  try {
    cuerpo = Esquema.parse(await peticion.json());
  } catch {
    return NextResponse.json({ error: 'Suscripcion invalida' }, { status: 400 });
  }

  const { error } = await supabase.from('push_suscripciones').upsert(
    {
      user_id: data.user.id,
      endpoint: cuerpo.endpoint,
      p256dh: cuerpo.keys.p256dh,
      auth: cuerpo.keys.auth,
      navegador: peticion.headers.get('user-agent')?.slice(0, 200) ?? null,
    },
    { onConflict: 'endpoint' },
  );
  if (error) return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Da de baja el navegador actual. */
export async function DELETE(peticion: Request) {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { endpoint } = (await peticion.json().catch(() => ({}))) as { endpoint?: string };
  if (!endpoint) return NextResponse.json({ error: 'Falta endpoint' }, { status: 400 });

  await supabase.from('push_suscripciones').delete().eq('user_id', data.user.id).eq('endpoint', endpoint);
  return NextResponse.json({ ok: true });
}
