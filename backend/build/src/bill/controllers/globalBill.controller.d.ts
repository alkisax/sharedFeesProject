import type { Request, Response } from 'express';
export declare const createGlobalBill: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const findAllGlobal: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const readGlobalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const findOpenGlobal: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateGlobalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteGlobalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const globalBillController: {
    createGlobalBill: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    findAllGlobal: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    readGlobalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    findOpenGlobal: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateGlobalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteGlobalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
