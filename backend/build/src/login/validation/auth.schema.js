"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateZodUserSchema = exports.createAdminSchema = exports.createZodUserSchema = exports.loginSchema = void 0;
// src/validation/auth.schema.ts
const zod_1 = require("zod");
// in auth controller
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(50),
    password: zod_1.z.string().min(6).max(128),
});
// in auth user controller
// roles only in admin
exports.createZodUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
    firstname: zod_1.z.string().optional(),
    lastname: zod_1.z.string().optional(),
    email: zod_1.z.email({ message: 'Invalid email address' }).optional(),
    phone: zod_1.z.array(zod_1.z.string()).optional(),
    AFM: zod_1.z.string()
        .regex(/^\d{9}$/, { message: 'AFM must be exactly 9 digits' })
        .optional(),
    building: zod_1.z.string().optional(),
    flat: zod_1.z.string().optional(),
    balance: zod_1.z.number().optional(),
    roles: zod_1.z.array(zod_1.z.enum(['USER'])).optional()
});
exports.createAdminSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' }),
    firstname: zod_1.z.string().optional(),
    lastname: zod_1.z.string().optional(),
    email: zod_1.z.email({ message: 'Invalid email address' }).optional(),
    phone: zod_1.z.array(zod_1.z.string()).optional(),
    AFM: zod_1.z.string()
        .regex(/^\d{9}$/, { message: 'AFM must be exactly 9 digits' })
        .optional(),
    building: zod_1.z.string().optional(),
    flat: zod_1.z.string().optional(),
    balance: zod_1.z.number().optional(),
    roles: zod_1.z.array(zod_1.z.enum(['ADMIN'])).optional(),
});
// Make all fields optional for update
exports.updateZodUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character' })
        .optional(),
    firstname: zod_1.z.string().optional(),
    lastname: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: 'Invalid email address' }).optional(),
    phone: zod_1.z.array(zod_1.z.string()).optional(),
    AFM: zod_1.z.string()
        .regex(/^\d{9}$/, { message: 'AFM must be exactly 9 digits' }) // ✅ 9 ψηφία για ελληνικό ΑΦΜ
        .optional(),
    building: zod_1.z.string().optional(),
    flat: zod_1.z.string().optional(),
    balance: zod_1.z.number().optional(),
    lastClearedMonth: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.array(zod_1.z.string()).optional(),
    uploadsMongo: zod_1.z.array(zod_1.z.string()).optional(),
    uploadsAppwrite: zod_1.z.array(zod_1.z.string()).optional(),
    roles: zod_1.z.array(zod_1.z.enum(['USER', 'ADMIN'])).optional()
});
//# sourceMappingURL=auth.schema.js.map