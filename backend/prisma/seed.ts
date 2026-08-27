import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
  { name: 'Geta' },
  { name: 'Arifin' },
  { name: 'Lundy' },
];

const tasks = [
  {
    employeeName: 'Geta',
    title: 'CTMS - Issue List Report',
    clickupTaskId: '86d43h365',
    clickupUrl: 'https://app.clickup.com/t/86d43h365',
  },
  {
    employeeName: 'Geta',
    title: 'Auth - OAuth2 Provider',
    clickupTaskId: '86d43h59b',
    clickupUrl: 'https://app.clickup.com/t/86d43h59b',
  },
  {
    employeeName: 'Arifin',
    title: 'EDC - Settlement Reconciliation',
    clickupTaskId: '86d43h37a',
    clickupUrl: 'https://app.clickup.com/t/86d43h37a',
  },
  {
    employeeName: 'Arifin',
    title: 'Reporting - Custom Report Builder',
    clickupTaskId: '86d43h5c3',
    clickupUrl: 'https://app.clickup.com/t/86d43h5c3',
  },
  {
    employeeName: 'Lundy',
    title: 'Portal - User Management',
    clickupTaskId: '86d43h41c',
    clickupUrl: 'https://app.clickup.com/t/86d43h41c',
  },
];

const progressEntries = [
  { taskIndex: 0, date: '2026-08-21', phase: 'QA', status: 'Completed Testing' },
  { taskIndex: 1, date: '2026-08-14', phase: 'TS', status: 'In Progress' },
  { taskIndex: 2, date: '2026-08-15', phase: 'TS', status: 'Documentation' },
  { taskIndex: 3, date: '2026-08-23', phase: 'QA', status: 'On Queue Testing' },
  { taskIndex: 4, date: '2026-08-16', phase: 'QA', status: 'Plan' },
];

function toDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

async function main() {
  // Employees
  for (const emp of employees) {
    const existing = await prisma.employee.findFirst({ where: { name: emp.name } });
    if (!existing) {
      await prisma.employee.create({ data: { name: emp.name } });
      console.log(`+ employee: ${emp.name}`);
    } else {
      console.log(`  employee exists: ${emp.name}`);
    }
  }

  // Tasks + Progress
  const taskIds: number[] = [];

  for (const task of tasks) {
    const employee = await prisma.employee.findFirst({
      where: { name: task.employeeName },
    });
    if (!employee) throw new Error(`Employee not found: ${task.employeeName}`);

    const existing = await prisma.task.findFirst({
      where: { employeeId: employee.id, clickupTaskId: task.clickupTaskId },
    });

    const dbTask =
      existing ??
      (await prisma.task.create({
        data: {
          employeeId: employee.id,
          clickupTaskId: task.clickupTaskId,
          title: task.title,
          clickupUrl: task.clickupUrl,
        },
      }));

    taskIds.push(dbTask.id);
    console.log(`+ task [${dbTask.id}]: ${task.title} (${task.employeeName})`);
  }

  // Progress entries
  let created = 0;
  let skipped = 0;

  for (const entry of progressEntries) {
    const taskId = taskIds[entry.taskIndex];
    const date = toDate(entry.date);

    const existing = await prisma.taskProgress.findUnique({
      where: { taskId_date: { taskId, date } },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.taskProgress.create({
      data: {
        taskId,
        date,
        phase: entry.phase,
        status: entry.status,
      },
    });
    created++;
  }

  console.log(`\nDone: ${created} progress entries created, ${skipped} skipped (already exist)`);
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
