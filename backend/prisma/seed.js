"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // 1. Create Permissions
    const permissions = [
        'manage_users',
        'manage_roles',
        'view_audit_logs',
        'view_dashboard',
        'approve_resources',
        'resolve_reports'
    ];
    const permMap = {};
    for (const key of permissions) {
        const p = await prisma.permission.upsert({
            where: { key },
            update: {},
            create: { key }
        });
        permMap[key] = p.id;
    }
    // 2. Create Roles
    const roles = [
        { id: 'super_admin', name: 'Super Admin', isSystem: true, perms: ['*'] },
        { id: 'admin', name: 'Admin', isSystem: true, perms: ['manage_users', 'view_dashboard', 'view_audit_logs'] },
        { id: 'moderator', name: 'Moderator', isSystem: true, perms: ['resolve_reports'] },
        { id: 'researcher', name: 'Researcher', isSystem: true, perms: ['view_dashboard'] },
        { id: 'public_user', name: 'Public User', isSystem: true, perms: [] }
    ];
    for (const r of roles) {
        const role = await prisma.role.upsert({
            where: { id: r.id },
            update: { name: r.name, isSystem: r.isSystem },
            create: { id: r.id, name: r.name, isSystem: r.isSystem }
        });
        if (r.perms[0] !== '*') {
            for (const pKey of r.perms) {
                await prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: role.id, permissionId: permMap[pKey] } },
                    update: {},
                    create: { roleId: role.id, permissionId: permMap[pKey] }
                });
            }
        }
    }
    // 3. Create Super Admin User
    const adminEmail = 'admin@trc.local';
    const passwordHash = await bcrypt_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { passwordHash },
        create: {
            email: adminEmail,
            name: 'TRC Admin',
            passwordHash,
            status: 'active'
        }
    });
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: admin.id, roleId: 'super_admin' } },
        update: {},
        create: { userId: admin.id, roleId: 'super_admin' }
    });
    console.log('✅ Seeding complete.');
    console.log('Email: admin@trc.local');
    console.log('Password: admin123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map