"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcel = void 0;
const XLSX = __importStar(require("xlsx"));
// helper για να στρογγυλεύουμε κάθε κελί
const normalizeRow = (row) => row.map(cell => (typeof cell === "number" ? parseFloat(cell.toFixed(2)) : cell));
// παίρνει ένα string με την θέση του αρχείου και επιστρέφει τους δύο λογαριασμούς ως array
const parseExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    // παίρνουμε το φύλλο1 από το excel
    //workbook.SheetNames είναι ένας πίνακας με τα ονόματα όλων των φύλλων (π.χ. ["Φύλλο1", "Φύλλο2", "Φύλλο3"]).
    // workbook = όλο το Excel
    // workbook.SheetNames = λίστα με τίτλους φύλλων
    // workbook.Sheets["Φύλλο1"] = περιεχόμενο του "Φύλλο1"
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Χρησιμοποιούμε την util μέθοδο `sheet_to_json` για να μετατρέψουμε το συγκεκριμένο range σε array.
    // - <Row> δίνουμε τύπο ώστε κάθε γραμμή να είναι array από (string | number | boolean | null)
    // - header: 1 σημαίνει ότι θέλουμε απλό array χωρίς mapping σε αντικείμενα με headers
    // - range: process.env.USER_BILLS → το range κελιών που μας ενδιαφέρει (π.χ. "A15:K26"), ορίζεται σε env
    // - defval: null → αν το κελί είναι άδειο, να γυρίσει null αντί για undefined
    const rawUserBills = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: process.env.USER_BILLS,
        defval: null,
    });
    // Αντίστοιχα, παίρνουμε τον συγκεντρωτικό λογαριασμό από το range που έχουμε ορίσει στο env (π.χ. "D6:F13")
    const rawGlobalInfo = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: process.env.GLOBAL_INFO,
        defval: null,
    });
    // Εδώ καθαρίζουμε τα floats
    const userBills = rawUserBills.map(normalizeRow);
    const globalInfo = rawGlobalInfo.map(normalizeRow);
    return {
        globalInfo,
        userBills,
    };
};
exports.parseExcel = parseExcel;
//# sourceMappingURL=excelParser.js.map