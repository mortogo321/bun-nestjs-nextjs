import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark routes as public (no authentication required)
 * Use this on controllers or individual route handlers
 *
 * @example
 * @Public()
 * @Get('public-endpoint')
 * publicEndpoint() {}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
