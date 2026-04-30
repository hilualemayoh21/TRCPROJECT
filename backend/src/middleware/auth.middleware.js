"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../prisma/client");
const api_1 = require("../utils/api");
const config_1 = require("../config");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new api_1.AppError('Unauthorized', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        const user = await client_1.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.status !== 'active' || user.deletedAt) {
            throw new api_1.AppError('Unauthorized', 401);
        }
        if (user.permissionVersion !== decoded.permissionVersion) {
            throw new api_1.AppError('Permissions changed. Please re-authenticate.', 401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new api_1.AppError('Unauthorized', 401));
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.middleware.js.map