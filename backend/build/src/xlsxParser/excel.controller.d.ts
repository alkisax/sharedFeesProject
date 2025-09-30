import { Request, Response } from "express";
export declare const excelController: {
    uploadExcel: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
