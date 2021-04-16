/**
 * Pattern utilizado para integração entre sistemas na Web.
 * Quando utilizamos uma aplicação terceira, como o Stripe, é normalmente usado o 
 * conceito de Web Hook para avisar à aplicação quando acontece alguma 
 * coisa por parte da aplicação terceira.
 */
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

/**
 * Informações em streaming de dados
 * Função para converter uma Readable em uma stream
 * Concatena muitos chunks em um buffer no final
 * O buffer será a requisição em si.
 * @param readable 
 * @returns 
 */
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

// Exportando para sobrescrever o entendimento padrão do next sobre requisições
// Desabilitando o bodyParser da requisição
export const config = {
  api: {
    bodyParser: false
  }
}

// Quais eventos são relevantes para ouvirmos nesta aplicação
const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.created',
])

export default async  (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Evento Recebido!!")
  if(req.method === 'POST') {
    // Requisição
    const buf = await buffer(req);
    // Buscando dos headers, o cabeçalho 'stripe-signature'
    const secret = req.headers['stripe-signature']

    // Criando var event
    let event: Stripe.Event;

    try {
      // Cronstruindo evento no webhook
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Tipo do evento
    const { type } = event;

    if(relevantEvents.has(type)) {
      try {
        switch(type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':

            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
            )

            break;
          case 'checkout.session.completed':

            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )

            break;

         
          default: 
            throw new Error('Unhandled event.')
        }
      } catch (error) {
        return res.json({ error: 'Webhook handler failed '});
      }
      
      console.log('Evento recibido', event);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed');
  }
}