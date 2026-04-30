"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ValidationError = exports.PermissionError = exports.AuthError = exports.AppError = void 0;
exports.buildPaginatedResponse = buildPaginatedResponse;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode, code = 'INTERNAL_ERROR', details = {}) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class AuthError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'AUTH_ERROR');
    }
}
exports.AuthError = AuthError;
class PermissionError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'PERMISSION_DENIED');
    }
}
exports.PermissionError = PermissionError;
class ValidationError extends AppError {
    constructor(message = 'Validation failed', details = {}) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
function buildPaginatedResponse(items, page, pageSize, total) {
    return {
        items,
        page,
        pageSize,
        total,
    };
}
//# sourceMappingURL=api.js.map