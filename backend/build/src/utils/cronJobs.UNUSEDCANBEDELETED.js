"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
// βιβλιοθήκη για cron jobs στο Node.js
const node_cron_1 = __importDefault(require("node-cron"));
// Εισάγουμε την δική μας function που διαγράφει comments
// import { deleteOldUnapprovedComments } from '../stripe/daos/commodity.dao';
//   Χρησιμοποιούμε την cron.schedule()
//    Το πρώτο string "0 3 * * *" είναι το cron expression:
//    - 0  → λεπτό (minute = 0)
//    - 3  → ώρα (hour = 3 → 03:00 τα ξημερώματα)
//    - *  → κάθε μέρα του μήνα
//    - *  → κάθε μήνα
//    - *  → κάθε μέρα της εβδομάδας
//    Άρα "0 3 * * *" σημαίνει: τρέξε ΚΑΘΕ μέρα στις 03:00
node_cron_1.default.schedule('0 3 * * *', async () => {
    // Καλούμε την function μας με όρισμα 5 → παλιά comments 5 ημερών
    // const deleted = await deleteOldUnapprovedComments(5);
    // 5. Γράφουμε στο console log πόσα διαγράφηκαν
    // console.log(`🗑 Διαγράφηκαν ${deleted} μη εγκεκριμένα σχόλια (παλαιότερα από 5 μέρες).`);
});
//# sourceMappingURL=cronJobs.UNUSEDCANBEDELETED.js.map