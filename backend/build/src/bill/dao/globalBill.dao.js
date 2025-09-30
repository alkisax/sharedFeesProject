"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalBillDAO = exports.toGlobalBillDAO = void 0;
const globalBill_model_1 = __importDefault(require("../models/globalBill.model"));
// Response DAO (safe to send to client)
const toGlobalBillDAO = (bill) => {
    return {
        id: bill._id.toString(),
        month: bill.month,
        building: bill.building,
        categories: bill.categories,
        total: bill.total,
        status: bill.status,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
    };
};
exports.toGlobalBillDAO = toGlobalBillDAO;
// Create new GlobalBill
const create = async (billData) => {
    const bill = new globalBill_model_1.default({
        month: billData.month,
        building: billData.building,
        categories: billData.categories,
        total: billData.total,
        status: billData.status ?? "OPEN",
    });
    const response = await bill.save();
    if (!response)
        throw new Error("Error saving global bill");
    return (0, exports.toGlobalBillDAO)(response);
};
const createServerSide = async (billData) => {
    const bill = new globalBill_model_1.default({
        month: billData.month,
        building: billData.building,
        categories: billData.categories,
        total: billData.total,
        status: billData.status ?? "OPEN",
    });
    const response = await bill.save();
    if (!response)
        throw new Error("Error saving global bill");
    return response; // raw model
};
// Read all GlobalBills
const readAll = async () => {
    const bills = await globalBill_model_1.default.find();
    return bills.map((b) => (0, exports.toGlobalBillDAO)(b));
};
// Read GlobalBill by ID
const readById = async (id) => {
    const bill = await globalBill_model_1.default.findById(id);
    if (!bill)
        throw new Error("GlobalBill not found");
    return (0, exports.toGlobalBillDAO)(bill);
};
const readByFilter = async (filter) => {
    return globalBill_model_1.default.find(filter).lean();
};
// Internal server-side access
const toServerById = async (id) => {
    const bill = await globalBill_model_1.default.findById(id);
    if (!bill)
        throw new Error("GlobalBill not found");
    return bill;
};
// Update GlobalBill
const update = async (id, billData) => {
    const response = await globalBill_model_1.default.findByIdAndUpdate(id, billData, { new: true });
    if (!response)
        throw new Error("GlobalBill does not exist");
    return (0, exports.toGlobalBillDAO)(response);
};
// Delete GlobalBill
const deleteById = async (id) => {
    const response = await globalBill_model_1.default.findByIdAndDelete(id);
    if (!response) {
        const error = new Error("GlobalBill does not exist");
        error.status = 404;
        throw error;
    }
    return (0, exports.toGlobalBillDAO)(response);
};
exports.globalBillDAO = {
    toGlobalBillDAO: exports.toGlobalBillDAO,
    create,
    createServerSide,
    readAll,
    readById,
    readByFilter,
    toServerById,
    update,
    deleteById,
};
//# sourceMappingURL=globalBill.dao.js.map