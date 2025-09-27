import express from 'express';
import upload from '../uploadMulter/multer.service';
import { excelController } from './excel.controller';

const router = express.Router();

// POST /api/excel/upload
// 🔹 Αναμενόμενο input:
//    - Form-data αίτημα με πεδίο "file" που περιέχει ένα αρχείο Excel (.xlsx ή .xls)
// 🔹 Αναμενόμενο output (response JSON):
//    {
//      "message": "Excel parsed successfully",
//      "globalInfo": [...],   // οι συγκεντρωτικές πληροφορίες από το range (π.χ. D6:F13)
//      "userBills": [...]     // οι λογαριασμοί κάθε διαμερίσματος από το range (π.χ. A15:K26)
//    }
router.post("/upload", upload.single("file"), excelController.uploadExcel);

export default router;
