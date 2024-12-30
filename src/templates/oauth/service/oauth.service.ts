import jwt from 'jsonwebtoken';
import { IRepository } from '../repositories/repository.interface';
import { UserDTO } from '../dtos/user.dto';

export class OAuthService {
  private repository: IRepository<UserDTO>;
  private secret = process.env.JWT_SECRET || 'defaultSecret';
  private expiresIn = '1h';

  constructor(repository: IRepository<UserDTO>) {
    this.repository = repository;
  }

  async authenticate(credentials: { username?: string; password?: string; provider?: string; externalId?: string }): Promise<string> {
    let user: UserDTO | null = null;

    if (credentials.provider && credentials.externalId) {
      // Query by provider and externalId
      user = await this.repository.findByProvider(credentials.provider, credentials.externalId);

      if (!user) {
        user = await this.repository.create({
          provider: credentials.provider,
          externalId: credentials.externalId,
        });
      }
    } else if (credentials.username && credentials.password) {
      // Query by username
      user = await this.repository.findByUsername(credentials.username);

      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid username or password');
      }
    }

    if (!user) {
      throw new Error('Authentication failed');
    }

    // Generate JWT token
    return jwt.sign({ username: user.username, provider: user.provider }, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  async refreshToken(refreshToken: string): Promise<string> {
    // Mock implementation: Validate and generate a new token
    const payload = jwt.verify(refreshToken, this.secret);
    return jwt.sign(payload as object, this.secret, { expiresIn: this.expiresIn });
  }
}
