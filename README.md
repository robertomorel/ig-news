<h2 align="center">
  Ig News
</h2>

<p align="center">
  <img alt="GitHub Top Language" src="https://img.shields.io/github/languages/top/robertomorel/ig-news?color=ff512f&style=flat-square">
</p>

<br />

## Sobre

Esta aplicação foi feita a partir do curto Ignite - RocketSeat (2021). Simula uma aplicação web para blog de notícias, utilizando o Next.JS. 


## Tecnologias Principais

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextJS](https://nextjs.org/docs)
- [SASS](https://sass-lang.com/documentation)
- [Axios](https://github.com/axios/axios)
- [Stripe](https://stripe.com/en-br)
- [FaunaDB](https://fauna.com/)
- [Prismic CMS](https://prismic.io/)
- [Oauth - Github](https://next-auth.js.org/getting-started/client)
- [Web Hook](https://nextjs.org/docs/basic-features/data-fetching)


## Tipos de Aplicações Next.JS

<div align="center">
  <img src="https://raw.githubusercontent.com/robertomorel/assets/master/icon.jpeg" alt="" width="400"/>
</div>

### Client-Side
- Quando não precisamos de indexação;
- Informações que não precisam estar renderizadas imediatamente quando a página é carregada;
    - Exemplo: comentários de um blog.
- Informações geralmente de ações de usuários que demoram para ser carregadas.

### Server-Side
- Faz todo o processo do zero;
- Para dados que devem ser dinâmicos, devemos usar o Server-Side;
    - Exemplo: Componentes que dependem da sessão do usuário.
- Possibilidade de pegar dados do usuário para alimentar alguma regra ou interface.

<div align="center">
  <img src="https://raw.githubusercontent.com/robertomorel/assets/master/icon.jpeg" alt="" width="400"/>
</div>

### Static-Side
- O Static props executa uma única vez e salva o HTML estático, que só será atualizado depois do <b>revalidate</b>;
- Gerar o HTML de uma página de forma que qualquer cliente acesse de forma igual, independente de sessão do usuário.

<div align="center">
  <img src="https://raw.githubusercontent.com/robertomorel/assets/master/icon.jpeg" alt="" width="400"/>
</div>


## [Stripe](https://stripe.com/en-br)
API de pagamento focado em desenvolvimento. Possui ambiente de DEV e STAGE muito bons. 
Pode ser utilizada conta free para testar pagamentos em aplicações de modo geral. 

### Projeto
Para o projeto, precisamos: 
- Criar uma conta no Stripe;
- Criar um "Product" chamado "Subscriptions";
- Criar novas keys;
- Preencher as variáveis de ambiente:
    - STRIPE_API_KEY=Chave secreta do Stripe
    - NEXT_PUBLIC_STRIPE_PUBLIC_KEY=Chave pública do Stripe
    - STRIPE_SUCCESS_URL=http://localhost:3000/posts
    - STRIPE_CANCEL_URL=http://localhost:3000/


## Autenticação no Next.JS 
Metodologia de Autenticação. Consiste em fazer a aplicação buscar as informações de autenticação de outra aplicação.

Clique [aqui](nextjs.org/docs/authentication) para mais informações.
- JWT (Storage)
- Next Auth (Social)
- Auth0
- Cognito

### Projeto
Para o projeto, precisamos:
- Realizar configurações necessárias no Github;
- Preencher variáveis de ambiente:
    - GITHUB_CLIENT_ID=ID do cliente
    - GITHUB_CLIENT_SECRET=Secret do client   
- Estamos utilizando o Auth0 [next-auth/client](https://next-auth.js.org/getting-started/client) com Github.


## NextJS API Routes
Cada arquivo que colocamos na pasta <b>src/pages/api</b> serão transformados em rotas de backend (endpoints).

Se criarmos um arquivo chamado api/users - <i>localhost:3000/api/users</i> - terá como retorno os usuários cadastrados, por exemplo.

> Tudo o que é executado na pasta "api" não é visível ao cliente final. Apenas os dados.

Todas as APIs Routes usam o conceito de serveless
- Quando a aplicação Next é 'deployada', ou seja, enviada para produção, as rotas da pasta "api" não formam um servidor;
- Não é usado um servidor Express ou Node que fica 24 hrs rodando aguardando requisições para as rotas;
- Exemplo de steps:
    - O servidor serveless sobe uma espécie de "máquina virtual", que seria um ambiente isolado;
    - Acessa à uma função específica; 
    - Quando a função devolve a resposta, o ambiente é destruído;
    - Ou seja, só sobe e desce este ambiente isolado à medida que as rotas são chamadas.

### Exemplo
Se criarmos um arquivo chamado <b>api/users/[id]</b> e no browser acessar <b>localhost:3000/api/users/1</b>, poderemos ter acesso à uma variável de query do request deste modo:
```bash
request.query = {id: '1'}
```

Se criarmos um arquivo chamado <b>api/users/[...params]</b> e no browser acessar <b>localhost:3000/api/users/edit/1/detail</b>, poderemos ter acesso à uma variável de query do request deste modo:
```bash
request.query = {params: ['edit', '1', 'detail']}
```


## [Fauna DB](https://fauna.com/) 
Banco não relacional para aplicações serveless.

As operações que precisamos fazer em DB, Stripe, ou qualquer outra API que precisa ter acesso à alguma chave secreta, não podem ser feitas pelo lado do browser - não podemos fazer operações de consulta no banco pelo useEffect, ou quando o usuário clicar em um botão.

Estas operações apenas podem ser feitas dentro das API Routes do Next.JS - rotas que estão comumente na pasta API -, pois são rotas BE, não acessíveis pelo usuário final, ou pelos métodos <b>getStaticProps</b> ou <b>getServerSideProps</b>, pois só rodam em "momentos de backend". 

- Podemos utilizar o [FaunaDB com Docker](https://hub.docker.com/r/fauna/faunadb)
- Banco não relacional - Free Schema

> Cada rota da aplicação vai ser executada em ambiente isolado, ou seja, só no momento que chamarmos a rota é que o <i>CloudProvider / Google</i> vai executar a função, mostrar o resultado e deletar a máquina vistual.

### Projeto
Para o projeto, precisamos:
- Criar DB "Ignews";
- Criar collections:
    - "subscriptions";
    - "users".
- Criar indexes deste modo:
    - "subscription_by_id" --> data.id --: collection "subscriptions"; 
    - "subscription_by_status" --> data.status --: collection "subscriptions"; 
    - "subscription_by_user_ref" --> data.userId --: collection "subscriptions"; 
    - "user_by_email" --> data.email --: collection "users"; 
    - "user_by_stripe_customer_id" --> data.stripe_customer_id --: collection "users".
- Preencher variáveis de ambiente:      
    - FAUNADB_KEY=Secret do FaunaDB


## Web Hook
Pattern utilizado para integração entre sistemas na Web.

Quando utilizamos uma aplicação terceira, como o Stripe, é normalmente usado o conceito de Web Hooks para avisar à aplicação quando acontece alguma coisa por parte da aplicação terceira.
Por exemplo:
1. Stripe
    - Cria customer
    - Cria subscription
2. Aplicação
    - Inscrição

Imaginando que depois de um tempo, o cartão do usuário passou a não mais ser aceito, o stripe precisa avisar à aplicação que este evento aconteceu. Isso acontece por uma rota HTTP.
- Quero que o Stripe avise à rota <b>http://localhost:3000/api/stripe/webhooks</b> o que aconteceu, passando as informações do evento
```
  {
    cartão sem fundos
    user
    cartão
  }
```  

> Encontre mais informações [aqui](https://dashboard.stripe.com/test/webhooks).

⚠️ Para ambiente de DEV, precisamos usar a [CLI do Stripe](https://stripe.com/docs/stripe-cli).
1. Baixa e instala o Stripe CLI;
2. Loga;
    - `stripe login / enter`
3. Rodar `listen --forward-to localhost:3000/api/webhooks` para fazer o CLI ouvir eventos no Stripe.

### Projeto
Para o projeto, precisamos:
- [Criar um webhook no Stripe](https://dashboard.stripe.com/test/webhooks);
- Preencher variáveis de ambiente:      
    - STRIPE_WEBHOOK_SECRET=Secret do Hebhook do Stripe


## [Prismic CMS](https://prismic.io/)
Painel de administração para cadastrar informações e servir os dados como uma API. Clique [aqui](https://prismic.io/docs/technologies/start-a-prismic-project-from-scratch-with-reactjs) para entender melhor a integração do Prismic com o ReactJS.

### JAMStack
Aplicação terceira para criar aplicações completas sem depender de backend. Javascript API Markut (HTML).

- CMS (Content Managment System)
    - Wordpress | Drupal | Joomla | Magento (E-commerce)

- Headless CMS (Painel de Admin. + API(HTTP, GraphQL, SDK))
    - Strapi | Ghost | Keystone | GraphCMS | Prismic CMS | Contentful
    - Saleor | Shopify

### CMS - Content Manegment System
Exemplos: Wordpress/Magenta/Strap/GrathCMS

### Projeto
Para o projeto, precisamos:
- Criar conta no Prismic
- Criar um Custom Type com as especificações:
    - UID;
    - Title;
    - Content.
- Preencher variáveis de ambiente:       
    - PRISMIC_ACCESS_TOKEN=Access token do Prismic
    - PRISMIC_ENDPOINT=Endpoint do Prismic


## Como rodar a aplicação

### Arquivo .env.local
Criar um arquivo ".env.local" na raiz do projeto com este formato:
```bash
# Stripe
STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=

STRIPE_WEBHOOK_SECRET=

STRIPE_SUCCESS_URL=
STRIPE_CANCEL_URL=

# Github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# FaunaDB
FAUNADB_KEY=

# JWT - Deve ser gerada uma chave a HS512 para produção
SIGNING_KEY=

# Prismic CMS
PRISMIC_ACCESS_TOKEN=
PRISMIC_ENDPOINT=
```

> Preencher este arquivo com todas as informações passadas neste README.

Rodar os comandos:
```console
# Clone the repository
git clone https://github.com/robertomorel/ig-news.git

# Install all dependencies
yarn install

# Run the app
yarn start
```


## Credits
- [Rocket Seat Team](https://rocketseat.com.br/)

----------------------

## Vamos Conversar?!
- [LinkedIn](https://www.linkedin.com/in/roberto-morel-6b9065193/)