// η backend\src\xlsxParser\excelParser.ts έπαιρνε ως props const parseExcel = (filePath: string) εδω θα φτιάξουμε μια αντίστοιχή η οποία όμως θα έχει για Input buffer γιατι πια δεν χρησιμοποιούμε Multer

import * as XLSX from "xlsx";

type CellValue = string | number | boolean | null;
type Row = CellValue[];

// το excel που ανεβάζει ο admin έχει δύο περιοχές ενδιαφέροντος:
// 1) τον συγκεντρωτικό λογαριασμό (globalInfo)
// 2) έναν πίνακα που κάθε γραμμή αντιστοιχεί στον λογαριασμό του κάθε διαμερίσματος (userBills)
interface ExcelParseResult {
  globalInfo: Row[];
  userBills: Row[];
}

// helper για να στρογγυλεύουμε κάθε κελί
const normalizeRow = (row: Row): Row =>
  row.map(cell => (typeof cell === "number" ? parseFloat(cell.toFixed(2)) : cell));

export const parseExcelBuffer = (buffer: Buffer): ExcelParseResult => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  // παίρνουμε το φύλλο1 από το excel
  //workbook.SheetNames είναι ένας πίνακας με τα ονόματα όλων των φύλλων (π.χ. ["Φύλλο1", "Φύλλο2", "Φύλλο3"]).
  // workbook = όλο το Excel
  // workbook.SheetNames = λίστα με τίτλους φύλλων
  // workbook.Sheets["Φύλλο1"] = περιεχόμενο του "Φύλλο1"
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawUserBills = XLSX.utils.sheet_to_json<Row>(worksheet, {
    header: 1,
    range: process.env.USER_BILLS,
    defval: null,
  });

  // Αντίστοιχα, παίρνουμε τον συγκεντρωτικό λογαριασμό από το range που έχουμε ορίσει στο env (π.χ. "D6:F13")
  const rawGlobalInfo = XLSX.utils.sheet_to_json<Row>(worksheet, {
    header: 1,
    range: process.env.GLOBAL_INFO,
    defval: null,
  });

    // Εδώ καθαρίζουμε τα floats
  const userBills = rawUserBills.map(normalizeRow);
  const globalInfo = rawGlobalInfo.map(normalizeRow);

  return {
    globalInfo,
    userBills
  };
};
