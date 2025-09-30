"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bill_comtroller_1 = require("../controllers/bill.comtroller");
const verification_middleware_1 = require("../../login/middleware/verification.middleware");
// import { limiter } from '../../utils/limiter'
// ✅ create (admin only)
router.post('/', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), bill_comtroller_1.billController.createBill);
// ✅ read
router.get('/', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), bill_comtroller_1.billController.findAllBills);
router.get('/me', verification_middleware_1.middleware.verifyToken, bill_comtroller_1.billController.findMyBills);
// ✅ update
router.patch('/:id/pay', verification_middleware_1.middleware.verifyToken, bill_comtroller_1.billController.markBillAsPaid);
router.patch('/:id/approve', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), bill_comtroller_1.billController.approveBill);
router.put('/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), bill_comtroller_1.billController.updateBillById);
// ✅ cancel (admin only)
router.patch('/bills/:id/cancel', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), bill_comtroller_1.billController.cancelBill);
// ✅ delete (admin only)
router.delete('/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), bill_comtroller_1.billController.deleteBillById);
exports.default = router;
//# sourceMappingURL=bill.routes.js.map