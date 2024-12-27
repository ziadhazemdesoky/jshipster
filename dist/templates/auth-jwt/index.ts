import { Application } from 'express';
import { authRoutes } from './routes/auth.routes';

export function init(app: Application): void {
  app.use('/auth', authRoutes);
  console.log('Auth module initialized at /auth');
}
