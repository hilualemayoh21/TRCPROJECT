import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/api';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { AlertingService } from '../utils/alerting';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.requestId;
  
  if (err instanceof AppError) {
    logger.warn({ requestId, code: err.code, message: err.message, userId: req.user?.id });
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed'
      }
    });
  }

  logger.error({ requestId, stack: err.stack, message: err.message, userId: req.user?.id });

  AlertingService.critical(`Internal Server Error: ${err.message}`, {
    requestId,
    path: req.path,
    userId: req.user?.id
  }).catch(() => {});

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message
    }
  });
}
