import authRoutes from './auth.routes.js';

export default async function registerAuthFeature(app) {
  app.register(authRoutes, { prefix: '/auth' });
}