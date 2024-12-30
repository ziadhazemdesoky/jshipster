import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

const authService = new AuthService();

export class AuthController {
  public verify(req: Request, res: Response): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(400).json({ message: 'Token is required.' });
      return;
    }

    const payload = authService.verifyToken(token);

    if (payload) {
      res.status(200).json({ valid: true, payload });
    } else {
      res.status(401).json({ valid: false, message: 'Invalid token.' });
    }
  }
}
