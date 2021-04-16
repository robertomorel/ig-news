import { Client } from 'faunadb';

// Acesso ao Fauna, criando uma instância do Client
export const fauna = new Client({
  secret: process.env.FAUNADB_SECRET_KEY
});