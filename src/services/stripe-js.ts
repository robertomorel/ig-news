/**
 * Acesso público ao Stripe
 * Integração do Stripe com o Frontend, para utilização das suas operações públicas
 */
import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
  // Colocamos "NEXT_PUBLIC" na chave para se tornar pública e ser vista no FE
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return stripeJs;
}