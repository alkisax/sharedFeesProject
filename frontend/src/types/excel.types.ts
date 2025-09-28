export type ExcelCell = string | number | null;

export type ExcelRow = ExcelCell[];

export interface ExcelData {
  globalInfo?: ExcelRow[];
  userBills?: ExcelRow[];
}

export interface ExcelResponse {
  status: boolean;
  message: string;
  data?: ExcelData;
}

// Bill-related types
export interface GlobalBillType {
  id: string;
  month: string;
  building: string;
  status: string; // "OPEN" | "COMPLETE"
  createdAt: string;
}

export interface BillType {
  _id: string;
  flat: string;
  ownerName: string;
  globalBillId: string;
  amount: number;
  status: "UNPAID" | "PENDING" | "PAID" | "CANCELED";
  breakdown: Record<string, number>;
}