/**
 * Documentação: next-auth.js.org/getting-started/example
 */

import { query as q } from 'faunadb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  //Configure one o more authentication provider
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    })
    // ... add more provider here
  ],
  /*
  jwt: {
    // Em ambiente de produção, precisamos gerar um chave a partir do "node-jose-tools"
    signingKey: process.env.SIGNING_KEY
  },
  */
  // next-auth.js.org/configuration/callbacks
  callbacks: {
    // Callback para modificar os dados que estão no session
    async session(session) {
      try {
        // Buscando se o usuário tem uma inscrição ativa, ou não
        const userActiveSubscription = await fauna.query(
          q.Get( //Buscar
            q.Intersection([ // Interseção entre dois matches (linhas 36 e 48)
              q.Match( // Uma subscription que dá um macth
                q.Index('subscription_by_user_ref'), // pelo index 'subscription_by_user_ref' 
                q.Select( // Selecionar 
                  'ref', //a ref do usuário (Select ref from ...)
                  q.Get( // que
                    q.Match( // bate 
                      q.Index('user_by_email'), // com o índice 'user_by_email'
                      q.Casefold(session.user.email) // considerando esta informação
                    )
                  )
                )
              ),
              q.Index('subscription_by_status'), // Onde 'subscription_by_status' seja 'active'
              'active'          
            ])
          )
        )
  
        return {...session, activeSubscription: userActiveSubscription}
      } catch  {
        return {...session, activeSubscription: null}
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;

      /**
       * Inserindo user no DB Fauna
       * Usando o Fauna Query Language (FQL)
       * See: fauna.com - FQL
       */

      try {
        await fauna.query(
          q.If( // Se
            q.Not( // Não
              q.Exists( // Existir
                q.Match( // Com match de informações (where...)
                  q.Index('user_by_email'), // Pelo index criado
                  q.Casefold(user.email) // Busca pelo email
                )
              )
            ),
            q.Create( // Método para inserir
              q.Collection('users'), //Noma da collection
              { data: { email }} // Dados
            ),
            q.Get( // Se existir, busca o usuário
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
  
        return true;
      } catch  {
        return false;
      }
    }
  }
});