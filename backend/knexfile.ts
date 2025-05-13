// backend/knexfile.ts
import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

// Carica le variabili da .env (es. DB_HOST, DB_USER, ecc.)
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     Number(process.env.DB_PORT) || 5432,
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME     || 'crm_flipbook_dev',
    },
    migrations: {
      directory: './backend/src/db/migrations',
      tableName: 'knex_migrations',
    },
    // opzionale: directory per seed
    seeds: {
      directory: './backend/src/db/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT),
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:      { rejectUnauthorized: false },
    },
    migrations: {
      directory: './backend/src/db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './backend/src/db/seeds',
    },
  },
};

module.exports = config;
