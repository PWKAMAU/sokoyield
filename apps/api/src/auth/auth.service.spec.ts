import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DRIZZLE_DB } from '../database/database.module.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let mockDb: any;
  let mockJwt: any;

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    };

    mockJwt = {
      sign: vi.fn().mockReturnValue('mock_jwt_token_xyz'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DRIZZLE_DB, useValue: mockDb },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('requires a phone number for Farmer registration', async () => {
      await expect(
        service.register({
          role: 'FARMER',
          fullName: 'Juma Farmer',
          password: 'password123',
          county: 'Nakuru County',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('requires an email address for Buyer registration', async () => {
      await expect(
        service.register({
          role: 'BUYER',
          fullName: 'Soko Buyer Ltd',
          password: 'password123',
          county: 'Nairobi',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('successfully registers a Farmer with E.164 phone and hashes password', async () => {
      mockDb.limit.mockResolvedValueOnce([]); // No existing user
      mockDb.returning.mockResolvedValueOnce([
        {
          id: 'user-uuid-1',
          role: 'FARMER',
          fullName: 'Kamau Njoroge',
          phone: '+254119348818',
          email: null,
          county: 'Nakuru County',
        },
      ]);

      const result = await service.register({
        role: 'FARMER',
        fullName: 'Kamau Njoroge',
        phone: '+254119348818',
        password: 'securePassword123',
        county: 'Nakuru County',
      });

      expect(result.accessToken).toBe('mock_jwt_token_xyz');
      expect(result.user.role).toBe('FARMER');
      expect(result.user.phone).toBe('+254119348818');
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('throws ConflictException if phone number is already registered', async () => {
      mockDb.limit.mockResolvedValueOnce([
        {
          id: 'existing-id',
          phone: '+254119348818',
          email: null,
        },
      ]);

      await expect(
        service.register({
          role: 'FARMER',
          fullName: 'Another Farmer',
          phone: '+254119348818',
          password: 'password123',
          county: 'Nakuru County',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('successfully logs in with valid phone and password', async () => {
      const hashedPassword = await bcrypt.hash('secretPass', 10);
      mockDb.limit.mockResolvedValueOnce([
        {
          id: 'farmer-uuid',
          role: 'FARMER',
          fullName: 'Kamau',
          phone: '+254119348818',
          email: null,
          county: 'Nakuru County',
          passwordHash: hashedPassword,
        },
      ]);

      const result = await service.login({
        identifier: '+254119348818',
        password: 'secretPass',
      });

      expect(result.accessToken).toBe('mock_jwt_token_xyz');
      expect(result.user.fullName).toBe('Kamau');
    });

    it('rejects login with wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctPass', 10);
      mockDb.limit.mockResolvedValueOnce([
        {
          id: 'farmer-uuid',
          role: 'FARMER',
          passwordHash: hashedPassword,
        },
      ]);

      await expect(
        service.login({
          identifier: '+254119348818',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects login if user is not found', async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      await expect(
        service.login({
          identifier: 'nonexistent@sokoyield.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
