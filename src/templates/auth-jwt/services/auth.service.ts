import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'defaultSecret';
const TOKEN_EXPIRATION = '1h';

export class AuthService {
  /**
   * Generate a JWT for the given user payload.
   */
  public generateToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
  }

  /**
   * Verify the validity of a JWT.
   */
  public verifyToken(token: string): object | null {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  /**
   * Mock function to verify user credentials.
   */
  public verifyCredentials(username: string, password: string): boolean {
    // Replace with real user validation (e.g., database query)
    return username === 'admin' && password === 'password';
  }
}
