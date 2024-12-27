import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  /**
   * Handle user login and return a JWT.
   */
  public login(req: Request, res: Response): void {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    if (authService.verifyCredentials(username, password)) {
      const token = authService.generateToken({ username });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  }

  /**
   * Verify the provided JWT.
   */
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
