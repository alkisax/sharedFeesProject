// src/controllers/excel.controller.ts
import { Request, Response } from "express";
import { parseExcel } from './excelParser'
import path from "path";
import { handleControllerError } from '../utils/error/errorHandler';
import GlobalBill from '../bill/models/globalBill.model';

  const uploadExcel = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: false, message: "No file uploaded" });
      }

      // Παίρνουμε την κατάληξη (extension) του αρχικού ονόματος του αρχείου
      // - path.extname("myfile.xlsx") → ".xlsx"
      // - .toLowerCase() για να μην έχουμε θέμα με κεφαλαία/πεζά (.XLSX → .xlsx)
      const ext = path.extname(req.file.originalname).toLowerCase();

      // Ελέγχουμε αν το extension ΔΕΝ είναι μέσα στη λίστα που δεχόμαστε ([".xlsx", ".xls"])
      // - Η includes() επιστρέφει true αν το array περιέχει το στοιχείο
      // - Αν δεν είναι αποδεκτός τύπος, γυρνάμε 400 Bad Request
      if (![".xlsx", ".xls"].includes(ext)) {
        return res.status(400).json({
          status: false,
          message: "Only Excel files are allowed",
        });
      }

      const { globalInfo, userBills } = parseExcel(req.file.path);

      // 1️⃣ Extract building + month from filename (e.g. KOINOXR18_2025_07.xlsx)
      // δηλαδη τα κάνουμε extract απο το ονομα του αρχειου. ΠΡΟΣΟΧΗ ΤΟ ΑΡΧΕΙΟ ΠΡΕΠΕΙ ΝΑ ΈΧΕΙ ΟΝΟΜΑ ΑΥΤΉς ΤΗς ΜΟΡΦΗς ΑΛΛΙΏς **ΠΡΟΒΛΗΜΑ**
      const [building, year, month] = req.file.originalname.replace(".xlsx", "").split("_");
      const billMonth = `${year}-${month}`;

      // 2️⃣ Convert globalInfo rows into categories + total
      const categories: Record<string, number> = {};
      let total = 0;
      for (const row of globalInfo) {
        const key = row[0] as string | null;
        const val = typeof row[2] === "number" ? row[2] : 0;
        if (key && key.trim() !== "ΣΥΝΟΨΗ ΕΞΟΔΩΝ" && key.trim() !== "ΣΥΝΟΛΟ") {
          categories[key.trim()] = val;
        }
        if (key?.trim() === "ΣΥΝΟΛΟ") {
          total = val;
        }
      }

      // 3️⃣ Save GlobalBill to mongo
      await GlobalBill.create({
        month: billMonth,
        building,
        categories,
        total,
        status: "OPEN",
      });

      return res.status(201).json({
        status: true,
        message: "GlobalBill created successfully",
        data: {
          globalInfo,
          userBills,
        },
      });

    } catch (error) {
      console.error("Excel upload error:", error);
      return handleControllerError(res, error);
    }
  }

export const excelController = {
  uploadExcel
};
