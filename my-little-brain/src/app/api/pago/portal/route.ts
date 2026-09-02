import { NextResponse } from 'next/server';
import { cargarPerfil } from '@/lib/datos';
import { hayPagos, stripe, urlBase } from '@/lib/pago';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Portal de facturacion de Stripe: cambiar tarjeta, ver facturas o cancelar. */
export async function POST(peticion: Request) {
  if (!hayPagos()) {
    return NextResponse.json({ error: 'Los pagos no estan configurados todavia.' }, { status: 503 });
  }

  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  const usuario = data.user;
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const perfil = await cargarPerfil(supabase, usuario.id);
  const cliente = perfil?.stripe_customer_id;
  if (!cliente) {
    return NextResponse.json({ error: 'Todavia no tienes una suscripcion activa.' }, { status: 400 });
  }

  try {
    const sesion = await stripe().billingPortal.sessions.create({
      customer: cliente,
      return_url: `${urlBase(peticion)}/app/ajustes`,
    });
    return NextResponse.json({ url: sesion.url });
  } catch (error) {
    console.error('[pago] no se pudo abrir el portal', error);
    return NextResponse.json({ error: 'No se ha podido abrir el portal de facturacion.' }, { status: 502 });
  }
}
