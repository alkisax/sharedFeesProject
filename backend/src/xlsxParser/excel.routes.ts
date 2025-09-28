import express from 'express';
import upload from '../uploadMulter/multer.service';
import { excelController } from './excel.controller';

const router = express.Router();

// POST /api/excel/upload
// 🔹 Αναμενόμενο input:
//    - Form-data αίτημα με πεδίο "file" που περιέχει ένα αρχείο Excel (.xlsx ή .xls)
router.post("/upload", upload.single("file"), excelController.uploadExcel);

export default router;
