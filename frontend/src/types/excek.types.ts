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
