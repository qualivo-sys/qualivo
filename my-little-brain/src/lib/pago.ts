import Stripe from 'stripe';

export function hayPagos(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO);
}

export function stripe(): Stripe {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) throw new Error('Falta STRIPE_SECRET_KEY');
  return new Stripe(clave);
}

export function urlBase(peticion?: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (peticion) return new URL(peticion.url).origin;
  return 'http://localhost:3000';
}

/** El plan que corresponde al estado de la suscripcion en Stripe. */
export function planDeSuscripcion(estado: Stripe.Subscription.Status | null | undefined): 'free' | 'pro' {
  return estado === 'active' || estado === 'trialing' ? 'pro' : 'free';
}
