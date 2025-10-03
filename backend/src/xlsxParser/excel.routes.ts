import express from 'express';
import upload from '../uploadMulter/multer.service';
import { excelController } from './excel.controller';
import { excelAppwriteController } from './excel.appwrite.controller';

const router = express.Router();

// POST /api/excel/upload
// 🔹 Αναμενόμενο input:
//    - Form-data αίτημα με πεδίο "file" που περιέχει ένα αρχείο Excel (.xlsx ή .xls)
router.post("/upload", upload.single("file"), excelController.uploadExcel);

// αυτό το endpoint προστέθηκε για να αλλαξουμε λογικη και το ανέβασμα των αρχείων να γίνετε στο appwrite και οχι μέσω Multer
router.post('/process', excelAppwriteController.uploadExcelAppwrite);

export default router;
