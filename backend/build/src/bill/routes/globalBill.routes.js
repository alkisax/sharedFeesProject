"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const globalBill_controller_1 = require("../controllers/globalBill.controller");
// import { middleware } from '../../login/middleware/verification.middleware'
// import { limiter } from '../../utils/limiter'
// create
router.post('/', globalBill_controller_1.globalBillController.createGlobalBill);
// read
router.get('/', globalBill_controller_1.globalBillController.findAllGlobal);
router.get('/:id', globalBill_controller_1.globalBillController.readGlobalById);
// update
router.put('/:id', globalBill_controller_1.globalBillController.updateGlobalById);
// delete
router.delete('/:id', globalBill_controller_1.globalBillController.deleteGlobalById);
// read only open
router.get('/status/open', globalBill_controller_1.globalBillController.findOpenGlobal);
// // middleware turned off
// // create
// router.post( '/', middleware.verifyToken, middleware.checkRole('ADMIN'),  globalBillController.createGlobalBill )
// // read
// router.get( '/', middleware.verifyToken, globalBillController.findAllGlobal )
// router.get( '/:id', middleware.verifyToken, globalBillController.readGlobalById )
// // update
// router.put( '/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), globalBillController.updateGlobalById )
// // delete
// router.delete( '/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), globalBillController.deleteGlobalById )
// // read only open
// router.get( '/status/open', middleware.verifyToken,middleware.checkRole("ADMIN"),globalBillController.findOpenGlobal );
exports.default = router;
//# sourceMappingURL=globalBill.routes.js.map