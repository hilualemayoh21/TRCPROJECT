import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthSchema, RegisterSchema, VerifyEmailSchema, ResendVerificationSchema, ResearcherInfoSchema, ForgotPasswordSchema, ResetPasswordSchema } from './auth.service';
import { mapAuthResponse, mapUser, mapRefreshResponse } from '../../utils/response-mappers';

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
      const data = await AuthService.register(validatedData);
      res.json(mapAuthResponse(data.user, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      }));
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
      const result = await AuthService.submitResearcherInfo(userId, validatedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(mapUser(req.user as any));
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
