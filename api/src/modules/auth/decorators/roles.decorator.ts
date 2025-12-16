import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 *
 * @example
 * @Roles('admin')
 * @Get('admin-only')
 * adminOnly() {}
 *
 * @example
 * @Roles('admin', 'moderator')
 * @Get('staff-only')
 * staffOnly() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
