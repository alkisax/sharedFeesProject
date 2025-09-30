"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
/* eslint-disable no-console */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_dao_1 = require("../dao/user.dao");
const generateAccessToken = (user) => {
    const payload = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        roles: user.roles,
        hasPassword: !!user.hasPassword
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined in environment variables');
    }
    const options = {
        expiresIn: '1h'
    };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    return token;
};
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt_1.default.compare(password, hashedPassword);
};
const verifyAccessToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined in environment variables');
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        return {
            verified: true, data: payload
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return { verified: false, data: error.message };
        }
        else {
            return { verified: false, data: 'unknown error' };
        }
    }
};
const verifyAndFetchUser = async (token) => {
    const verification = verifyAccessToken(token);
    if (!verification.verified) {
        return { verified: false, reason: verification.data };
    }
    const payload = verification.data;
    try {
        const user = await user_dao_1.userDAO.readById(payload.id);
        return { verified: true, user };
    }
    catch {
        return { verified: false, reason: 'User not found' };
    }
};
const getTokenFrom = (req) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.replace('Bearer ', '');
        return token;
    }
    return null;
};
exports.authService = {
    generateAccessToken,
    verifyPassword,
    verifyAccessToken,
    verifyAndFetchUser,
    getTokenFrom,
};
//# sourceMappingURL=auth.service.js.map