"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_service_1 = __importDefault(require("../uploadMulter/multer.service"));
const excel_controller_1 = require("./excel.controller");
const router = express_1.default.Router();
// POST /api/excel/upload
// 🔹 Αναμενόμενο input:
//    - Form-data αίτημα με πεδίο "file" που περιέχει ένα αρχείο Excel (.xlsx ή .xls)
router.post("/upload", multer_service_1.default.single("file"), excel_controller_1.excelController.uploadExcel);
exports.default = router;
//# sourceMappingURL=excel.routes.js.map