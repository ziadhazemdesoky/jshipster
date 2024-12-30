import { Application } from 'express';
import oauthRoutes from '../../routes/oauth.routes';

export function init(app: Application): void {
  app.use('/oauth', oauthRoutes);
  console.log('OAuth module initialized at /oauth');
}