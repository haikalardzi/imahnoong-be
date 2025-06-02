import dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'postgres',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',//TODO: add db user
    password: process.env.DB_PASS || 'postgres',//TODO: add db password
    database: process.env.DB_NAME || 'imahnoong-rc',//TODO: add db name
    port: process.env.DB_PORT || 5432,
  },
  migrations: {
    directory: '../db/migrations'
  },
  seeds: {
    directory: '../db/seeds'
  }
};