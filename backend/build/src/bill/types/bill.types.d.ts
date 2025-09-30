import { Types } from "mongoose";
export type BillStatus = "UNPAID" | "PENDING" | "PAID" | "CANCELED";
export type GlobalBillStatus = "OPEN" | "COMPLETE";
export interface IGlobalBill {
    _id: Types.ObjectId;
    month: string;
    building: string;
    categories: Record<string, number>;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface GlobalBillView {
    id: string;
    month: string;
    building: string;
    categories: Record<string, number>;
    total: number;
    status: GlobalBillStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateGlobalBill {
    month: string;
    building: string;
    categories: Record<string, number>;
    total: number;
    status?: GlobalBillStatus;
}
export interface IBill {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    globalBillId: Types.ObjectId;
    month: string;
    building: string;
    flat: string;
    ownerName?: string;
    share?: number;
    breakdown: Record<string, number>;
    amount: number;
    status: BillStatus;
    receiptUrl?: string;
    notes?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface BillView {
    id: string;
    userId: string;
    globalBillId: string;
    month: string;
    building: string;
    flat: string;
    ownerName?: string;
    share?: number;
    breakdown: Record<string, number>;
    amount: number;
    status: BillStatus;
    receiptUrl?: string;
    notes?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBill {
    userId: Types.ObjectId;
    globalBillId: Types.ObjectId;
    month: string;
    building: string;
    flat: string;
    ownerName?: string;
    share?: number;
    breakdown: Record<string, number>;
    amount: number;
    status?: BillStatus;
    receiptUrl?: string;
    notes?: string[];
}
export interface UpdateBill {
    status?: BillStatus;
    receiptUrl?: string;
    notes?: string[];
}
