"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.AuthSchema = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../../prisma/client");
const api_1 = require("../../utils/api");
const zod_1 = require("zod");
const audit_service_1 = require("../audit/audit.service");
const alerting_1 = require("../../utils/alerting");
const config_1 = require("../../config");
const ACCESS_EXP = '15m';
const REFRESH_EXP_DAYS = 7;
exports.AuthSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
class AuthService {
    static async login(req, email, password) {
        const user = await client_1.prisma.user.findUnique({
            where: { email },
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
        });
        if (!user || user.deletedAt) {
            audit_service_1.AuditService.log(req, null, 'Login failed', 'Auth', email, { reason: 'User not found' });
            throw new api_1.AuthError('Invalid credentials');
        }
        if (user.lockUntil && user.lockUntil > new Date()) {
            audit_service_1.AuditService.log(req, user.id, 'Login failed', 'Auth', user.id, { reason: 'Account locked' });
            throw new api_1.AuthError('Account is temporarily locked. Please try again later.');
        }
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            const attempts = user.failedLoginAttempts + 1;
            const lockUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // 30 min lock
            await client_1.prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: attempts, lockUntil }
            });
            audit_service_1.AuditService.log(req, user.id, 'Login failed', 'Auth', user.id, { reason: 'Invalid password', attempt: attempts });
            throw new api_1.AuthError('Invalid credentials');
        }
        // Reset attempts on success
        await client_1.prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockUntil: null }
        });
        audit_service_1.AuditService.log(req, user.id, 'Login successful', 'Auth', user.id);
        return this.generateAuthResponse(user);
    }
    static async register(data) {
        const { email, password, name, role = 'public_user' } = data;
        const existing = await client_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new api_1.AppError('Email already in use', 400);
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        let dbRole = await client_1.prisma.role.findFirst({ where: { name: role, deletedAt: null } });
        if (!dbRole && role === 'public_user') {
            dbRole = await client_1.prisma.role.create({ data: { id: 'public_user', name: 'public_user', isSystem: true } });
        }
        const user = await client_1.prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                roles: dbRole ? { create: { roleId: dbRole.id } } : undefined
            },
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
        });
        return this.generateAuthResponse(user);
    }
    static async refresh(token) {
        try {
            jsonwebtoken_1.default.verify(token, config_1.config.refreshSecret);
        }
        catch (e) {
            throw new api_1.AuthError('Invalid or expired refresh token');
        }
        const rt = await client_1.prisma.refreshToken.findUnique({ where: { token } });
        if (!rt)
            throw new api_1.AuthError('Invalid refresh token');
        // Token Reuse Detection
        if (rt.revoked) {
            await client_1.prisma.refreshToken.updateMany({
                where: { userId: rt.userId },
                data: { revoked: true }
            });
            alerting_1.AlertingService.critical(`Security Alert: Refresh token reuse detected for user ${rt.userId}. Panic mode triggered.`, {
                userId: rt.userId,
                tokenId: rt.id
            }).catch(() => { });
            throw new api_1.AuthError('Security Alert: Refresh token reuse detected. All sessions invalidated.');
        }
        if (rt.expiresAt < new Date()) {
            throw new api_1.AuthError('Refresh token expired');
        }
        await client_1.prisma.$transaction(async (tx) => {
            await tx.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });
        });
        const user = await client_1.prisma.user.findUnique({
            where: { id: rt.userId },
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
        });
        if (!user || user.status !== 'active' || user.deletedAt) {
            throw new api_1.AuthError('User account is inactive or deleted');
        }
        return this.generateAuthResponse(user);
    }
    static async logout(token) {
        await client_1.prisma.refreshToken.updateMany({
            where: { token },
            data: { revoked: true }
        });
        return { ok: true };
    }
    static async generateAuthResponse(user) {
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, permissionVersion: user.permissionVersion }, config_1.config.jwtSecret, { expiresIn: ACCESS_EXP });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, type: 'refresh', permissionVersion: user.permissionVersion }, config_1.config.refreshSecret, { expiresIn: `${REFRESH_EXP_DAYS}d` });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_EXP_DAYS);
        await client_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt,
            }
        });
        const permissions = new Set();
        for (const ur of user.roles) {
            if (ur.role.id === 'super_admin')
                permissions.add('*');
            ur.role.permissions.forEach((rp) => permissions.add(rp.permission.key));
        }
        const { passwordHash, ...safeUser } = user;
        const primaryRole = user.roles[0]?.role?.name || 'public_user';
        return {
            user: { ...safeUser, role: primaryRole },
            token: accessToken,
            accessToken,
            refreshToken,
            expiresAt: expiresAt.getTime(),
            permissions: Array.from(permissions)
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map