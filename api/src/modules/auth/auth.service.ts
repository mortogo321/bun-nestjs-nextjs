import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a JWT token for a user
   */
  generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload);
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  /**
   * Validate API key
   */
  validateApiKey(apiKey: string): boolean {
    const validApiKeys = this.getValidApiKeys();
    return validApiKeys.includes(apiKey);
  }

  /**
   * Get valid API keys from configuration
   */
  private getValidApiKeys(): string[] {
    const apiKeys = this.configService.get<string>('API_KEYS', '');
    if (!apiKeys) return [];
    return apiKeys.split(',').map(key => key.trim()).filter(Boolean);
  }

  /**
   * Generate a demo token for testing (remove in production)
   */
  generateDemoToken(): { accessToken: string; expiresIn: string } {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: 'demo-user-id',
      email: 'demo@example.com',
      roles: ['user'],
    };

    return {
      accessToken: this.generateToken(payload),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1d'),
    };
  }
}
