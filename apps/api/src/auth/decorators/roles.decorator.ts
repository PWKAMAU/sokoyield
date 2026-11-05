import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../database/schema.js';

export const ROLES_KEY = 'roles';

/**
 * Decorator to enforce Role-Based Access Control on endpoints.
 * Example: `@Roles('FARMER')` or `@Roles('BUYER', 'ADMIN')`
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
