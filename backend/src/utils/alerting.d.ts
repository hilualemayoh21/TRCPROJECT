export type AlertSeverity = 'info' | 'warning' | 'critical';
export declare class AlertingService {
    static notify(message: string, severity?: AlertSeverity, context?: any): Promise<void>;
    static critical(message: string, context?: any): Promise<void>;
    static warning(message: string, context?: any): Promise<void>;
}
//# sourceMappingURL=alerting.d.ts.map