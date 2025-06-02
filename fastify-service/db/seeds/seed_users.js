import bcrypt from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('users').del();

  const hash = bcrypt.hashSync('imahnoong', 12);

  await knex('users').insert([
    { 
      username: 'admin', 
      password: hash,
      role: 'admin'
    }
  ]);
}