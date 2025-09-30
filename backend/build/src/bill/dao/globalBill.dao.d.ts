import type { IGlobalBill, GlobalBillView, CreateGlobalBill } from "../types/bill.types";
export declare const toGlobalBillDAO: (bill: IGlobalBill) => GlobalBillView;
export declare const globalBillDAO: {
    toGlobalBillDAO: (bill: IGlobalBill) => GlobalBillView;
    create: (billData: CreateGlobalBill) => Promise<GlobalBillView>;
    createServerSide: (billData: CreateGlobalBill) => Promise<IGlobalBill>;
    readAll: () => Promise<GlobalBillView[]>;
    readById: (id: string) => Promise<GlobalBillView>;
    readByFilter: (filter: Record<string, unknown>) => Promise<(import("mongoose").FlattenMaps<{
        _id: import("mongoose").Types.ObjectId;
        month: string;
        building: string;
        categories: {
            [x: string]: number;
        };
        total: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    toServerById: (id: string) => Promise<IGlobalBill>;
    update: (id: string, billData: Partial<CreateGlobalBill>) => Promise<GlobalBillView>;
    deleteById: (id: string) => Promise<GlobalBillView>;
};
