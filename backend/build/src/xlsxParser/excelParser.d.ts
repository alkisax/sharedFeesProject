type CellValue = string | number | boolean | null;
type Row = CellValue[];
interface ExcelParseResult {
    globalInfo: Row[];
    userBills: Row[];
}
export declare const parseExcel: (filePath: string) => ExcelParseResult;
export {};
