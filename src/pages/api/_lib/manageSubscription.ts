import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
  // Buscar o user no Fauna com o ID no Stripe
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData ={
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  // Salvar os dados da subscription no FaunaDB
  if(createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      q.Replace( // Substitui a subscription por completo
        q.Select( 
          'ref', // Select ref from subscription
          q.Get(
            q.Match( // where subscription_by_id = subscriptionId
              q.Index('subscription_by_id'),
              subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}