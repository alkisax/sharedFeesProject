"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billDAO = exports.toBillDAO = void 0;
const bill_model_1 = __importDefault(require("../models/bill.model"));
// Response DAO (safe to send to client)
const toBillDAO = (bill) => {
    return {
        id: bill._id.toString(),
        userId: bill.userId.toString(),
        globalBillId: bill.globalBillId.toString(),
        month: bill.month,
        building: bill.building,
        flat: bill.flat,
        ownerName: bill.ownerName,
        share: bill.share,
        breakdown: bill.breakdown,
        amount: bill.amount,
        status: bill.status,
        receiptUrl: bill.receiptUrl,
        notes: bill.notes,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt
    };
};
exports.toBillDAO = toBillDAO;
// Create new Bill (user-level)
const create = async (billData) => {
    const bill = new bill_model_1.default({
        userId: billData.userId,
        globalBillId: billData.globalBillId,
        month: billData.month,
        building: billData.building,
        flat: billData.flat,
        ownerName: billData.ownerName,
        share: billData.share,
        breakdown: billData.breakdown,
        amount: billData.amount,
        status: billData.status ?? 'UNPAID',
        receiptUrl: billData.receiptUrl,
        notes: billData.notes
    });
    const response = await bill.save();
    if (!response)
        throw new Error('Error saving bill');
    return (0, exports.toBillDAO)(response);
};
// Read all Bills
const readAll = async () => {
    const bills = await bill_model_1.default.find();
    return bills.map((b) => (0, exports.toBillDAO)(b));
};
// Read Bill by ID
const readById = async (id) => {
    const bill = await bill_model_1.default.findById(id);
    if (!bill)
        throw new Error('Bill not found');
    return (0, exports.toBillDAO)(bill);
};
// Read Bills by User
const readByUser = async (userId) => {
    const bills = await bill_model_1.default.find({ userId });
    return bills.map((b) => (0, exports.toBillDAO)(b));
};
// Internal server-side access
const toServerById = async (id) => {
    const bill = await bill_model_1.default.findById(id);
    if (!bill)
        throw new Error('Bill not found');
    return bill;
};
// Update Bill
const update = async (id, billData) => {
    const response = await bill_model_1.default.findByIdAndUpdate(id, billData, { new: true });
    if (!response)
        throw new Error('Bill does not exist');
    return (0, exports.toBillDAO)(response);
};
// Delete Bill
const deleteById = async (id) => {
    const response = await bill_model_1.default.findByIdAndDelete(id);
    if (!response) {
        const error = new Error('Bill does not exist');
        error.status = 404;
        throw error;
    }
    return (0, exports.toBillDAO)(response);
};
// Bulk insert Bills (server-side, returns raw IBill[])
const insertManyServer = async (bills) => {
    if (!bills.length)
        return [];
    const response = await bill_model_1.default.insertMany(bills);
    return response;
};
exports.billDAO = {
    toBillDAO: exports.toBillDAO,
    create,
    readAll,
    readById,
    readByUser,
    toServerById,
    update,
    deleteById,
    insertManyServer
};
//# sourceMappingURL=bill.dao.js.map