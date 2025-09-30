"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_service_1 = __importDefault(require("./multer.service"));
const upload_controller_1 = require("./upload.controller");
const verification_middleware_1 = require("../login/middleware/verification.middleware");
router.get('/', upload_controller_1.uploadController.renderUploadPage);
// προσοχ: το upload.single είναι σαν middleware του multer. αυτό κανει το upload. ο controller στέλνει απλώς success message ή/και σώζη στην mongo
// router.post('/', middleware.verifyToken, middleware.checkRole('ADMIN'), upload.single('image'), uploadController.uploadFile);
// router.delete('/:id', middleware.verifyToken, middleware.checkRole('ADMIN'), uploadController.deleteUpload);
// delete when auth and swap TODO
router.post('/', verification_middleware_1.middleware.verifyToken, multer_service_1.default.single('file'), upload_controller_1.uploadController.uploadFile);
router.delete('/:id', verification_middleware_1.middleware.verifyToken, upload_controller_1.uploadController.deleteUpload);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map