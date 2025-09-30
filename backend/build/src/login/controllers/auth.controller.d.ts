import type { Request, Response } from 'express';
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const authController: {
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
