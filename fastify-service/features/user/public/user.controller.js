import { createUser, findUserByUsername, verifyPassword } from './user.service.js';

export async function registerHandler(req, reply) {
  try {
    const { username, password } = req.body;
    const existing = await findUserByUsername(username);
    if (existing) return reply.code(400).send({ error: 'User already exists' });
    await createUser(username, password);
    reply.send({ message: 'User registered' });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}

export async function loginHandler(req, reply) {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user || !verifyPassword(password, user.password)) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
  
    const token = await reply.jwtSign({ id: user.id, username: user.username, role: user.role });
    reply.send({ token });
  } catch (err) {
    // print now
    reply.code(500).send({ error: err.message });
  }
}