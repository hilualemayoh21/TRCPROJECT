import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    static getDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listResearcherRequests(req: Request, res: Response): Promise<void>;
    static listPendingResources(req: Request, res: Response): Promise<void>;
    static listReports(req: Request, res: Response): Promise<void>;
    static resolveReport(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=admin.controller.d.ts.map