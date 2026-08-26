import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = ['Geta', 'Arifin', 'Lundy'];

async function main() {
  for (const name of employees) {
    const existing = await prisma.employee.findFirst({ where: { name } });
    if (!existing) {
      await prisma.employee.create({ data: { name } });
      console.log(`Seeded employee: ${name}`);
    } else {
      console.log(`Employee already exists: ${name}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
