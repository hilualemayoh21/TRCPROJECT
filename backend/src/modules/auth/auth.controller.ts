import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthSchema } from './auth.service';
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
      const data = await AuthService.register(req.body);
      res.json(mapAuthResponse(data.user, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      }));
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
