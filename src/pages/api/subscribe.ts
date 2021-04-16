import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import {getSession} from 'next-auth/client';
import { fauna } from "../../services/fauna";
import {stripe} from "../../services/stripe";

type User = {
  ref: {
    id: string;
  }
  data:{ 
    stripe_customer_id: string;
  }
}

export default async ( req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    
    // Busca informações de sessão dos cookies
    // Param: req
    const session = await getSession({ req });

    // Busca user no Fauna pelo email do user  
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    // Verifica se no cadastro do user no Fauna já existe o stripe_customer_id
    let customerId = user.data.stripe_customer_id;

    // Se não existir...
    if(!customerId) {
      // Cria um customer no Stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });
  
      // Atualizando o usuário no Fauna com este campo
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          { 
            data: { 
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )
      
      customerId = stripeCustomer.id;
    }
    
    // Criando sessão checkout do Stripe
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, //Quem está comprando o pacote
      payment_method_types: ['card'], // Método de pag.
      billing_address_collection: 'required', // Obriga o usuário colocar o endereço
      line_items: [
        { price: 'price_1IfrkIGVXa2HCRbKdjqJ83NU', quantity: 1 }
      ],
      mode: 'subscription', // Pag recorrente
      allow_promotion_codes: true, // Cupons de código
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else { // Se a requisição não for do tipo POST
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed');
  }
}