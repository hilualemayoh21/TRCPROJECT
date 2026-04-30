export declare class AppError extends Error {
    statusCode: number;
    code: string;
    details: any;
    constructor(message: string, statusCode: number, code?: string, details?: {});
}
export declare class AuthError extends AppError {
    constructor(message?: string);
}
export declare class PermissionError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: {});
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare function buildPaginatedResponse<T>(items: T[], page: number, pageSize: number, total: number): {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
};
//# sourceMappingURL=api.d.ts.map