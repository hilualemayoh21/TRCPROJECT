"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.resolvePermissions = void 0;
const express_1 = require("express");
const client_1 = require("../prisma/client");
const api_1 = require("../utils/api");
const redis_1 = require("../utils/redis");
const audit_service_1 = require("../modules/audit/audit.service");
const resolvePermissions = async (req, res, next) => {
    try {
        if (!req.user)
            throw new api_1.AppError('Unauthorized', 401);
        const cacheKey = `perms:${req.user.id}:${req.user.permissionVersion}`;
        const cachedPerms = await (0, redis_1.cacheGet)(cacheKey);
        if (cachedPerms) {
            req.permissions = new Set(cachedPerms);
            return next();
        }
        const userRoles = await client_1.prisma.userRole.findMany({
            where: { userId: req.user.id },
            include: {
                role: {
                    include: { permissions: { include: { permission: true } } }
                }
            }
        });
        const permissions = new Set();
        for (const ur of userRoles) {
            if (ur.role.id === 'super_admin' || ur.role.name === 'Super Admin') {
                permissions.add('*');
            }
            ur.role.permissions.forEach(rp => permissions.add(rp.permission.key));
        }
        // Cache permissions for 10 minutes
        await (0, redis_1.cacheSet)(cacheKey, Array.from(permissions), 600);
        req.permissions = permissions;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.resolvePermissions = resolvePermissions;
const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.permissions) {
            return next(new api_1.PermissionError());
        }
        if (req.permissions.has('*') || req.permissions.has(requiredPermission)) {
            return next();
        }
        // Log the denial
        audit_service_1.AuditService.log(req, req.user?.id || null, 'Permission denied', 'Security', 'NONE', { requiredPermission, hasPermissions: Array.from(req.permissions) }).catch(() => { });
        return next(new api_1.PermissionError(`Insufficient permissions: ${requiredPermission}`));
    };
};
exports.requirePermission = requirePermission;
//# sourceMappingURL=rbac.middleware.js.map