"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalBillController = exports.deleteGlobalById = exports.updateGlobalById = exports.findOpenGlobal = exports.readGlobalById = exports.findAllGlobal = exports.createGlobalBill = void 0;
/* eslint-disable no-console */
const errorHandler_1 = require("../../utils/error/errorHandler");
const globalBill_dao_1 = require("../dao/globalBill.dao");
// create global bill
const createGlobalBill = async (req, res) => {
    try {
        const data = req.body;
        if (!data.month || !data.building || !data.categories || !data.total) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }
        const newBill = await globalBill_dao_1.globalBillDAO.create(data);
        return res.status(201).json({ status: true, data: newBill });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.createGlobalBill = createGlobalBill;
// read all global bills
const findAllGlobal = async (_req, res) => {
    try {
        const bills = await globalBill_dao_1.globalBillDAO.readAll();
        return res.status(200).json({ status: true, data: bills });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.findAllGlobal = findAllGlobal;
// read global bill by id
const readGlobalById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: false, message: 'no Id provided' });
        }
        const bill = await globalBill_dao_1.globalBillDAO.readById(id);
        return res.status(200).json({ status: true, data: bill });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.readGlobalById = readGlobalById;
// read only OPEN global bills
const findOpenGlobal = async (_req, res) => {
    try {
        const bills = await globalBill_dao_1.globalBillDAO.readByFilter({ status: "OPEN" });
        return res.status(200).json({ status: true, data: bills });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.findOpenGlobal = findOpenGlobal;
// update global bill
const updateGlobalById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: false, message: 'no Id provided' });
        }
        const data = req.body;
        const updatedBill = await globalBill_dao_1.globalBillDAO.update(id, data);
        return res.status(200).json({ status: true, data: updatedBill });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.updateGlobalById = updateGlobalById;
// delete global bill
const deleteGlobalById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: false, message: 'no Id provided' });
        }
        const deletedBill = await globalBill_dao_1.globalBillDAO.deleteById(id);
        return res.status(200).json({ status: true, data: deletedBill });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.deleteGlobalById = deleteGlobalById;
exports.globalBillController = {
    createGlobalBill: exports.createGlobalBill,
    findAllGlobal: exports.findAllGlobal,
    readGlobalById: exports.readGlobalById,
    findOpenGlobal: exports.findOpenGlobal,
    updateGlobalById: exports.updateGlobalById,
    deleteGlobalById: exports.deleteGlobalById
};
//# sourceMappingURL=globalBill.controller.js.map