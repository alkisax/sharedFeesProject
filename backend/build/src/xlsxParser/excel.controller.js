"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelController = void 0;
const excelParser_1 = require("./excelParser");
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("../utils/error/errorHandler");
// import GlobalBill from '../bill/models/globalBill.model';
const bill_model_1 = __importDefault(require("../bill/models/bill.model"));
const users_models_1 = __importDefault(require("../login/models/users.models"));
const globalBill_dao_1 = require("../bill/dao/globalBill.dao");
const user_dao_1 = require("../login/dao/user.dao");
const uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: "No file uploaded" });
        }
        // Παίρνουμε την κατάληξη (extension) του αρχικού ονόματος του αρχείου
        // - path.extname("myfile.xlsx") → ".xlsx"
        // - .toLowerCase() για να μην έχουμε θέμα με κεφαλαία/πεζά (.XLSX → .xlsx)
        const ext = path_1.default.extname(req.file.originalname).toLowerCase();
        // Ελέγχουμε αν το extension ΔΕΝ είναι μέσα στη λίστα που δεχόμαστε ([".xlsx", ".xls"])
        // - Η includes() επιστρέφει true αν το array περιέχει το στοιχείο
        // - Αν δεν είναι αποδεκτός τύπος, γυρνάμε 400 Bad Request
        if (![".xlsx", ".xls"].includes(ext)) {
            return res.status(400).json({
                status: false,
                message: "Only Excel files are allowed",
            });
        }
        const { globalInfo, userBills } = (0, excelParser_1.parseExcel)(req.file.path);
        // 💣 λογική για την αυτόματη δημιουργια global bill κατα το upload
        // 1️⃣ Extract building + month from filename (e.g. KOINOXR18_2025_07.xlsx)
        // δηλαδη τα κάνουμε extract απο το ονομα του αρχειου. ΠΡΟΣΟΧΗ ΤΟ ΑΡΧΕΙΟ ΠΡΕΠΕΙ ΝΑ ΈΧΕΙ ΟΝΟΜΑ ΑΥΤΉΣ ΤΗΣ ΜΟΡΦΗΣ ΑΛΛΙΏΣ **ΠΡΟΒΛΗΜΑ**  κτηριο_yyyy_mm
        const [building, year, month] = req.file.originalname.replace(".xlsx", "").split("_");
        const billMonth = `${year}-${month}`;
        // 2️⃣ Convert globalInfo rows into categories + total
        const categories = {};
        let total = 0;
        for (const row of globalInfo) {
            const key = row[0];
            const val = typeof row[2] === "number" ? row[2] : 0;
            if (key && key.trim() !== "ΣΥΝΟΨΗ ΕΞΟΔΩΝ" && key.trim() !== "ΣΥΝΟΛΟ") {
                categories[key.trim()] = val;
            }
            if (key?.trim() === "ΣΥΝΟΛΟ") {
                total = val;
            }
        }
        // 3️⃣ Save GlobalBill to mongo
        // αυτή είναι εντολή db και θα έρεπε να είναι σε dao ✅
        const globalBill = await globalBill_dao_1.globalBillDAO.createServerSide({
            month: billMonth,
            building,
            categories,
            total,
            status: "OPEN",
        });
        // 💥 τέλος δημιουργίας globalBill
        // 💣 λογική για την διμιουργεία λογαριασμού του κάθε διαμερίσματος αυτόματα κατα το upload
        const headers = userBills[0]; // παίρνουμε την πρώτη γραμμή
        const rows = userBills.slice(1); // skip headers
        // επειδή θέλουμε await μέσα στο map → Promise.all
        // φτιάχνουμε έναν έναν τους λογαριασμούς που αντιστοιχούν σε κάθε row
        const billsToInsert = (await Promise.all(rows
            .filter((row) => row[0]) // skip empty rows
            .map(async (row) => {
            const flat = row[0];
            const ownerName = row[1];
            const share = typeof row[2] === "number" ? row[2] : undefined;
            // build breakdown: cols 3 .. (last - 1)
            let breakdown = {}; // οι υπόλλοιπες είναι ένα obj απο {string: num}
            for (let i = 3; i < headers.length - 1; i++) { // απο την τρίτη ως την προτελευταια. τελευταία είναι 'σύνολο'
                const colName = String(headers[i]).trim();
                const raw = row[i];
                if (typeof raw === "number") {
                    breakdown[colName] = raw;
                }
            }
            // το τελευταίο κελί που είναι σύνολο
            const amount = typeof row[headers.length - 1] === "number"
                ? row[headers.length - 1]
                : 0;
            // 💣 πριν προχωρήσουμε θα πρέπει να βρούμε τον user που αντιστοιχεί στον λογαριασμό
            // αυτή είναι εντολή db και θα έρεπε να είναι σε dao ✅
            const user = await user_dao_1.userDAO.toServerByBuildingAndFlat(building, flat);
            if (!user) {
                console.warn(`No user found for flat ${flat}, building ${building}`);
                return null; // skip
            }
            return {
                userId: user._id,
                globalBillId: globalBill._id,
                month: billMonth,
                building,
                flat,
                ownerName,
                share,
                breakdown, // ✅ μόνο κατηγορίες εδώ
                amount, // ✅ ξεχωριστό πεδίο root
                status: "UNPAID" // default status
            };
        }))).filter(Boolean); // πετάμε όσα return null
        // αυτή είναι εντολή db και θα έρεπε να είναι σε dao TODO
        await bill_model_1.default.insertMany(billsToInsert);
        // 💥 τελος δημιουργίας bill
        // 💣 update each user's balance (subtract bill amount)
        for (const b of billsToInsert) {
            if (!b || !b.userId)
                continue;
            await users_models_1.default.findByIdAndUpdate(b.userId, { $inc: { balance: -Math.abs(b.amount) } }, // subtract amount
            { new: true });
        }
        // 💥 end of update users
        return res.status(201).json({
            status: true,
            message: "GlobalBill created successfully",
            data: {
                globalInfo,
                userBills,
            },
        });
    }
    catch (error) {
        console.error("Excel upload error:", error);
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.excelController = {
    uploadExcel
};
//# sourceMappingURL=excel.controller.js.map