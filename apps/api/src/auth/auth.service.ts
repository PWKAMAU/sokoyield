import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.module.js';
import { users, type UserRole } from '../database/schema.js';
import type { AuthResponseDto, LoginDto, RegisterDto } from './dto/auth.dto.js';
import type { JwtPayload } from './jwt.strategy.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DRIZZLE_DB) private readonly db: DrizzleDb,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.seedSuperAdmin();
    } catch (err) {
      this.logger.warn(`Superadmin provisioning deferred: ${(err as Error).message}`);
    }
  }

  async seedSuperAdmin(): Promise<void> {
    const adminEmail = 'pitakamau18@gmail.com';
    const rawPassword = 'Approx@22';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existing.length > 0) {
      await this.db
        .update(users)
        .set({
          role: 'ADMIN',
          passwordHash,
          fullName: 'Peter Kamau (Superadmin)',
          updatedAt: new Date(),
        })
        .where(eq(users.email, adminEmail));
      this.logger.log(`Superadmin synced: ${adminEmail} (role: ADMIN)`);
    } else {
      await this.db.insert(users).values({
        role: 'ADMIN',
        email: adminEmail,
        phone: '+254119348818',
        passwordHash,
        fullName: 'Peter Kamau (Superadmin)',
        county: 'Nakuru County',
      });
      this.logger.log(`Superadmin created: ${adminEmail} (role: ADMIN)`);
    }
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    if (dto.role === 'FARMER' && !dto.phone) {
      throw new BadRequestException('Phone number is required for Farmer accounts');
    }

    if ((dto.role === 'BUYER' || dto.role === 'ADMIN') && !dto.email) {
      throw new BadRequestException('Email address is required for Buyer and Admin accounts');
    }

    // Check if user already exists
    const existing = await this.db
      .select()
      .from(users)
      .where(
        or(
          dto.phone ? eq(users.phone, dto.phone) : undefined,
          dto.email ? eq(users.email, dto.email) : undefined,
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      const match = existing[0];
      if (dto.phone && match.phone === dto.phone) {
        throw new ConflictException('A user with this phone number already exists');
      }
      if (dto.email && match.email === dto.email) {
        throw new ConflictException('A user with this email address already exists');
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Insert user into PostgreSQL
    const [newUser] = await this.db
      .insert(users)
      .values({
        role: dto.role as UserRole,
        fullName: dto.fullName,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        passwordHash,
        county: dto.county ?? 'Nakuru County',
      })
      .returning();

    return this.createAuthResponse(newUser);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const isEmail = dto.identifier.includes('@');

    const [user] = await this.db
      .select()
      .from(users)
      .where(isEmail ? eq(users.email, dto.identifier) : eq(users.phone, dto.identifier))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createAuthResponse(user);
  }

  async validateUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    const { passwordHash: _, ...result } = user;
    return result;
  }

  private createAuthResponse(user: {
    id: string;
    role: UserRole;
    fullName: string;
    phone: string | null;
    email: string | null;
    county: string | null;
  }): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      fullName: user.fullName,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        county: user.county,
      },
    };
  }
}
