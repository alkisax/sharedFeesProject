"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.refreshToken = exports.login = void 0;
// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication
const auth_service_1 = require("../services/auth.service");
const user_dao_1 = require("../dao/user.dao");
const errorHandler_1 = require("../../utils/error/errorHandler");
const auth_schema_1 = require("../validation/auth.schema");
const login = async (req, res) => {
    try {
        // const username = req.body.username;
        // const password = req.body.password;
        const parsed = auth_schema_1.loginSchema.parse(req.body);
        const username = parsed.username;
        const password = parsed.password;
        // Step 1: Find the user by username
        const user = await user_dao_1.userDAO.toServerByUsername(username);
        if (!user) {
            console.log(`Failed login attempt with username: ${username}`);
            return res.status(401).json({ status: false, data: 'Invalid username or password' });
        }
        // Step 2: Check the password
        const isMatch = await auth_service_1.authService.verifyPassword(password, user.hashedPassword);
        if (!isMatch) {
            console.log(`Failed login attempt with username: ${username}`);
            return res.status(401).json({ status: false, message: 'Invalid username or password' });
        }
        // Step 3: Generate the token
        const token = auth_service_1.authService.generateAccessToken(user);
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
        });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.login = login;
//αυτο είναι για ένα endpoind που θα μας κάνει refresh το τοκεν (χρειαστικε για να έχει νεο payload σε διαφορ refresh τoυ front)
const refreshToken = async (req, res) => {
    try {
        const token = req.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ status: false, error: 'No token provided' });
        }
        const verification = auth_service_1.authService.verifyAccessToken(token);
        if (!verification.verified) {
            return res.status(401).json({ status: false, error: 'Invalid token' });
        }
        // Extract the payload from the verified token
        const payload = verification.data;
        const refreshedDbUser = await user_dao_1.userDAO.toServerById(payload.id);
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
        const newToken = auth_service_1.authService.generateAccessToken(userForToken);
        return res.status(200).json({ status: true, data: { token: newToken } });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.refreshToken = refreshToken;
exports.authController = {
    login: exports.login,
    refreshToken: exports.refreshToken,
};
//# sourceMappingURL=auth.controller.js.map