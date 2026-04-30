import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { AppError } from '../utils/api';
import { config } from '../config';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string, permissionVersion: number };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.status !== 'active' || user.deletedAt) {
      throw new AppError('Unauthorized', 401);
    }

    if (user.permissionVersion !== decoded.permissionVersion) {
      throw new AppError('Permissions changed. Please re-authenticate.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Unauthorized', 401));
  }
};
