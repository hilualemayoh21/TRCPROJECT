import { Request } from 'express';
import { z } from 'zod';
export declare const AuthSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare class AuthService {
    static login(req: Request, email: string, password: string): Promise<{
        user: any;
        token: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        permissions: string[];
    }>;
    static register(data: any): Promise<{
        user: any;
        token: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        permissions: string[];
    }>;
    static refresh(token: string): Promise<{
        user: any;
        token: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        permissions: string[];
    }>;
    static logout(token: string): Promise<{
        ok: boolean;
    }>;
    private static generateAuthResponse;
}
//# sourceMappingURL=auth.service.d.ts.map