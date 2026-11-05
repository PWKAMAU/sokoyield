import { z } from 'zod';

/**
 * GeoJSON LinearRing: at least 4 coordinates [longitude, latitude], first and last must be identical.
 */
const coordinatePairSchema = z.tuple([z.number(), z.number()]);
const linearRingSchema = z.array(coordinatePairSchema).min(4, 'Polygon ring must have at least 4 coordinates');

export const gpsPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(linearRingSchema).min(1, 'Polygon must have at least one linear ring'),
  properties: z.record(z.unknown()).optional(),
});

export const createCropSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required (e.g. Maize, Potatoes, Beans)'),
  quantityKg: z.coerce.number().positive('Quantity in kg must be greater than 0'),
  unitPriceKes: z.coerce.number().positive('Unit price in KES must be greater than 0'),
  gpsPolygon: gpsPolygonSchema,
  photoUrl: z.string().url('Photo URL must be a valid URL').optional(),
  aiGrade: z
    .enum(['PENDING_SCAN', 'GRADE_A', 'GRADE_B', 'GRADE_C', 'REJECTED'])
    .optional(),
  timestamp: z.string().datetime().optional(),
});

export type CreateCropDto = z.infer<typeof createCropSchema>;

export const updateEscrowStatusSchema = z.object({
  escrowStatus: z.enum([
    'PENDING_DEPOSIT',
    'HELD_IN_ESCROW',
    'DELIVERED_PENDING_CONFIRMATION',
    'RELEASED_TO_FARMER',
    'DISPUTED',
    'REFUNDED',
  ]),
  buyerId: z.string().uuid().optional(),
});

export type UpdateEscrowStatusDto = z.infer<typeof updateEscrowStatusSchema>;

export const updateAiGradeSchema = z.object({
  aiGrade: z.enum(['GRADE_A', 'GRADE_B', 'GRADE_C', 'REJECTED']),
  aiConfidence: z.number().min(0).max(1).optional(),
  aiDiagnosis: z
    .object({
      diseaseDetected: z.boolean().optional(),
      diseaseName: z.string().optional(),
      pathologyNotes: z.string().optional(),
      qualityCertUrl: z.string().optional(),
    })
    .optional(),
});

export type UpdateAiGradeDto = z.infer<typeof updateAiGradeSchema>;
