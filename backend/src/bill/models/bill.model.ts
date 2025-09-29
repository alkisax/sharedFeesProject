import mongoose, { model } from 'mongoose';
import { IBill } from '../types/bill.types';

const Schema = mongoose.Schema;

const billSchema = new Schema<IBill>(
  {
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
  },
  {
    collection: "bills",
    timestamps: true,
  }
);

export default model<IBill>("Bill", billSchema);
