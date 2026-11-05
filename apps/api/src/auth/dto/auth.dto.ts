import { z } from 'zod';

export const registerSchema = z.object({
  role: z.enum(['FARMER', 'BUYER', 'ADMIN']).default('FARMER'),
  fullName: z.string().min(2, 'Full name must have at least 2 characters'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number (must be E.164 compliant, e.g. +254...)')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  county: z.string().default('Nakuru County'),
}).refine((data) => data.phone || data.email, {
  message: 'Either phone or email must be provided',
  path: ['phone'],
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Identifier (phone or email) is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    role: 'FARMER' | 'BUYER' | 'ADMIN';
    fullName: string;
    phone: string | null;
    email: string | null;
    county: string | null;
  };
}
