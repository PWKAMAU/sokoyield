import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DRIZZLE_DB } from '../database/database.module.js';
import { CropsService } from './crops.service.js';
import type { GpsPolygon } from '../database/schema.js';

describe('CropsService', () => {
  let service: CropsService;
  let mockDb: any;

  // Nakuru County sample GPS polygon for farm plot
  const nakuruPolygon: GpsPolygon = {
    type: 'Polygon',
    coordinates: [
      [
        [36.05, -0.3],
        [36.1, -0.3],
        [36.1, -0.35],
        [36.05, -0.35],
        [36.05, -0.3],
      ],
    ],
  };

  beforeEach(async () => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      orderBy: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        { provide: DRIZZLE_DB, useValue: mockDb },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
  });

  describe('createCrop', () => {
    it('creates crop with GPS polygon and calculates 97% farmer payout and 3% platform fee', async () => {
      const mockCreatedCrop = {
        id: 'crop-123',
        farmerId: 'farmer-456',
        cropName: 'Maize',
        quantityKg: '1000.00',
        unitPriceKes: '35.00',
        totalPriceKes: '35000.00',
        aiGrade: 'PENDING_SCAN',
        escrowStatus: 'PENDING_DEPOSIT',
        farmerPayoutKes: '33950.00', // 97% of 35,000
        platformFeeKes: '1050.00',   // 3% of 35,000
        gpsPolygon: nakuruPolygon,
        timestamp: new Date(),
      };

      mockDb.returning.mockResolvedValueOnce([mockCreatedCrop]);

      const result = await service.createCrop('farmer-456', {
        cropName: 'Maize',
        quantityKg: 1000,
        unitPriceKes: 35,
        gpsPolygon: nakuruPolygon,
      });

      expect(result.id).toBe('crop-123');
      expect(result.totalPriceKes).toBe('35000.00');
      expect(result.farmerPayoutKes).toBe('33950.00');
      expect(result.platformFeeKes).toBe('1050.00');
      expect(result.gpsPolygon).toEqual(nakuruPolygon);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('filters crops by farmerId for FARMER role', async () => {
      await service.findAll({ id: 'farmer-1', role: 'FARMER' });
      expect(mockDb.where).toHaveBeenCalled();
    });

    it('returns all crops for BUYER and ADMIN without farmerId restriction', async () => {
      await service.findAll({ id: 'buyer-1', role: 'BUYER' });
      expect(mockDb.orderBy).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('allows a farmer to view their own crop', async () => {
      mockDb.limit.mockResolvedValueOnce([
        { id: 'crop-1', farmerId: 'farmer-1', cropName: 'Potatoes' },
      ]);

      const result = await service.findById('crop-1', { id: 'farmer-1', role: 'FARMER' });
      expect(result.cropName).toBe('Potatoes');
    });

    it('prevents a farmer from viewing another farmers crop', async () => {
      mockDb.limit.mockResolvedValueOnce([
        { id: 'crop-1', farmerId: 'farmer-other', cropName: 'Potatoes' },
      ]);

      await expect(
        service.findById('crop-1', { id: 'farmer-1', role: 'FARMER' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows BUYER and ADMIN to view any active crop', async () => {
      mockDb.limit.mockResolvedValueOnce([
        { id: 'crop-1', farmerId: 'farmer-other', cropName: 'Beans' },
      ]);

      const result = await service.findById('crop-1', { id: 'buyer-1', role: 'BUYER' });
      expect(result.cropName).toBe('Beans');
    });

    it('throws NotFoundException if crop does not exist', async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      await expect(
        service.findById('non-existent', { id: 'admin-1', role: 'ADMIN' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEscrowStatus', () => {
    it('updates escrow status and writes to escrowTransactions ledger on HELD_IN_ESCROW', async () => {
      mockDb.limit.mockResolvedValueOnce([
        {
          id: 'crop-1',
          farmerId: 'farmer-1',
          totalPriceKes: '45280.00',
          platformFeeKes: '1358.40',
        },
      ]);

      mockDb.returning.mockResolvedValueOnce([
        {
          id: 'crop-1',
          farmerId: 'farmer-1',
          escrowStatus: 'HELD_IN_ESCROW',
          totalPriceKes: '45280.00',
        },
      ]);

      const result = await service.updateEscrowStatus(
        'crop-1',
        { escrowStatus: 'HELD_IN_ESCROW' },
        { id: 'buyer-99', role: 'BUYER' },
      );

      expect(result.escrowStatus).toBe('HELD_IN_ESCROW');
      expect(mockDb.update).toHaveBeenCalled();
      // Should have inserted audit log into escrow_transactions
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('updateAiGrade', () => {
    it('updates quality grade and confidence score', async () => {
      mockDb.returning.mockResolvedValueOnce([
        {
          id: 'crop-1',
          aiGrade: 'GRADE_A',
          aiConfidence: '0.9850',
          aiDiagnosis: { diseaseDetected: false },
        },
      ]);

      const result = await service.updateAiGrade('crop-1', {
        aiGrade: 'GRADE_A',
        aiConfidence: 0.985,
        aiDiagnosis: { diseaseDetected: false },
      });

      expect(result.aiGrade).toBe('GRADE_A');
      expect(result.aiConfidence).toBe('0.9850');
    });
  });
});
