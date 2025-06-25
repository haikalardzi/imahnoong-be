import { createUser, findUserByUsername, verifyPassword } from './user.service.js';

export async function registerHandler(req, reply) {
  try {
    const { username, password } = req.body;

    const existing = await findUserByUsername(username);
    if (existing) {
      return reply.code(400).send({ error: 'User already exists' });
    }

    const newUser = await createUser(username, password);

    const accessToken = await reply.jwtSign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      { expiresIn: '15m' }
    );

    const refreshToken = await reply.jwtSign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      { expiresIn: '7d' }
    );

    reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })
      .send({ accessToken });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}


/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 * @returns 
 */
export async function loginHandler(req, reply) {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user || !verifyPassword(password, user.password)) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    if (user.disable) return reply.code(401).send({ error: 'User is disabled' });
  
    const accessToken = req.server.jwt.sign({ id: user.id, username: user.username, role: user.role }, { expiresIn: '15m' });
    const refreshToken = req.server.jwt.sign({ id: user.id, username: user.username, role: user.role }, { expiresIn: '7d' });
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    }).send({ accessToken });
  } catch (err) {
    // print now
    reply.code(500).send({ error: err.message });
  }
}

/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 * @returns 
 */
export async function logoutHandler(req, reply) {
  try {
    reply.clearCookie('refreshToken', { 
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/' }).send({ message: 'Logged out' });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
}

/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 * @returns 
 */
export async function refreshTokenHandler(req, reply) {
  try {
    await req.jwtVerify({ onlyCookie: true }); // ✅ uses cookie instead of header
    const payload = req.user;

    const newAccessToken = req.server.jwt.sign(payload, { expiresIn: '15m' });
    reply.send({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    reply.code(401).send({ message: 'Invalid refresh token' });
  }
}