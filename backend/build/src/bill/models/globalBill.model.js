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
const globalBillSchema = new Schema({
    month: {
        type: String,
        required: [true, "month is required"], // format: YYYY-MM
    },
    building: {
        type: String,
        required: [true, "building is required"], // e.g. "ΠΟΛΥΚΑΤΟΙΚΙΑ ΚΑΤΕΡΙΝΗΣ 18"
    },
    // tells Mongoose this field will store a Map-like object with string keys
    // and numeric values (per-category totals).
    categories: {
        type: Map,
        of: Number,
        default: {},
    },
    total: {
        type: Number,
        required: [true, "total is required"],
    },
    status: {
        type: String,
        enum: ["OPEN", "COMPLETE"], // OPEN = some bills pending, COMPLETE = all paid
        default: "OPEN",
    }
}, {
    collection: "global_bills",
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("GlobalBill", globalBillSchema);
//# sourceMappingURL=globalBill.model.js.map