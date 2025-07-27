import dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'postgres',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'imahnoong',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 5432,
  },
  migrations: {
    directory: '../db/migrations'
  },
  seeds: {
    directory: '../db/seeds'
  }
};