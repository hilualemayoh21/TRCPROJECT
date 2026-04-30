"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = auth_service_1.AuthSchema.parse(req.body);
            const data = await auth_service_1.AuthService.login(req, email, password);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    static async register(req, res, next) {
        try {
            const data = await auth_service_1.AuthService.register(req.body);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    static async me(req, res, next) {
        try {
            const safeUser = { ...req.user, passwordHash: undefined };
            res.json(safeUser);
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const data = await auth_service_1.AuthService.refresh(refreshToken);
            // Contract says to return { token, accessToken, refreshToken, expiresAt } without user
            res.json({
                token: data.accessToken,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                expiresAt: data.expiresAt
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (refreshToken) {
                await auth_service_1.AuthService.logout(refreshToken);
            }
            res.json({ ok: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map