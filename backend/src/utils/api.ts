export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: any;

  constructor(message: string, statusCode: number, code = 'INTERNAL_ERROR', details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class PermissionError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'PERMISSION_DENIED');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export function buildPaginatedResponse<T>(items: T[], page: number, pageSize: number, total: number) {
  return {
    items,
    page,
    pageSize,
    total,
  };
}
