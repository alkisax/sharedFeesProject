"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.getMyBalance = exports.getUserBalance = exports.deleteById = exports.updateById = exports.toggleRoleById = exports.readByEmail = exports.readByUsername = exports.readById = exports.findAll = exports.createAdmin = exports.createUser = void 0;
/* eslint-disable no-console */
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_models_1 = __importDefault(require("../models/users.models"));
const errorHandler_1 = require("../../utils/error/errorHandler");
const user_dao_1 = require("../dao/user.dao");
const bill_dao_1 = require("../../bill/dao/bill.dao");
const auth_schema_1 = require("../validation/auth.schema");
// δεν χρειάζετε return type γιατι το κάνει το dao
// create
// signup
const createUser = async (req, res) => {
    try {
        // Omit γιατί εδώ έχουμε δημιουργία χρήστη οπότε πετάμε οτι και να μας έστειλε ως ρολο το φροντ και επιβάλουμε hardcoded user (λιγο παρακάτω)
        const data = auth_schema_1.createZodUserSchema.omit({ roles: true }).parse(req.body);
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const existingUser = await users_models_1.default.findOne({ username: data.username });
        if (existingUser) {
            return res.status(409).json({ status: false, message: 'Username already taken' });
        }
        if (data.email) {
            const existingEmail = await users_models_1.default.findOne({ email: data.email });
            if (existingEmail) {
                return res.status(409).json({ status: false, message: 'Email already taken' });
            }
        }
        const newUser = await user_dao_1.userDAO.create({
            username: data.username,
            firstname: data.firstname ?? '',
            lastname: data.lastname ?? '',
            email: data.email?.trim() || undefined,
            phone: data.phone,
            AFM: data.AFM,
            building: data.building,
            flat: data.flat,
            balance: data.balance,
            roles: ['USER'], // always user
            hashedPassword
        });
        return res.status(201).json({ status: true, data: newUser });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.createUser = createUser;
// create admin
const createAdmin = async (req, res) => {
    try {
        const data = auth_schema_1.createAdminSchema.parse(req.body); // Εδώ γίνεται το validation
        if (!data.username || !data.password) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const existingUser = await users_models_1.default.findOne({ username: data.username });
        if (existingUser) {
            return res.status(409).json({ status: false, message: 'Username already taken' });
        }
        if (data.email) {
            const existingEmail = await users_models_1.default.findOne({ email: data.email });
            if (existingEmail) {
                return res.status(409).json({ status: false, message: 'Email already taken' });
            }
        }
        const newUser = await user_dao_1.userDAO.create({
            username: data.username,
            firstname: data.firstname ?? '',
            lastname: data.lastname ?? '',
            email: data.email ?? '',
            phone: data.phone,
            AFM: data.AFM,
            building: data.building,
            flat: data.flat,
            balance: data.balance,
            roles: ['ADMIN'], // always admin
            hashedPassword
        });
        console.log(`Created new admin: ${data.username}`);
        return res.status(201).json({ status: true, data: newUser });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.createAdmin = createAdmin;
// read
const findAll = async (_req, res) => {
    try {
        const users = await user_dao_1.userDAO.readAll();
        return res.status(200).json({ status: true, data: users });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.findAll = findAll;
const readById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: false, message: 'no Id provided' });
        }
        const user = await user_dao_1.userDAO.readById(userId);
        return res.status(200).json({ status: true, data: user });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.readById = readById;
const readByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(400).json({ status: false, message: 'no username provided' });
        }
        const user = await user_dao_1.userDAO.readByUsername(username);
        return res.status(200).json({ status: true, data: user });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.readByUsername = readByUsername;
const readByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json({ status: false, message: 'Email is required' });
        }
        const user = await user_dao_1.userDAO.toServerByEmail(email);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        return res.status(200).json({ status: true, data: user });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.readByEmail = readByEmail;
// update
const toggleRoleById = async (req, res) => {
    const userIdToUpdate = req.params.id;
    const requestingUser = req.user;
    if (!requestingUser) {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
    if (requestingUser.id === userIdToUpdate) {
        return res.status(400).json({ status: false, message: 'You cannot remove your own admin role' });
    }
    try {
        const updatedUser = await user_dao_1.userDAO.toggleRoleById(userIdToUpdate);
        if (!updatedUser) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        return res.status(200).json({ status: true, data: updatedUser });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.toggleRoleById = toggleRoleById;
const updateById = async (req, res) => {
    const userIdToUpdate = req.params.id;
    const requestingUser = req.user; // <-- This should be set by verifyToken middleware
    if (!requestingUser) {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
    // Allow if admin OR user updating own profile
    if (!requestingUser.roles.includes('ADMIN') &&
        requestingUser.id !== userIdToUpdate) {
        return res.status(403).json({ status: false, message: 'Forbidden: Cannot update other users' });
    }
    // Validate request body
    const parseResult = auth_schema_1.updateZodUserSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ status: false, errors: parseResult.error.issues.map(issue => issue.message) });
    }
    const data = { ...parseResult.data }; // clone to avoid mutation
    const password = data.password;
    if (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        data.hashedPassword = hashedPassword;
        delete data.password;
    }
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ status: false, message: 'no Id provided' });
    }
    try {
        // If username is to be updated, check uniqueness:
        if (data.username) {
            const existingUser = await users_models_1.default.findOne({ username: data.username });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ status: false, message: 'Username already taken' });
            }
        }
        const user = await user_dao_1.userDAO.update(userId, data);
        return res.status(200).json({ status: true, data: user });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.updateById = updateById;
// delete
const deleteById = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ status: false, message: 'User ID is required OR not found' });
    }
    try {
        const deleteUser = await user_dao_1.userDAO.deleteById(userId);
        return res.status(200).json({ status: true, message: `User ${deleteUser.username} deleted successfully` });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.deleteById = deleteById;
const getUserBalance = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: false, message: 'User ID is required' });
        }
        // βρίσκουμε όλα τα bills του χρήστη
        const bills = await bill_dao_1.billDAO.readByUser(userId);
        if (!bills) {
            return res.status(404).json({ status: false, message: 'User not found or no bills' });
        }
        // υπολογίζουμε balance = άθροισμα unpaid (PENDING)
        const balance = bills
            .filter((b) => b.status === 'PENDING')
            .reduce((acc, b) => acc + b.amount, 0);
        return res.status(200).json({ status: true, data: { userId, balance } });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.getUserBalance = getUserBalance;
// get own balance (self)
const getMyBalance = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
        const user = await user_dao_1.userDAO.readById(req.user.id);
        return res.status(200).json({ status: true, balance: user.balance ?? 0 });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.getMyBalance = getMyBalance;
exports.userController = {
    createUser: exports.createUser,
    createAdmin: exports.createAdmin,
    findAll: exports.findAll,
    readById: exports.readById,
    readByUsername: exports.readByUsername,
    readByEmail: exports.readByEmail,
    toggleRoleById: exports.toggleRoleById,
    updateById: exports.updateById,
    deleteById: exports.deleteById,
    getUserBalance: exports.getUserBalance,
    getMyBalance: exports.getMyBalance
};
//# sourceMappingURL=user.controller.js.map