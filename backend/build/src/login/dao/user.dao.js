"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDAO = exports.toUserDAO = void 0;
const users_models_1 = __importDefault(require("../models/users.models"));
// Response DAO (safe to send to client, no hashed pass)
const toUserDAO = (user) => {
    return {
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
        hasPassword: user.hasPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};
exports.toUserDAO = toUserDAO;
const create = async (userData) => {
    try {
        const user = new users_models_1.default({
            username: userData.username,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            phone: userData.phone,
            AFM: userData.AFM,
            building: userData.building,
            flat: userData.flat,
            balance: userData.balance,
            roles: userData.roles ?? ['USER'],
            hashedPassword: userData.hashedPassword
        });
        const response = await user.save();
        if (!response) {
            throw new Error("Error saving user: empty response from Mongo");
        }
        return (0, exports.toUserDAO)(response);
    }
    catch (err) {
        console.error("❌ Error creating user:", err);
        // Handle duplicate key errors gracefully
        if (err &&
            typeof err === "object" &&
            "code" in err &&
            err.code === 11000) {
            const dupField = Object.keys(err.keyValue || {})[0];
            throw new Error(`Duplicate key error: ${dupField} already exists`);
        }
        throw err;
    }
};
const readAll = async () => {
    const users = await users_models_1.default.find();
    return users.map((u) => (0, exports.toUserDAO)(u));
};
const readById = async (userId) => {
    const user = await users_models_1.default.findById(userId);
    if (!user)
        throw new Error('User not found');
    return (0, exports.toUserDAO)(user);
};
const readByUsername = async (username) => {
    const user = await users_models_1.default.findOne({ username });
    if (!user)
        throw new Error(`User with username ${username} not found`);
    return (0, exports.toUserDAO)(user);
};
const toServerById = async (userId) => {
    const user = await users_models_1.default.findById(userId);
    if (!user)
        throw new Error('User not found');
    return user;
};
const toServerByEmail = async (email) => {
    const user = await users_models_1.default.findOne({ email });
    return user ? user : null;
};
const toServerByUsername = async (username) => {
    const user = await users_models_1.default.findOne({ username });
    return user ? user : null;
};
const update = async (userId, userData) => {
    const response = await users_models_1.default.findByIdAndUpdate(userId, userData, { new: true });
    if (!response)
        throw new Error('User does not exist');
    return (0, exports.toUserDAO)(response);
};
const toggleRoleById = async (userId) => {
    const user = await users_models_1.default.findById(userId);
    if (!user)
        return null;
    user.roles = user.roles.includes('ADMIN') ? ['USER'] : ['ADMIN'];
    user.markModified('roles');
    await user.save({ validateBeforeSave: false });
    return (0, exports.toUserDAO)(user);
};
const deleteById = async (userId) => {
    const response = await users_models_1.default.findByIdAndDelete(userId);
    if (!response) {
        const error = new Error('User does not exist');
        error.status = 404;
        throw error;
    }
    return (0, exports.toUserDAO)(response);
};
// Increment user balance by a given amount
const incrementBalance = async (userId, amount) => {
    const response = await users_models_1.default.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true });
    if (!response)
        throw new Error('User not found');
    return (0, exports.toUserDAO)(response);
};
// Find user by building + flat (server-side, raw model)
const toServerByBuildingAndFlat = async (building, flat) => {
    const user = await users_models_1.default.findOne({ building, flat });
    return user ? user : null;
};
exports.userDAO = {
    toUserDAO: exports.toUserDAO,
    create,
    readAll,
    readById,
    readByUsername,
    toServerById,
    toServerByEmail,
    toServerByUsername,
    update,
    toggleRoleById,
    deleteById,
    incrementBalance,
    toServerByBuildingAndFlat
};
//# sourceMappingURL=user.dao.js.map