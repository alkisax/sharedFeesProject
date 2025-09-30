import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const createZodUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    phone: z.ZodOptional<z.ZodArray<z.ZodString>>;
    AFM: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodString>;
    flat: z.ZodOptional<z.ZodString>;
    balance: z.ZodOptional<z.ZodNumber>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        USER: "USER";
    }>>>;
}, z.core.$strip>;
export declare const createAdminSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    phone: z.ZodOptional<z.ZodArray<z.ZodString>>;
    AFM: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodString>;
    flat: z.ZodOptional<z.ZodString>;
    balance: z.ZodOptional<z.ZodNumber>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
    }>>>;
}, z.core.$strip>;
export declare const updateZodUserSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodArray<z.ZodString>>;
    AFM: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodString>;
    flat: z.ZodOptional<z.ZodString>;
    balance: z.ZodOptional<z.ZodNumber>;
    lastClearedMonth: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    uploadsMongo: z.ZodOptional<z.ZodArray<z.ZodString>>;
    uploadsAppwrite: z.ZodOptional<z.ZodArray<z.ZodString>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>>;
}, z.core.$strip>;
