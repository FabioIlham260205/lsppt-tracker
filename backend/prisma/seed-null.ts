import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
  { name: 'Geta' },
  { name: 'Arifin' },
  { name: 'Lundy' },
];

async function main() {
  for (const emp of employees) {
    const existing = await prisma.employee.findFirst({ where: { name: emp.name } });
    if (!existing) {
      await prisma.employee.create({ data: { name: emp.name } });
      console.log(`+ employee: ${emp.name}`);
    } else {
      console.log(`  employee exists: ${emp.name}`);
    }
  }

  console.log('\nDone: employees seeded');
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