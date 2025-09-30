"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controllers/user.controller");
const verification_middleware_1 = require("../middleware/verification.middleware");
// import { limiter } from '../../utils/limiter'
// ------------------ create ------------------
// signup
// router.post('/signup/user', limiter(15,5), userController.createUser)
router.post('/signup/user', user_controller_1.userController.createUser);
// create admin
// router.post('/signup/admin', middleware.verifyToken, middleware.checkRole('ADMIN'), limiter(15,5), userController.createAdmin)
router.post('/signup/admin', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), user_controller_1.userController.createAdmin);
// ------------------ read ------------------
// get all users (admin only)
router.get('/', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), user_controller_1.userController.findAll);
// get by username
router.get('/username/:username', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), user_controller_1.userController.readByUsername);
// get by email
router.get('/email/:email', verification_middleware_1.middleware.verifyToken, user_controller_1.userController.readByEmail);
// endpoint for getting the user balance (admin sees any user)
router.get('/:id/balance', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), user_controller_1.userController.getUserBalance);
// endpoint for getting *own* balance (self)
router.get('/me/balance', verification_middleware_1.middleware.verifyToken, user_controller_1.userController.getMyBalance);
// get by id (self or admin only)
router.get('/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkSelfOrAdmin, user_controller_1.userController.readById);
// ------------------ update ------------------
// update by id (self or admin)
router.put('/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkSelfOrAdmin, user_controller_1.userController.updateById);
// toggle admin role
router.put('/toggle-admin/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), user_controller_1.userController.toggleRoleById);
// ------------------ delete ------------------
// delete self
router.delete('/self/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkSelfOrAdmin, user_controller_1.userController.deleteById);
// delete by id (admin only)
router.delete('/:id', verification_middleware_1.middleware.verifyToken, verification_middleware_1.middleware.checkRole('ADMIN'), user_controller_1.userController.deleteById);
exports.default = router;
//# sourceMappingURL=user.routes.js.map