import db from '../../../config/db.js';
import bcrypt from 'bcryptjs';

export async function createUser(username, password) {
  const hashed = bcrypt.hashSync(password, 12);
  return db('users').insert({ username, password: hashed, role: 'user' });
}

export async function findUserByUsername(username) {
  return db('users').where({ username }).first();
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}