import type { IBill, BillView, CreateBill, UpdateBill } from '../types/bill.types';
export declare const toBillDAO: (bill: IBill) => BillView;
export declare const billDAO: {
    toBillDAO: (bill: IBill) => BillView;
    create: (billData: CreateBill) => Promise<BillView>;
    readAll: () => Promise<BillView[]>;
    readById: (id: string) => Promise<BillView>;
    readByUser: (userId: string) => Promise<BillView[]>;
    toServerById: (id: string) => Promise<IBill>;
    update: (id: string, billData: UpdateBill) => Promise<BillView>;
    deleteById: (id: string) => Promise<BillView>;
    insertManyServer: (bills: Partial<IBill>[]) => Promise<IBill[]>;
};
