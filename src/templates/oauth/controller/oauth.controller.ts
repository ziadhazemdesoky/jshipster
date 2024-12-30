import { Request, Response } from 'express';
import { OAuthService } from '../services/oauth.service';

export class OAuthController {
  private oauthService: OAuthService;

  constructor() {
    this.oauthService = new OAuthService();
  }

  async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const token = await this.oauthService.authenticate(req.body);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = await this.oauthService.refreshToken(req.body.refreshToken);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
