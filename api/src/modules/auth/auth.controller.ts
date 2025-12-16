import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtPayload } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('demo-token')
  @Public()
  @ApiOperation({
    summary: 'Generate demo token',
    description: 'Generate a demo JWT token for testing. Remove this endpoint in production.',
  })
  @ApiResponse({
    status: 201,
    description: 'Demo token generated',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        expiresIn: { type: 'string', example: '1d' },
      },
    },
  })
  generateDemoToken() {
    return this.authService.generateDemoToken();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get the current authenticated user from JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    schema: {
      type: 'object',
      properties: {
        sub: { type: 'string', example: 'user-123' },
        email: { type: 'string', example: 'user@example.com' },
        roles: { type: 'array', items: { type: 'string' }, example: ['user'] },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentUser(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
