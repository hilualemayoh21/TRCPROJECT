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
    'resolve_reports',
    'upload_resources',
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

  // Seed Categories
  const categories = [
    { name: 'Research Papers', slug: 'research-papers', description: 'Academic research and publications', color: '#6B3FA0' },
    { name: 'Historical Archives', slug: 'historical-archives', description: 'Historical documents and records', color: '#C05621' },
    { name: 'Educational Materials', slug: 'educational-materials', description: 'Textbooks, courses, and learning resources', color: '#2B6CB0' },
    { name: 'Cultural Heritage', slug: 'cultural-heritage', description: 'Art, music, literature, and traditions', color: '#9B2C2C' },
    { name: 'News & Reports', slug: 'news-reports', description: 'Current news coverage and investigative reports', color: '#2F855A' },
    { name: 'Datasets', slug: 'datasets', description: 'Statistical and scientific datasets', color: '#6B46C1' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  // 2. Create Roles
  const roles = [
    { id: 'super_admin', name: 'super_admin', isSystem: true, perms: ['*'] },
    { id: 'admin', name: 'admin', isSystem: true, perms: ['manage_users', 'manage_roles', 'approve_resources', 'view_dashboard', 'view_audit_logs'] },
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
    update: { 
      passwordHash,
      failedLoginAttempts: 0,
      lockUntil: null,
      status: 'active'
    },
    create: {
      email: adminEmail,
      name: 'TRC Admin',
      passwordHash,
      status: 'active'
    }
  });

  // Ensure the admin has the super_admin role
  const superAdminRole = await prisma.role.findUnique({ where: { id: 'super_admin' } });
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: admin.id, roleId: superAdminRole.id }
    });
  }

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
