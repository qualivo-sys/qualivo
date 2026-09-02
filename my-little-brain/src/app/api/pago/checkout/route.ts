import { NextResponse } from 'next/server';
import { cargarPerfil } from '@/lib/datos';
import { hayPagos, stripe, urlBase } from '@/lib/pago';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Crea la sesion de pago de Stripe para pasar a Pro. */
export async function POST(peticion: Request) {
  if (!hayPagos()) {
    return NextResponse.json({ error: 'Los pagos no estan configurados todavia.' }, { status: 503 });
  }

  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  const usuario = data.user;
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const perfil = await cargarPerfil(supabase, usuario.id);
  if (!perfil) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });

  try {
    const sesion = await stripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_PRO!, quantity: 1 }],
      client_reference_id: usuario.id,
      customer: perfil.stripe_customer_id || undefined,
      customer_email: perfil.stripe_customer_id ? undefined : usuario.email ?? undefined,
      // El id de usuario viaja en los metadatos para que el webhook sepa a quien activar.
      metadata: { user_id: usuario.id },
      subscription_data: { metadata: { user_id: usuario.id } },
      allow_promotion_codes: true,
      success_url: `${urlBase(peticion)}/app/ajustes?pago=ok`,
      cancel_url: `${urlBase(peticion)}/app/ajustes?pago=cancelado`,
    });

    return NextResponse.json({ url: sesion.url });
  } catch (error) {
    console.error('[pago] no se pudo crear la sesion de checkout', error);
    return NextResponse.json({ error: 'No se ha podido abrir el pago.' }, { status: 502 });
  }
}
