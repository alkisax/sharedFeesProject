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
const mongoose_1 = __importStar(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const billSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],
    },
    globalBillId: {
        type: Schema.Types.ObjectId,
        ref: "GlobalBill",
        required: [true, "globalBillId is required"],
    },
    month: {
        type: String,
        required: [true, "month is required"], // format: YYYY-MM
    },
    building: {
        type: String,
        required: [true, "building is required"], // redundant copy for quick lookup
    },
    flat: {
        type: String,
        required: [true, "flat is required"], // e.g. "ΙΣ", "Α1"
    },
    ownerName: {
        type: String,
        required: false,
    },
    share: {
        type: Number,
        required: false, // Χιλιοστά
    },
    // object with per-category breakdown for this flat
    breakdown: {
        type: Object,
        required: true,
        default: {},
    },
    amount: {
        type: Number,
        required: [true, "amount is required"], // Σύνολο
    },
    status: {
        type: String,
        enum: ["UNPAID", "PENDING", "PAID", "CANCELED"],
        default: "UNPAID",
    },
    receiptUrl: {
        type: String,
        required: false,
    },
    notes: [{ type: String }],
}, {
    collection: "bills",
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Bill", billSchema);
//# sourceMappingURL=bill.model.js.map