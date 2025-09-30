"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billController = exports.deleteBillById = exports.updateBillById = exports.cancelBill = exports.approveBill = exports.markBillAsPaid = exports.findMyBills = exports.findAllBills = exports.createBill = void 0;
/* eslint-disable no-console */
const errorHandler_1 = require("../../utils/error/errorHandler");
const bill_dao_1 = require("../dao/bill.dao");
const user_dao_1 = require("../../login/dao/user.dao");
// create user-level bill
const createBill = async (req, res) => {
    try {
        const data = req.body;
        if (!data.userId || !data.globalBillId || !data.month || !data.amount) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }
        const newBill = await bill_dao_1.billDAO.create(data);
        return res.status(201).json({ status: true, data: newBill });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.createBill = createBill;
// get all bills (admin)
const findAllBills = async (_req, res) => {
    try {
        const bills = await bill_dao_1.billDAO.readAll();
        return res.status(200).json({ status: true, data: bills });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.findAllBills = findAllBills;
// get bills for logged-in user
const findMyBills = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
        const bills = await bill_dao_1.billDAO.readByUser(user.id);
        return res.status(200).json({ status: true, data: bills });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.findMyBills = findMyBills;
// mark bill as paid (user)
const markBillAsPaid = async (req, res) => {
    try {
        const user = req.user;
        const billId = req.params.id;
        const { receiptUrl } = req.body;
        if (!user) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
        if (!billId) {
            return res.status(400).json({ status: false, message: 'Bill ID is required' });
        }
        // only allow user to pay their own bill
        const bill = await bill_dao_1.billDAO.toServerById(billId);
        if (bill.userId.toString() !== user.id && !user.roles.includes('ADMIN')) {
            return res.status(403).json({ status: false, message: 'Forbidden: Cannot update other users bills' });
        }
        const update = { status: 'PENDING' };
        if (receiptUrl) {
            update.receiptUrl = receiptUrl;
        }
        const updated = await bill_dao_1.billDAO.update(billId, update);
        return res.status(200).json({ status: true, data: updated });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.markBillAsPaid = markBillAsPaid;
// approve bill (admin)
const approveBill = async (req, res) => {
    try {
        const billId = req.params.id;
        if (!billId) {
            return res.status(400).json({ status: false, message: "Bill ID is required" });
        }
        // find the bill first
        const bill = await bill_dao_1.billDAO.toServerById(billId);
        if (!bill) {
            return res.status(404).json({ status: false, message: "Bill not found" });
        }
        // update the bill status
        const updated = await bill_dao_1.billDAO.update(billId, { status: "PAID" });
        // credit back to user balance
        // db actions should be in dao ✅
        // credit back to user balance
        await user_dao_1.userDAO.incrementBalance(bill.userId.toString(), Math.abs(bill.amount));
        return res.status(200).json({ status: true, data: updated });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.approveBill = approveBill;
// cancel bill
const cancelBill = async (req, res) => {
    try {
        const billId = req.params.id;
        if (!billId)
            return res.status(400).json({ status: false, message: 'Bill ID is required' });
        const updated = await bill_dao_1.billDAO.update(billId, { status: "CANCELED" });
        return res.status(200).json({ status: true, data: updated });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.cancelBill = cancelBill;
// update bill (admin use)
const updateBillById = async (req, res) => {
    try {
        const billId = req.params.id;
        if (!billId) {
            return res.status(400).json({ status: false, message: 'Bill ID is required' });
        }
        const data = req.body;
        const updated = await bill_dao_1.billDAO.update(billId, data);
        return res.status(200).json({ status: true, data: updated });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.updateBillById = updateBillById;
// delete bill
const deleteBillById = async (req, res) => {
    try {
        const billId = req.params.id;
        if (!billId) {
            return res.status(400).json({ status: false, message: 'Bill ID is required' });
        }
        const deleted = await bill_dao_1.billDAO.deleteById(billId);
        return res.status(200).json({ status: true, data: deleted });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.deleteBillById = deleteBillById;
exports.billController = {
    createBill: exports.createBill,
    findAllBills: exports.findAllBills,
    findMyBills: exports.findMyBills,
    markBillAsPaid: exports.markBillAsPaid,
    approveBill: exports.approveBill,
    updateBillById: exports.updateBillById,
    cancelBill: exports.cancelBill,
    deleteBillById: exports.deleteBillById
};
//# sourceMappingURL=bill.comtroller.js.map