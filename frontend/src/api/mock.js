const MOCK_EMPLOYEES = [
  { id: 1, name: 'Geta' },
  { id: 2, name: 'Arifin' },
  { id: 3, name: 'Lundy' },
];

const MOCK_PHASES = {
  TS: ['Completed', 'Documentation', 'On Hold', 'In Progress', 'Plan'],
  QA: ['Completed', 'Completed Testing', 'Completed with Feedback', 'Testing', 'On Queue Testing', 'Plan'],
};

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

const submittedKeys = new Set();

export async function getEmployees() {
  await delay();
  return { data: [...MOCK_EMPLOYEES] };
}

export async function getPhases() {
  await delay();
  return { data: Object.fromEntries(Object.entries(MOCK_PHASES).map(([k, v]) => [k, [...v]])) };
}

export async function saveLsppt(payload) {
  await delay(600);

  const tasks = payload?.tasks ?? [];
  if (!payload?.employee_id) throw httpError(400, 'employee_id is required');
  if (!payload?.date) throw httpError(400, 'date is required');
  if (tasks.length === 0) throw httpError(400, 'At least one task is required');

  for (const task of tasks) {
    const statuses = MOCK_PHASES[task.phase];
    if (!statuses || !statuses.includes(task.status)) {
      throw httpError(400, `Invalid status "${task.status}" for phase "${task.phase}"`);
    }
  }

  const seen = new Set();
  for (const task of tasks) {
    const key = `${payload.date}:${String(task.clickup_task_id).toLowerCase()}`;
    if (submittedKeys.has(key) || seen.has(key)) {
      throw httpError(409, `Duplicate task "${task.clickup_task_id}" on ${payload.date}`);
    }
    seen.add(key);
  }

  seen.forEach((key) => submittedKeys.add(key));

  return { message: 'LSPPT saved successfully' };
}
