import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RolesGuard } from './roles.guard.js';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user?: { role?: string }): ExecutionContext =>
    ({
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('allows access if no roles are required', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext({ role: 'FARMER' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access if user has the required role', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['FARMER']);
    const context = createMockContext({ role: 'FARMER' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access if user has one of several accepted roles', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['BUYER', 'ADMIN']);
    const context = createMockContext({ role: 'ADMIN' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws ForbiddenException if user has a different role', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const context = createMockContext({ role: 'FARMER' });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException if user has no role or is unauthenticated', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['FARMER']);
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
