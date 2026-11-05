import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Env } from '../config/env.schema.js';
import type { UserRole } from '../database/schema.js';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  phone?: string | null;
  email?: string | null;
  fullName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'sokoyield_super_secret_jwt_key_2026'),
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid JWT token claims');
    }
    return {
      id: payload.sub,
      role: payload.role,
      phone: payload.phone,
      email: payload.email,
      fullName: payload.fullName,
    };
  }
}
