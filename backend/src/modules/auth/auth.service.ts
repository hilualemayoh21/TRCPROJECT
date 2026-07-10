import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { AppError, AuthError } from '../../utils/api';
import { z } from 'zod';
import { AuditService } from '../audit/audit.service';
import { AlertingService } from '../../utils/alerting';
import { EmailService } from '../../utils/email';
import { OtpService } from '../../utils/otp';
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

export const ForgotPasswordSchema = z.object({
  email: z.string().email()
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(6)
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
    
    // 1. Conflict check
    const conflict = await prisma.user.findFirst({ 
      where: { email: { equals: email, mode: 'insensitive' } } 
    });

    if (conflict) {
      if (!conflict.deletedAt) throw new AppError('Email already in use', 400);
      
      // Cleanup legacy deleted account
      await prisma.user.update({
        where: { id: conflict.id },
        data: { email: `${conflict.id}_del_${Date.now()}` }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    let dbRole = await prisma.role.findFirst({ 
      where: { name: { equals: role, mode: 'insensitive' }, deletedAt: null } 
    });

    if (!dbRole) {
      dbRole = await prisma.role.findFirst({ where: { id: 'public_user' } });
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        institution,
        emailVerified: false,
        status: (role.toLowerCase() === 'researcher') ? 'pending' : 'active',
        roles: dbRole ? { create: { roleId: dbRole.id } } : undefined,
      },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });

    // Send OTP for email verification (stored in Postgres — no Redis required)
    const otp = OtpService.generate();
    await OtpService.saveForUser(user.id, otp);
    const emailDelivery = await EmailService.sendOTP(user.email, otp, 'verification');

    return {
      ...await this.generateAuthResponse(user),
      verificationEmailSent: emailDelivery.sent,
      emailDeliveryHint: emailDelivery.hint,
    };
  }

  static async verifyEmail(email: string, otp: string) {
    const user = await prisma.user.findFirst({ 
      where: { email: { equals: email, mode: 'insensitive' }, deletedAt: null } 
    });
    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerified) throw new AppError('Email already verified', 400);

    if (!OtpService.isValid(user, otp)) {
      throw new AppError('Invalid or expired verification code', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationCode: null, verificationCodeExpires: null }
    });

    return { ok: true, message: 'Email verified successfully' };
  }

  static async resendVerification(email: string) {
    const user = await prisma.user.findFirst({ 
      where: { email: { equals: email, mode: 'insensitive' }, deletedAt: null } 
    });
    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerified) throw new AppError('Email already verified', 400);

    const otp = OtpService.generate();
    await OtpService.saveForUser(user.id, otp);
    const emailDelivery = await EmailService.sendOTP(user.email, otp, 'verification');

    return {
      ok: true,
      message: emailDelivery.sent
        ? 'Verification code resent'
        : 'Verification code generated, but email could not be delivered',
      verificationEmailSent: emailDelivery.sent,
      emailDeliveryHint: emailDelivery.hint,
    };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findFirst({ 
      where: { email: { equals: email, mode: 'insensitive' }, deletedAt: null } 
    });
    
    // Security: Don't reveal if email exists, just say "If account exists..."
    if (user) {
      const otp = OtpService.generate();
      await OtpService.saveForUser(user.id, otp);
      await EmailService.sendOTP(user.email, otp, 'reset');
    }

    return { ok: true, message: 'If an account exists with that email, a reset code has been sent.' };
  }

  static async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await prisma.user.findFirst({ 
      where: { email: { equals: email, mode: 'insensitive' }, deletedAt: null } 
    });
    if (!user) throw new AppError('User not found', 404);

    if (!OtpService.isValid(user, otp)) {
      throw new AppError('Invalid or expired reset code', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        passwordHash,
        failedLoginAttempts: 0,
        lockUntil: null,
        verificationCode: null,
        verificationCodeExpires: null,
      }
    });

    return { ok: true, message: 'Password reset successfully' };
  }

  static async refresh(token: string) {
    try {
      jwt.verify(token, config.refreshSecret);
    } catch (e) {
      throw new AuthError('Invalid or expired refresh token');
    }

    const rt = await prisma.refreshToken.findUnique({ where: { token } });
    if (!rt) throw new AuthError('Invalid refresh token');

    if (rt.revoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: rt.userId },
        data: { revoked: true }
      });
      throw new AuthError('Security Alert: Token reuse detected.');
    }

    if (rt.expiresAt < new Date()) throw new AuthError('Refresh token expired');

    await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });

    const user = await prisma.user.findUnique({
      where: { id: rt.userId },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });

    if (!user || user.deletedAt) throw new AuthError('User not found');

    return this.generateAuthResponse(user);
  }

  static async logout(token: string) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true }
    });
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
