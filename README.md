# 


- Serviços -

Stripe
https://stripe.com/en-br
API de PAg. Developer Focus
Tem ambiente de dev e stage muito bom
Inscrição da aplicação

FaunaDB
https://fauna.com/
Tb podemos usar o fauna local usando docker
Banco não relacional - schema free
DB específico para aplicações serveless
Cada rota da aplicação vai ser executada em ambiente isolado, ou seja, só no momento que chamarmos a rota é que o CloudProvider / Google vai executar a função, mostrar o resultado e deletar a máquina vistual.

Prismic CMS 
https://prismic.io/
CMS - Content Manegment System (Wordpress/Magenta/Strap/GrathCMS)
Painel de Admin para cadastrar informações e servir os dados como uma API
Integração: https://prismic.io/docs/technologies/start-a-prismic-project-from-scratch-with-reactjs

Github - OAuth
Metodologia de Autenticação
Consiste em fazer a aplicação buscar as informações de autenticação de outra aplicação


- Tipo de Aplicações -
Client-Side
Quando não precisamos de indexação
Informações que não precisam estar alí imediatamente qndo a página é carregada
Ex.: comentários de um blog
Informações geralmente de ações de usuários que demoram para ser carregadas

Server-Side
Faz todo o processo do zero
Para dados que devem ser dinâmicos, devemos usar o Server-Side. Sessão do usuário, por exemplo.
Podemos pegar dados do usuário, etc.

Static-Side
O Static props executa uma única vez e salva o HTML estático, que só será atualizado depois do revalidate.
Gerar o HTML de uma página de forma que qlqr cliente acesse de forma igual, independente de sessão do usuário



- NextJS API Routes -

Cada arquivo que colocaremos aqui serão transformados em rotas de backend (endpoint)

Se criarmos um arquivo chamado api/users (localhost:3000/api/users) terá como retorno os usuários cadastrados

Tudo o que é executado na pasta "api" não é visível ao cliente final. Apenas os dados.

Todas as APIs Routes usam o conceito de serveless
    - Qndo a aplicação Next é deployada, qndo é enviada para produção, as rotas da pasta API não formam um servidor
    - Não fica um servidor Express ou Node que fica 24 hrs rodando aguardando requisições para as rotas.
    - Passos:
        - O servidor serveless sobe uma espécie de "máquina virtual"/ambiente isolado
        - Acessa à uma função específica 
        - Qndo a função devolve a resposta, o ambiente é destruído
        - Ou seja, só sobe e desce ambiente à medida que as rotas são chamadas


- Rotas - 
----------------------------
Se criarmos um arquivo chamado api/users/[id] e no browser acessar localhost:3000/api/users/1,
vou poder ter acesso à uma variável de query do request
request.query = {id: '1'}

Se criarmos um arquivo chamado api/users/[...params] e no browser acessar localhost:3000/api/users/edit/1/detail,
vou poder ter acesso à uma variável de query do request
request.query = {params: ['edit', '1', 'detail']}


- Autenticação no Next - 
nextjs.org/docs/authentication
JWT (Storage)
Next Auth (Social)
Auth0
Cognito


- FaunaDB - HTTP -
As operações que precisamos fazer nos DB, ou Stripe, ou qualquer outra coisa que precisa ter acesso à chave que é secreta ela não podem ser feitas pelo lado do brower (não podemos fazer operações de consulta no banco pelo useEffect, ou quando o usuário clicar em um botão), apenas podem ser feitas dentro das minhas API Routes (rotas que estão na pasta API, pois são rotas BE, não acessíveis pelo usuário final) ou pelos métodos "getStaticProps" ou "getServerSideProps", pois só rodam em "momentos de backend" 


- Web Hook -
Pattern utilizado para integração entre sistemas na Web.
Quando utilizamos uma aplicação terceira, como o Stripe, é normalmente usado o conceito de Web Hook para avisar à aplicação quando acontece alguma coisa por parte da aplicação terceira.
Exe.:
Stripe
   - Cria customer
   - Cria subscription

Aplicação
   - Inscrição

Imaginando que depois de um tempo, o cartão do usuário não passou.
O stripe precisa avisar à aplicação que este evento aconteceu.

Isso acontece por uma rota HTTP.

--> Quero que o Stripe avise à rota "http://localhost:3000/api/stripe/webhooks" o que aconteceu passando as informações do evento
  {
    cartão sem fundos
    user
    cartão
  }
https://dashboard.stripe.com/test/webhooks

Para ambiente de dev, precisamos usar a CLI do Stripe
https://github.com/stripe/stripe-cli ou https://stripe.com/docs/stripe-cli

1. Baixa e instala o stripe
2. Loga
stripe login / enter
3. Roda para fazer o CLI ouvir eventos no Stripe: listen --forward-to localhost:3000/api/webhooks


- JAMStack -
Para criar aplicações completas sem depender de backend
Javascript API Markut (HTML)

CMS (Content Managment System)
- Wordpress | Drupal | Joomla | Magento (E-commerce)

Headless CMS (Painel de Admin. + API(HTTP, GraphQL, SDK))
- Strapi | Ghost | Keystone | GraphCMS | Prismic CMS | Contentful
- Saleor | Shopify