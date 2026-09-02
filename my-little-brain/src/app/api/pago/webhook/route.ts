import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { hayPagos, planDeSuscripcion, stripe } from '@/lib/pago';
import { clienteAdmin, hayServiceRole } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Webhook de Stripe: es la unica fuente de verdad del plan de cada usuario.
 * Verifica la firma con el cuerpo crudo y escribe con service role (sin sesion).
 */
export async function POST(peticion: Request) {
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!hayPagos() || !secreto || !hayServiceRole()) {
    return NextResponse.json({ error: 'Pagos no configurados' }, { status: 503 });
  }

  const firma = peticion.headers.get('stripe-signature');
  if (!firma) return NextResponse.json({ error: 'Sin firma' }, { status: 400 });

  const crudo = await peticion.text();
  let evento: Stripe.Event;
  try {
    evento = stripe().webhooks.constructEvent(crudo, firma, secreto);
  } catch (error) {
    console.error('[pago] firma de webhook invalida', error);
    return NextResponse.json({ error: 'Firma invalida' }, { status: 400 });
  }

  const supabase = clienteAdmin();

  const activar = async (userId: string, cambios: Record<string, unknown>) => {
    const { error } = await supabase.from('perfiles').update(cambios).eq('id', userId);
    if (error) console.error('[pago] no se pudo actualizar el perfil', error.message);
  };

  try {
    switch (evento.type) {
      case 'checkout.session.completed': {
        const sesion = evento.data.object;
        const userId = sesion.metadata?.user_id ?? sesion.client_reference_id;
        if (userId) {
          await activar(userId, {
            plan: 'pro',
            stripe_customer_id: typeof sesion.customer === 'string' ? sesion.customer : null,
            stripe_subscription_id: typeof sesion.subscription === 'string' ? sesion.subscription : null,
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const suscripcion = evento.data.object;
        const userId = suscripcion.metadata?.user_id;
        const plan = evento.type === 'customer.subscription.deleted' ? 'free' : planDeSuscripcion(suscripcion.status);

        if (userId) {
          await activar(userId, { plan, stripe_subscription_id: suscripcion.id });
        } else if (typeof suscripcion.customer === 'string') {
          // Sin metadatos, buscamos por cliente de Stripe.
          const { error } = await supabase
            .from('perfiles')
            .update({ plan, stripe_subscription_id: suscripcion.id })
            .eq('stripe_customer_id', suscripcion.customer);
          if (error) console.error('[pago] no se pudo actualizar por customer', error.message);
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error('[pago] error procesando el evento', evento.type, error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }

  return NextResponse.json({ recibido: true });
}
