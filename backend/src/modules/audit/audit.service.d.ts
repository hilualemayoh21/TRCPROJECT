import { Request } from 'express';
export declare class AuditService {
    static log(req: Request | null, actorId: string | null, action: string, entityType: string, entityId: string, metadata?: any): Promise<void>;
}
//# sourceMappingURL=audit.service.d.ts.map