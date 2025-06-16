import db from '../../../config/db.js';
import bcrypt from 'bcryptjs';

export async function createUser(username, password) {
  const hashed = bcrypt.hashSync(password, 12);
  return db('users').insert({ username, password: hashed, role: 'user' });
}

export async function getAllUsers() {
  return db('users').select(['id', 'username', 'role', 'disable']).orderBy('id', 'asc');    
}

export async function editUser(id, username, role, disable) {
  return db('users').where({ id }).update({ username, role, disable });
}

export async function deleteUser(id) {
  return db('users').where({ id }).update({ is_deleted: true });  
}