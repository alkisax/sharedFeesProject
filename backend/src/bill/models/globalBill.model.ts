import mongoose, { model } from 'mongoose';
import { IGlobalBill } from '../types/bill.types';

const Schema = mongoose.Schema;

const globalBillSchema = new Schema<IGlobalBill>(
  {
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
  },
  {
    collection: "global_bills",
    timestamps: true,
  }
);

export default model<IGlobalBill>("GlobalBill", globalBillSchema);
