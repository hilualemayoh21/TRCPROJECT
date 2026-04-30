"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const express_1 = require("express");
const client_1 = require("../../prisma/client");
const api_1 = require("../../utils/api");
const audit_service_1 = require("../audit/audit.service");
const resilience_1 = require("../../utils/resilience");
class UsersController {
    static async listUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            let pageSize = parseInt(req.query.pageSize) || 10;
            if (pageSize > 100)
                pageSize = 100;
            const q = req.query.q || '';
            const where = {
                deletedAt: null,
                ...(q ? {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { email: { contains: q, mode: 'insensitive' } }
                    ]
                } : {})
            };
            const [users, total] = await (0, resilience_1.withTimeout)(Promise.all([
                client_1.prisma.user.findMany({
                    where,
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    include: { roles: { include: { role: true } } },
                    orderBy: { createdAt: 'desc' }
                }),
                client_1.prisma.user.count({ where })
            ]), 5000, 'User listing query timed out');
            const items = users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                active: u.status === 'active',
                role: u.roles[0]?.role?.name || 'public_user'
            }));
            res.json((0, api_1.buildPaginatedResponse)(items, page, pageSize, total));
        }
        catch (e) {
            next(e);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { active } = req.body;
            const user = await client_1.prisma.user.update({
                where: { id },
                data: { status: active ? 'active' : 'inactive' },
                include: { roles: { include: { role: true } } }
            });
            await audit_service_1.AuditService.log(req, req.user?.id || null, active ? 'User activated' : 'User deactivated', 'User', id);
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                active: user.status === 'active',
                role: user.roles[0]?.role?.name || 'public_user'
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async assignRole(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const dbRole = await client_1.prisma.role.findUnique({ where: { name: role } });
            if (!dbRole)
                throw new api_1.AppError('Role not found', 404);
            // Prevent removing last admin
            if (dbRole.id !== 'super_admin') {
                const adminRole = await client_1.prisma.role.findUnique({ where: { name: 'super_admin' } });
                if (adminRole) {
                    const userRoles = await client_1.prisma.userRole.findFirst({ where: { userId: id, roleId: adminRole.id } });
                    if (userRoles) {
                        const adminCount = await client_1.prisma.userRole.count({ where: { roleId: adminRole.id } });
                        if (adminCount <= 1) {
                            throw new api_1.AppError('Cannot remove the last super_admin', 400);
                        }
                    }
                }
            }
            await client_1.prisma.userRole.deleteMany({ where: { userId: id } });
            await client_1.prisma.userRole.create({ data: { userId: id, roleId: dbRole.id } });
            const updatedUser = await client_1.prisma.user.update({
                where: { id },
                data: { permissionVersion: { increment: 1 } },
                include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
            });
            const permissions = updatedUser.roles[0]?.role?.permissions.map(rp => rp.permission.key) || [];
            if (updatedUser.roles[0]?.role?.id === 'super_admin')
                permissions.push('*');
            await audit_service_1.AuditService.log(req, req.user?.id || null, 'User role changed', 'User', id, { newRole: role });
            res.json({
                ok: true,
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    active: updatedUser.status === 'active',
                    role: updatedUser.roles[0]?.role?.name,
                    permissions
                }
            });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map