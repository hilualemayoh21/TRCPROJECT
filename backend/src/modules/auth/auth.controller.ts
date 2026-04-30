import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthSchema } from './auth.service';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = AuthSchema.parse(req.body);
      const data = await AuthService.login(req, email, password);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.register(req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const safeUser = { ...req.user, passwordHash: undefined };
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refresh(refreshToken);
      // Contract says to return { token, accessToken, refreshToken, expiresAt } without user
      res.json({
        token: data.accessToken,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      });
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
