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
  id: string;
  userId: string;
  globalBillId: string;
  month: string;
  building: string;
  flat: string;
  ownerName: string;
  share?: number;
  breakdown: Record<string, number>;
  amount: number;
  status: 'UNPAID' | 'PENDING' | 'PAID' | 'CANCELED';
  paymentMethod?: 'CASH' | 'BANK' | 'STRIPE' | 'OTHER'; // τρόπος πληρωμής
  paidAt?: string;                                      // ημερομηνία πληρωμής
  notes?: string[];
  receiptUrl?: string;       // optional, for upload link
  createdAt?: string;
  updatedAt?: string;
}
