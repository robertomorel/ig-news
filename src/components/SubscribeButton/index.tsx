import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter()

  async function handleSubscribe() {
    // Se o user não tiver logado, vai loggar
    if(!session) {
      signIn('github');
      return;
    }

    // Criando da checkout session no stripe
    // Doc: https://stripe.com/docs/api/checkout/sessions
    if(session.activeSubscription) {
      router.push('/posts')
      return;
    }

    try {
      const response = await api.post('subscribe');
      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      // Redireciona o usuário para o checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}

export default memo(SubscribeButton);