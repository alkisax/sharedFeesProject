/* eslint-disable no-console */
 
// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication

import { authService } from '../services/auth.service';
import { userDAO } from '../dao/user.dao';
import type { Request, Response } from 'express';
import { handleControllerError } from '../../utils/error/errorHandler';
import { loginSchema } from '../validation/auth.schema';

export const login = async (req: Request, res: Response) => {
  try {
    // const username = req.body.username;
    // const password = req.body.password;
    const parsed = loginSchema.parse(req.body);
    const username = parsed.username;
    const password = parsed.password;

    // Step 1: Find the user by username
    const user = await userDAO.toServerByUsername(username);

    if(!user){
      console.log(`Failed login attempt with username: ${username}`);
      return res.status(401).json({ status: false, data: 'Invalid username or password' });
    }

    // Step 2: Check the password
    const isMatch = await authService.verifyPassword (password, user.hashedPassword);

    if(!isMatch){
      console.log(`Failed login attempt with username: ${username}`);
      return res.status(401).json({ status: false, message: 'Invalid username or password' });
    }

    // Step 3: Generate the token
    const token = authService.generateAccessToken(user);
    console.log(`User ${user.username} logged in successfully`);

    // Step 4: Return the token and user info
    return res.status(200).json({
      status: true,
      data: {
        token,
        user: {
          _id: user._id,
          id: user._id.toString(),
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          AFM: user.AFM,
          building: user.building,
          flat: user.flat,
          balance: user.balance,
          lastClearedMonth: user.lastClearedMonth,
          notes: user.notes,
          uploadsMongo: user.uploadsMongo?.map((id) => id.toString()),
          uploadsAppwrite: user.uploadsAppwrite,
          roles: user.roles,
          hasPassword: !!user.hashedPassword,
          provider: 'backend',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    })

  } catch (error) {
    return handleControllerError(res, error);
  }
};

//αυτο είναι για ένα endpoind που θα μας κάνει refresh το τοκεν (χρειαστικε για να έχει νεο payload σε διαφορ refresh τoυ front)
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ status: false, error: 'No token provided' });      
    }

    const verification = authService.verifyAccessToken(token);
    if (!verification.verified) {
      return res.status(401).json({ status: false, error: 'Invalid token' });
    }
    // Extract the payload from the verified token
    const payload = verification.data as { id: string };

    const refreshedDbUser = await userDAO.toServerById(payload.id);
    if (!refreshedDbUser) {
      return res.status(404).json({ status: false, error: 'User not found' });
    } 

    // create a minimal object compatible with IUser
    const userForToken = {
      _id: refreshedDbUser._id,
      id: refreshedDbUser._id.toString(),
      username: refreshedDbUser.username,
      firstname: refreshedDbUser.firstname ?? '',
      lastname: refreshedDbUser.lastname ?? '',
      email: refreshedDbUser.email ?? '',
      roles: refreshedDbUser.roles,
      hasPassword: !!refreshedDbUser.hashedPassword
    };

    const newToken = authService.generateAccessToken(userForToken);
    return res.status(200).json({ status: true, data: { token: newToken } });

  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const isLogedin = async (_req: Request, res: Response) => {
  return res.status(200).json({ status: true, message: 'is loged in' })
}

export const authController = {
  login,
  isLogedin,
  refreshToken,
};