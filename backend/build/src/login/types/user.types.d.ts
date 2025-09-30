import { Types } from 'mongoose';
import type { Request } from 'express';
export interface IUser {
    _id: Types.ObjectId;
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string[];
    AFM?: string;
    building?: string;
    flat?: string;
    balance?: number;
    lastClearedMonth?: Date;
    notes?: string[];
    uploadsMongo?: Types.ObjectId[];
    uploadsAppwrite?: string[];
    roles: Roles[];
    hashedPassword: string;
    hasPassword?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type Roles = 'USER' | 'ADMIN';
export interface UserView {
    id: string;
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string[];
    AFM?: string;
    building?: string;
    flat?: string;
    balance?: number;
    lastClearedMonth?: Date;
    notes?: string[];
    uploadsMongo?: string[];
    uploadsAppwrite?: string[];
    roles: Roles[];
    hasPassword?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUser {
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string[];
    AFM?: string;
    building?: string;
    flat?: string;
    balance?: number;
    password: string;
    roles?: Roles[];
}
export interface CreateUserHash {
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string[];
    AFM?: string;
    building?: string;
    flat?: string;
    balance?: number;
    hashedPassword: string;
    roles?: Roles[];
}
export interface UpdateUser {
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string[];
    AFM?: string;
    building?: string;
    flat?: string;
    balance?: number;
    lastClearedMonth?: Date;
    notes?: string[];
    uploadsMongo?: Types.ObjectId[];
    uploadsAppwrite?: string[];
    roles?: Roles[];
    password?: string;
    hashedPassword?: string;
}
export interface AuthRequest extends Request {
    user?: UserView;
}
export interface JwtPayloadUser {
    id: string;
    username: string;
    email?: string;
    roles: Roles[];
    hasPassword: boolean;
}
