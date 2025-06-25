export default async function requireAdmin(request, reply) {
  try {
    await request.jwtVerify({ onlyCookie: true });
    
    if (request.user.role !== 'admin') {
      reply.code(403).send({ 
        error: 'Admin privileges required' 
      });
    }
  } catch (err) {
    reply.code(401).send({ 
      error: 'Authentication failed',
      message: err.message 
    });
  }
};