const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listRoles() {
  try {
    const roles = await prisma.role.findMany();
    console.log('Roles in DB:', JSON.stringify(roles, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listRoles();
