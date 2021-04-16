import { GetStaticProps } from 'next';
/**
 * Tudo o que jogarmos dentro do Head, é inserido no arquivo _document.tsx
 * Podemos customizar esta tag em qualquer página
 */
import Head  from "next/head";
import SubscribeButton from "../components/SubscribeButton";
import { stripe } from '../services/stripe';

/**
 * CSS Scope
 * Utilizado para que o CSS seja utilizado apenas dentro de um escopo
 * Para utilizar, modificamos o nome do arquivo para ".module.scss".
 * Ideia semelhante ao que o StyledComponents cria, onde o CSS fica disponíve apenas 
 * no componente que  importou
 */
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}

// Criando função Static-Side para fazer acesso à API do Stripe
/**
 * O Static props executa uma única vez e salva o HTML estático, que só será atualizado depois do revalidate
 * Para dados que devem ser dinâmicos, devemos usar o Server-Side. Sessão do usuário, por exemplo.
 */
export const getStaticProps: GetStaticProps = async () => {
  // Acessando à API e retornando um só dado de um price por id
  // Id do price -> price_1IfrkIGVXa2HCRbKdjqJ83NU
  const price = await stripe.prices.retrieve('price_1IfrkIGVXa2HCRbKdjqJ83NU', {
    expand: ['product'] // Para ter acesso às todas as inform. do produto
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency:  'USD',
    }).format(price.unit_amount / 100),
  }

  return {
   props: {
     product
   },
   // Quanto tempo em s, eu quero que a página seja revalidada
   revalidate: 60 * 60 * 24,  // 24 hours
  }
}