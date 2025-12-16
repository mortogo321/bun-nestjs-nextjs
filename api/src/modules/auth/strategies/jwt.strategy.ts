import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Extract from Authorization header (Bearer token)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 2. Extract from cookie
        (request: Request) => {
          const cookieName = configService.get<string>('JWT_COOKIE_NAME', 'access_token');
          return request?.cookies?.[cookieName] || null;
        },
        // 3. Extract from query parameter (for WebSocket or special cases)
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-super-secret-key-change-in-production'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
