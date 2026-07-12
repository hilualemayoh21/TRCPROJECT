import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthSchema, RegisterSchema, VerifyEmailSchema, ResendVerificationSchema, ResearcherInfoSchema, ForgotPasswordSchema, ResetPasswordSchema } from './auth.service';
import { mapAuthResponse, mapUser, mapRefreshResponse } from '../../utils/response-mappers';
import { AppError } from '../../utils/api';
import { prisma } from '../../prisma/client';
import logger from '../../utils/logger';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = AuthSchema.parse(req.body);
      const data = await AuthService.login(req, email, password);
      res.json(mapAuthResponse(data.user, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      }));
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      logger.info({ email: validatedData.email }, 'Registration request received');
      const data = await AuthService.register(validatedData);
      logger.info(
        {
          email: validatedData.email,
          userId: data.user.id,
          verificationEmailSent: data.verificationEmailSent,
        },
        data.verificationEmailSent
          ? 'Registration completed, verification email sent'
          : 'Registration completed, verification email NOT sent'
      );
      res.json({
        ...mapAuthResponse(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
        }),
        verificationEmailSent: data.verificationEmailSent,
        emailDeliveryHint: data.emailDeliveryHint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = VerifyEmailSchema.parse(req.body);
      const result = await AuthService.verifyEmail(email, otp);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = ResendVerificationSchema.parse(req.body);
      logger.info({ email }, 'Resend verification request received');
      const result = await AuthService.resendVerification(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, password } = ResetPasswordSchema.parse(req.body);
      const result = await AuthService.resetPassword(email, otp, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async submitResearcherInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id;
      const validatedData = ResearcherInfoSchema.parse(req.body);
      const files = (req.files || {}) as Record<string, Express.Multer.File[]>;
      const result = await AuthService.submitResearcherInfo(userId, validatedData, files);
      res.json({ ok: true, profile: result, message: 'Application submitted for admin review' });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: (req.user as any).id },
        include: {
          roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
          researcherProfile: true,
        },
      });
      if (!user) throw new AppError('User not found', 404);
      res.json(mapUser(user));
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refresh(refreshToken);
      res.json(mapRefreshResponse({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      }));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
