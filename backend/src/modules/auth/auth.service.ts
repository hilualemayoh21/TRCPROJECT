import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { AppError, AuthError } from '../../utils/api';
import { z } from 'zod';
import { AuditService } from '../audit/audit.service';
import { AlertingService } from '../../utils/alerting';
import { EmailService } from '../../utils/email';

import { mapUser } from '../../utils/response-mappers';
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

export const VerifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

export const ResendVerificationSchema = z.object({
  email: z.string().email()
});

export const ResearcherInfoSchema = z.object({
  orcid: z.string().optional(),
  researchFocus: z.string(),
  academicTitle: z.string(),
  yearsExperience: z.number().optional(),
  bio: z.string().max(500),
  profileUrl: z.string().url().optional()
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

    // Self-healing: Ensure admin@trc.local always has the super_admin role
    if (user.email === 'admin@trc.local') {
      const hasSuperAdmin = user.roles.some(ur => ur.roleId === 'super_admin' || ur.role.name === 'super_admin');
      if (!hasSuperAdmin) {
        console.info('[AuthService] Self-healing: Assigning super_admin role to primary admin');
        const superAdminRole = await prisma.role.findUnique({ where: { id: 'super_admin' } });
        if (superAdminRole) {
          await prisma.userRole.upsert({
            where: { userId_roleId: { userId: user.id, roleId: superAdminRole.id } },
            update: {},
            create: { userId: user.id, roleId: superAdminRole.id }
          });
          // Refresh user object to include the new role
          const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
          });
          if (updatedUser) return this.generateAuthResponse(updatedUser);
        }
      }
    }

    AuditService.log(req, user.id, 'Login successful', 'Auth', user.id);

    return this.generateAuthResponse(user);
  }

  static async register(data: any) {
    const { email, password, name, institution, role = 'public_user' } = data;
    
    // 1. Look for ANY user with this email (including legacy deleted ones)
    const conflict = await prisma.user.findFirst({ 
      where: { email: { equals: email, mode: 'insensitive' } } 
    });

    if (conflict) {
      if (!conflict.deletedAt) {
        throw new AppError('Email already in use by an active account', 400);
      }
      
      // Legacy cleanup: rename the deleted user to free up the email
      await prisma.user.update({
        where: { id: conflict.id },
        data: { email: `${conflict.id}_cleanup_${Date.now()}_${conflict.email}`.slice(0, 254) }
      });
    }

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

    if (!dbRole) {
      const isPublic = role === 'public_user' || role === 'Public User';
      const isResearcher = role === 'researcher' || role === 'Researcher';
      
      if (isPublic) {
        dbRole = await prisma.role.create({ data: { id: 'public_user', name: 'public_user', isSystem: true } });
      } else if (isResearcher) {
        dbRole = await prisma.role.create({ data: { id: 'researcher', name: 'researcher', isSystem: true } });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        institution,
        status: (role === 'researcher' || role === 'Researcher') ? 'pending' : 'active',
        roles: dbRole ? { create: { roleId: dbRole.id } } : undefined,
        verificationCode: otp,
        verificationCodeExpires: expires
      },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });

    await EmailService.sendOTP(email, otp);

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
    try {
      if (!token || typeof token !== 'string') return { ok: true };
      
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true }
      });
      return { ok: true };
    } catch (error) {
      // Log error but don't crash logout
      console.error('[AuthService] Logout failed:', error);
      return { ok: true };
    }
  }

  static async verifyEmail(email: string, otp: string) {
    const user = await prisma.user.findFirst({ 
      where: { 
        email: { equals: email, mode: 'insensitive' },
        deletedAt: null
      } 
    });
    if (!user) throw new AppError('User not found or account deleted', 404);

    if (user.emailVerified) throw new AppError('Email already verified', 400);

    if (user.verificationCode !== otp) {
      throw new AppError('Invalid verification code', 400);
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      throw new AppError('Verification code expired', 400);
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      }
    });

    return { ok: true };
  }

  static async resendVerification(email: string) {
    const user = await prisma.user.findFirst({ 
      where: { 
        email: { equals: email, mode: 'insensitive' },
        deletedAt: null
      } 
    });
    if (!user) throw new AppError('User not found or account deleted', 404);

    if (user.emailVerified) throw new AppError('Email already verified', 400);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: otp,
        verificationCodeExpires: expires
      }
    });

    await EmailService.sendOTP(email, otp);

    return { ok: true };
  }

  static async submitResearcherInfo(userId: string, data: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const profile = await prisma.researcherProfile.create({
      data: {
        userId,
        ...data
      }
    });

    // Researcher stays pending until admin approves them.
    // If we wanted to change status, we'd do it here.

    return profile;
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
      user: mapUser(user),
      accessToken,
      refreshToken,
      expiresAt: expiresAt.getTime()
    };
  }
}
