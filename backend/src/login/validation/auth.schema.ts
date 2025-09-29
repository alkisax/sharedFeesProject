// src/validation/auth.schema.ts
import { z } from 'zod';

// in auth controller
export const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(128),
});

// in auth user controller
// roles only in admin
export const createZodUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.email({ message: 'Invalid email address' }).optional(),
  phone: z.array(z.string()).optional(),
  AFM: z.string()
    .regex(/^\d{9}$/, { message: 'AFM must be exactly 9 digits' })
    .optional(),
  building: z.string().optional(),
  flat: z.string().optional(),
  balance: z.number().optional(),
  roles: z.array(z.enum(['USER'])).optional()
})

export const createAdminSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.email({ message: 'Invalid email address' }).optional(),
  phone: z.array(z.string()).optional(),
  AFM: z.string()
    .regex(/^\d{9}$/, { message: 'AFM must be exactly 9 digits' })
    .optional(),
  building: z.string().optional(),
  flat: z.string().optional(),
  balance: z.number().optional(),
  roles: z.array(z.enum(['ADMIN'])).optional(),
});

// Make all fields optional for update
export const updateZodUserSchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
    .optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  phone: z.array(z.string()).optional(),
  AFM: z.string()
    .regex(/^\d{9}$/, { message: 'AFM must be exactly 9 digits' }) // ✅ 9 ψηφία για ελληνικό ΑΦΜ
    .optional(),
  building: z.string().optional(),
  flat: z.string().optional(),
  balance: z.number().optional(),
  lastClearedMonth: z.coerce.date().optional(),
  notes: z.array(z.string()).optional(),
  uploadsMongo: z.array(z.string()).optional(),
  uploadsAppwrite: z.array(z.string()).optional(),
  roles: z.array(z.enum(['USER', 'ADMIN'])).optional()
});

