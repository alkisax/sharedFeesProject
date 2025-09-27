// src/controllers/excel.controller.ts
import { Request, Response } from "express";
import { parseExcel } from './excelParser'
import path from "path";
import { handleControllerError } from '../utils/error/errorHandler';

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

      return res.status(200).json({
        status: true,
        message: "Excel parsed successfully",
        data: {
          globalInfo,
          userBills,
        },
      });
    } catch (error) {
      return handleControllerError(res, error);
    }
  }

export const excelController = {
  uploadExcel
};
