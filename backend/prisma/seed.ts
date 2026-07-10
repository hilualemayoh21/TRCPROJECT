import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Permissions
  const permissions = [
    'view_users', 'create_users', 'update_users', 'delete_users',
    'view_roles', 'create_roles', 'update_roles', 'delete_roles',
    'view_resources', 'create_resources', 'update_resources', 'delete_resources', 'approve_resources',
    'view_reports', 'resolve_reports',
    'view_researchers', 'approve_researchers',
    'view_audit_logs',
    'view_dashboard'
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
    { id: 'admin', name: 'admin', isSystem: true, perms: [
      'view_users', 'create_users', 'update_users', 'delete_users',
      'view_roles', 'create_roles', 'update_roles', 'delete_roles',
      'view_resources', 'create_resources', 'update_resources', 'delete_resources', 'approve_resources',
      'view_reports', 'resolve_reports',
      'view_researchers', 'approve_researchers',
      'view_audit_logs', 'view_dashboard'
    ] },
    { id: 'moderator', name: 'moderator', isSystem: true, perms: ['view_reports', 'resolve_reports', 'view_resources', 'update_resources', 'approve_resources', 'view_dashboard'] },
    { id: 'researcher', name: 'researcher', isSystem: true, perms: ['view_dashboard', 'create_resources', 'update_resources'] },
    { id: 'public_user', name: 'public_user', isSystem: true, perms: [] }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: { name: r.name, isSystem: r.isSystem },
      create: { id: r.id, name: r.name, isSystem: r.isSystem }
    });

    // 🔑 Clear ALL existing permissions for this role first, then re-add
    await prisma.rolePermission.deleteMany({ where: { roleId: r.id } });

    if (r.perms[0] !== '*') {
      for (const pKey of r.perms) {
        const permId = permMap[pKey];
        if (!permId) { console.warn(`⚠️  Unknown permission key: ${pKey}`); continue; }
        await prisma.rolePermission.create({
          data: { roleId: r.id, permissionId: permId }
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
      status: 'active',
      emailVerified: true
    },
    create: {
      email: adminEmail,
      name: 'TRC Admin',
      passwordHash,
      status: 'active',
      emailVerified: true
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
