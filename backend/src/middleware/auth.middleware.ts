import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { AppError } from '../utils/api';
import { config } from '../config';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[AuthMiddleware] Missing or invalid Authorization header');
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as { userId: string, permissionVersion: number };
    } catch (e) {
      console.error('[AuthMiddleware] JWT Verification failed:', e instanceof Error ? e.message : e);
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.status !== 'active' || user.deletedAt) {
      console.warn(`[AuthMiddleware] User not found or inactive: ${decoded.userId}`);
      throw new AppError('Unauthorized', 401);
    }

    if (user.permissionVersion !== decoded.permissionVersion) {
      console.warn(`[AuthMiddleware] Permission version mismatch for user ${user.id}`);
      throw new AppError('Permissions changed. Please re-authenticate.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] General error:', error instanceof Error ? error.message : error);
    next(error instanceof AppError ? error : new AppError('Unauthorized', 401));
  }
};
