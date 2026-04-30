import { Request, Response, NextFunction } from 'express';
export declare class RolesController {
    static getRoles(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    static togglePermission(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=roles.controller.d.ts.map