"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../controllers/auth.controller");
// import { limiter } from '../../utils/limiter';
//>     "username": "alkisax",
//>     "password": "AdminPass1!"
// router.post('/', limiter(15,5), authController.login);
// router.post('/refresh', limiter(15,5), authController.refreshToken);
// TODO add limiter later
router.post('/', auth_controller_1.authController.login);
router.post('/refresh', auth_controller_1.authController.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map