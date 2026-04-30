import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { AppError, AuthError } from '../../utils/api';
import { z } from 'zod';
import { AuditService } from '../audit/audit.service';
import { AlertingService } from '../../utils/alerting';

import { config } from '../../config';

const ACCESS_EXP = '15m';
const REFRESH_EXP_DAYS = 7;

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  institution: z.string().optional(),
  role: z.string().optional()
});

export class AuthService {
  static async login(req: Request, email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });

    if (!user || user.deletedAt) {
      AuditService.log(req, null, 'Login failed', 'Auth', email, { reason: 'User not found' });
      throw new AuthError('Invalid credentials');
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      AuditService.log(req, user.id, 'Login failed', 'Auth', user.id, { reason: 'Account locked' });
      throw new AuthError('Account is temporarily locked. Please try again later.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // 30 min lock
      
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockUntil }
      });

      AuditService.log(req, user.id, 'Login failed', 'Auth', user.id, { reason: 'Invalid password', attempt: attempts });
      throw new AuthError('Invalid credentials');
    }

    // Reset attempts on success
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockUntil: null }
    });

    AuditService.log(req, user.id, 'Login successful', 'Auth', user.id);

    return this.generateAuthResponse(user);
  }

  static async register(data: any) {
    const { email, password, name, institution, role = 'public_user' } = data;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already in use', 400);

    const passwordHash = await bcrypt.hash(password, 10);
    
    let dbRole = await prisma.role.findFirst({ 
      where: { 
        OR: [
          { name: role },
          { id: role }
        ],
        deletedAt: null 
      } 
    });

    if (!dbRole && (role === 'public_user' || role === 'Public User')) {
      dbRole = await prisma.role.create({ data: { id: 'public_user', name: 'Public User', isSystem: true } });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        institution,
        roles: dbRole ? { create: { roleId: dbRole.id } } : undefined
      },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });

    return this.generateAuthResponse(user);
  }

  static async refresh(token: string) {
    try {
      jwt.verify(token, config.refreshSecret);
    } catch (e) {
      throw new AuthError('Invalid or expired refresh token');
    }

    const rt = await prisma.refreshToken.findUnique({ where: { token } });
    
    if (!rt) throw new AuthError('Invalid refresh token');

    // Token Reuse Detection
    if (rt.revoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: rt.userId },
        data: { revoked: true }
      });

      AlertingService.critical(`Security Alert: Refresh token reuse detected for user ${rt.userId}. Panic mode triggered.`, {
        userId: rt.userId,
        tokenId: rt.id
      }).catch(() => {});

      throw new AuthError('Security Alert: Refresh token reuse detected. All sessions invalidated.');
    }

    if (rt.expiresAt < new Date()) {
      throw new AuthError('Refresh token expired');
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });
    });

    const user = await prisma.user.findUnique({
      where: { id: rt.userId },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });

    if (!user || user.status !== 'active' || user.deletedAt) {
      throw new AuthError('User account is inactive or deleted');
    }

    return this.generateAuthResponse(user);
  }

  static async logout(token: string) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true }
    });
    return { ok: true };
  }

  private static async generateAuthResponse(user: any) {
    const accessToken = jwt.sign(
      { userId: user.id, permissionVersion: user.permissionVersion }, 
      config.jwtSecret, 
      { expiresIn: ACCESS_EXP }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh', permissionVersion: user.permissionVersion }, 
      config.refreshSecret, 
      { expiresIn: `${REFRESH_EXP_DAYS}d` }
    );
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_EXP_DAYS);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      }
    });

    return {
      user,
      accessToken,
      refreshToken,
      expiresAt: expiresAt.getTime()
    };
  }
}
