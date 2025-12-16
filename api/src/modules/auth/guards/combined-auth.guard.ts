import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// Create the JWT AuthGuard class
const JwtAuthGuardClass = AuthGuard('jwt');

/**
 * Combined authentication guard that accepts either:
 * - JWT Bearer token (header or cookie)
 * - API Key (header: X-API-Key or Authorization: ApiKey xxx)
 */
@Injectable()
export class CombinedAuthGuard implements CanActivate {
  private jwtGuard: InstanceType<typeof JwtAuthGuardClass>;

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    this.jwtGuard = new JwtAuthGuardClass();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKey(request);

    // Try API Key authentication first
    if (apiKey) {
      if (this.authService.validateApiKey(apiKey)) {
        // Set a service user for API key auth
        (request as Request & { user: unknown }).user = {
          sub: 'api-key-user',
          email: 'service@api.local',
          roles: ['service'],
          isApiKey: true,
        };
        return true;
      }
    }

    // Try JWT authentication
    try {
      const canActivate = await this.jwtGuard.canActivate(context);
      if (canActivate) {
        return true;
      }
    } catch {
      // JWT auth failed, continue to throw combined error
    }

    throw new UnauthorizedException(
      'Authentication required. Provide either a valid JWT token (Bearer) or API key (X-API-Key header)',
    );
  }

  private extractApiKey(request: Request): string | null {
    // Check X-API-Key header
    const headerKey = request.headers['x-api-key'];
    if (headerKey && typeof headerKey === 'string') {
      return headerKey;
    }

    // Check Authorization header with ApiKey prefix
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('ApiKey ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
