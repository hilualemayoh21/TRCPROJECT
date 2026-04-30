import { Request, Response, NextFunction } from 'express';
export declare const resolvePermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requirePermission: (requiredPermission: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map