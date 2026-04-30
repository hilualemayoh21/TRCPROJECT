import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

  const permMap: Record<string, string> = {};

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
    { id: 'super_admin', name: 'super_admin', isSystem: true, perms: ['*'] },
    { id: 'admin', name: 'admin', isSystem: true, perms: ['manage_users', 'view_dashboard', 'view_audit_logs'] },
    { id: 'moderator', name: 'moderator', isSystem: true, perms: ['resolve_reports'] },
    { id: 'researcher', name: 'researcher', isSystem: true, perms: ['view_dashboard'] },
    { id: 'public_user', name: 'public_user', isSystem: true, perms: [] }
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
  const passwordHash = await bcrypt.hash('admin123', 10);

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
