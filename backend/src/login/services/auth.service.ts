/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request } from 'express';
import type {  IUser, JwtPayloadUser } from '../types/user.types';

import { userDAO } from '../dao/user.dao';

const generateAccessToken = (
  user: Pick<IUser, '_id' | 'username' | 'email' | 'roles' | 'hasPassword'> 
): string => {
  const payload: JwtPayloadUser = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    roles: user.roles,
    hasPassword: !!user.hasPassword
  }

  const secret = process.env.JWT_SECRET;
 
  if (!secret) {
    throw new Error('JWT secret is not defined in environment variables');
  }

  const options: SignOptions = {
    expiresIn: '1h'
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

type VerifyAccessTokenResult =
  | { verified: true; data: string | JwtPayload }
  | { verified: false; data: string };

const verifyAccessToken = (token: string): VerifyAccessTokenResult => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret is not defined in environment variables');
  }
  
  try {
    const payload = jwt.verify(token, secret);
    return { 
      verified: true, data: payload
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { verified: false, data: error.message };   
    } else {
      return { verified: false, data: 'unknown error' };
    }
  }
};

const verifyAndFetchUser = async (token: string) => {
  const verification = verifyAccessToken(token);
  if (!verification.verified) {
    return { verified: false, reason: verification.data };
  }

  const payload = verification.data as { id: string };
  try {
    const user = await userDAO.readById(payload.id);
    return { verified: true, user };
  } catch {
    return { verified: false, reason: 'User not found' };
  }
};

const getTokenFrom = (req: Request): string | null => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.replace('Bearer ', '');
    return token;    
  }
  return null;
};

export const authService = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken,
  verifyAndFetchUser,
  getTokenFrom,
};