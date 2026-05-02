"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const express_1 = require("express");
const client_1 = require("../../prisma/client");
const audit_service_1 = require("../audit/audit.service");
const api_1 = require("../../utils/api");
class RolesController {
    static async getRoles(req, res, next) {
        try {
            const roles = await client_1.prisma.role.findMany({
                where: { deletedAt: null },
                include: { permissions: { include: { permission: true } } }
            });
            const formatted = roles.map(r => ({
                id: r.id,
                name: r.name,
                description: r.description,
                isSystem: r.isSystem,
                permissions: r.permissions.map(rp => rp.permission.key)
            }));
            res.json(formatted);
        }
        catch (e) {
            next(e);
        }
    }
    static async createRole(req, res, next) {
        try {
            const { name, description, permissions } = req.body;
            const existing = await client_1.prisma.role.findUnique({ where: { name } });
            if (existing)
                throw new api_1.AppError('Role name must be unique', 400);
            
            // Generate human-readable ID from role name
            const roleId = name.toLowerCase().replace(/\s+/g, '_');
            
            const role = await client_1.prisma.role.create({
                data: { id: roleId, name, description }
            });
            if (permissions && Array.isArray(permissions)) {
                for (const p of permissions) {
                    let perm = await client_1.prisma.permission.findUnique({ where: { key: p } });
                    if (!perm)
                        perm = await client_1.prisma.permission.create({ data: { key: p } });
                    await client_1.prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perm.id } });
                }
            }
            await audit_service_1.AuditService.log(req, req.user?.id || null, 'Role created', 'Role', role.id, { name });
            res.json({
                id: role.id,
                name: role.name,
                description: role.description,
                isSystem: role.isSystem,
                permissions: permissions || []
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async updateRole(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description, permissions } = req.body;
            const role = await client_1.prisma.role.findUnique({ where: { id } });
            if (!role)
                throw new api_1.AppError('Role not found', 404);
            if (role.isSystem && (name || description))
                throw new api_1.AppError('Cannot modify system role name or description', 403);
            const updated = await client_1.prisma.role.update({
                where: { id },
                data: { name, description }
            });
            if (permissions && Array.isArray(permissions)) {
                await client_1.prisma.rolePermission.deleteMany({ where: { roleId: id } });
                for (const p of permissions) {
                    let perm = await client_1.prisma.permission.findUnique({ where: { key: p } });
                    if (!perm)
                        perm = await client_1.prisma.permission.create({ data: { key: p } });
                    await client_1.prisma.rolePermission.create({ data: { roleId: id, permissionId: perm.id } });
                }
                // Increment permissionVersion for all users with this role
                await client_1.prisma.user.updateMany({
                    where: { roles: { some: { roleId: id } } },
                    data: { permissionVersion: { increment: 1 } }
                });
            }
            const freshRole = await client_1.prisma.role.findUnique({
                where: { id },
                include: { permissions: { include: { permission: true } } }
            });
            await audit_service_1.AuditService.log(req, req.user?.id || null, 'Role updated', 'Role', id, { name });
            res.json({
                id: freshRole.id,
                name: freshRole.name,
                description: freshRole.description,
                isSystem: freshRole.isSystem,
                permissions: freshRole.permissions.map(rp => rp.permission.key)
            });
        }
        catch (e) {
            next(e);
        }
    }
    static async deleteRole(req, res, next) {
        try {
            const { id } = req.params;
            const role = await client_1.prisma.role.findUnique({ where: { id } });
            if (!role)
                throw new api_1.AppError('Role not found', 404);
            if (role.isSystem)
                throw new api_1.AppError('Cannot delete system roles', 403);
            await client_1.prisma.role.delete({ where: { id } });
            await audit_service_1.AuditService.log(req, req.user?.id || null, 'Role deleted', 'Role', id);
            res.json({ ok: true });
        }
        catch (e) {
            next(e);
        }
    }
    static async togglePermission(req, res, next) {
        try {
            const { id } = req.params;
            const { permission } = req.body;
            const isAdd = req.method === 'POST';
            const role = await client_1.prisma.role.findUnique({ where: { id } });
            if (!role)
                throw new api_1.AppError('Role not found', 404);
            let perm = await client_1.prisma.permission.findUnique({ where: { key: permission } });
            if (!perm && isAdd) {
                perm = await client_1.prisma.permission.create({ data: { key: permission } });
            }
            if (perm) {
                if (isAdd) {
                    await client_1.prisma.rolePermission.upsert({
                        where: { roleId_permissionId: { roleId: id, permissionId: perm.id } },
                        update: {},
                        create: { roleId: id, permissionId: perm.id }
                    });
                }
                else {
                    await client_1.prisma.rolePermission.deleteMany({
                        where: { roleId: id, permissionId: perm.id }
                    });
                }
                // Increment permissionVersion for all users with this role
                await client_1.prisma.user.updateMany({
                    where: { roles: { some: { roleId: id } } },
                    data: { permissionVersion: { increment: 1 } }
                });
            }
            const updated = await client_1.prisma.role.findUnique({
                where: { id },
                include: { permissions: { include: { permission: true } } }
            });
            await audit_service_1.AuditService.log(req, req.user?.id || null, isAdd ? 'Role permission added' : 'Role permission removed', 'Role', id, { permission });
            res.json({ ok: true, permissions: updated.permissions.map(rp => rp.permission.key) });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.RolesController = RolesController;
//# sourceMappingURL=roles.controller.js.map