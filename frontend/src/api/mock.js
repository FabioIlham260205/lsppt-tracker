const EMPLOYEES = [
  { id: 1, name: 'Geta' },
  { id: 2, name: 'Arifin' },
  { id: 3, name: 'Lundy' },
];

const MOCK_PHASES = {
  TS: ['Completed', 'Documentation', 'On Hold', 'In Progress', 'Plan'],
  QA: ['Completed', 'Completed Testing', 'Completed with Feedback', 'Testing', 'On Queue Testing', 'Plan'],
};

const HISTORY_ROWS = [
  { id: 1, task_id: 3, employee: 'Geta', date: '2026-08-21', task: 'CTMS - Issue List Report', clickup_task_id: '86d43h365', phase: 'QA', status: 'Completed Testing' },
  { id: 2, task_id: 3, employee: 'Geta', date: '2026-08-20', task: 'CTMS - Issue List Report', clickup_task_id: '86d43h365', phase: 'QA', status: 'Testing' },
  { id: 3, task_id: 3, employee: 'Geta', date: '2026-08-19', task: 'CTMS - Issue List Report', clickup_task_id: '86d43h365', phase: 'QA', status: 'Plan' },
  { id: 4, task_id: 7, employee: 'Arifin', date: '2026-08-22', task: 'EDC - Settlement Reconciliation', clickup_task_id: '86d43h37a', phase: 'TS', status: 'Documentation' },
  { id: 5, task_id: 7, employee: 'Arifin', date: '2026-08-15', task: 'EDC - Settlement Reconciliation', clickup_task_id: '86d43h37a', phase: 'TS', status: 'In Progress' },
  { id: 6, task_id: 9, employee: 'Lundy', date: '2026-08-23', task: 'Portal - User Management', clickup_task_id: '86d43h41c', phase: 'QA', status: 'On Queue Testing' },
  { id: 7, task_id: 9, employee: 'Lundy', date: '2026-08-16', task: 'Portal - User Management', clickup_task_id: '86d43h41c', phase: 'QA', status: 'Plan' },
  { id: 8, task_id: 11, employee: 'Lundy', date: '2026-08-18', task: 'Reporting - Monthly Export', clickup_task_id: '86d43h44f', phase: 'TS', status: 'On Hold' },
  { id: 9, task_id: 13, employee: 'Geta', date: '2026-08-14', task: 'Mobile - Push Notification Service', clickup_task_id: '86d43h48k', phase: 'QA', status: 'Completed' },
  { id: 10, task_id: 15, employee: 'Arifin', date: '2026-08-24', task: 'Dashboard - Audit Trail Viewer', clickup_task_id: '86d43h4m2', phase: 'TS', status: 'Plan' },
  { id: 11, task_id: 17, employee: 'Lundy', date: '2026-08-24', task: 'Gateway - Timeout Handling', clickup_task_id: '86d43h4p8', phase: 'QA', status: 'Testing' },
  { id: 12, task_id: 17, employee: 'Lundy', date: '2026-08-21', task: 'Gateway - Timeout Handling', clickup_task_id: '86d43h4p8', phase: 'QA', status: 'Completed with Feedback' },
  { id: 13, task_id: 19, employee: 'Geta', date: '2026-08-11', task: 'Auth - SSO Integration', clickup_task_id: '86d43h4s5', phase: 'TS', status: 'Completed' },
  { id: 14, task_id: 21, employee: 'Arifin', date: '2026-08-08', task: 'Billing - Invoice PDF Generator', clickup_task_id: '86d43h4w9', phase: 'QA', status: 'Completed with Feedback' },
  { id: 15, task_id: 23, employee: 'Lundy', date: '2026-08-05', task: 'Sync - Retry Mechanism', clickup_task_id: '86d43h52d', phase: 'TS', status: 'In Progress' },
  { id: 16, task_id: 25, employee: 'Geta', date: '2026-08-03', task: 'Cache - Redis Migration', clickup_task_id: '86d43h56g', phase: 'TS', status: 'Plan' },

  { id: 17, task_id: 27, employee: 'Geta', date: '2026-08-24', task: 'Auth - OAuth2 Provider', clickup_task_id: '86d43h59b', phase: 'QA', status: 'Testing' },
  { id: 18, task_id: 27, employee: 'Geta', date: '2026-08-21', task: 'Auth - OAuth2 Provider', clickup_task_id: '86d43h59b', phase: 'QA', status: 'Plan' },
  { id: 19, task_id: 27, employee: 'Geta', date: '2026-08-18', task: 'Auth - OAuth2 Provider', clickup_task_id: '86d43h59b', phase: 'TS', status: 'Documentation' },
  { id: 20, task_id: 27, employee: 'Geta', date: '2026-08-14', task: 'Auth - OAuth2 Provider', clickup_task_id: '86d43h59b', phase: 'TS', status: 'In Progress' },
  { id: 21, task_id: 27, employee: 'Geta', date: '2026-08-11', task: 'Auth - OAuth2 Provider', clickup_task_id: '86d43h59b', phase: 'TS', status: 'Plan' },

  { id: 22, task_id: 29, employee: 'Arifin', date: '2026-08-23', task: 'Reporting - Custom Report Builder', clickup_task_id: '86d43h5c3', phase: 'QA', status: 'On Queue Testing' },
  { id: 23, task_id: 29, employee: 'Arifin', date: '2026-08-19', task: 'Reporting - Custom Report Builder', clickup_task_id: '86d43h5c3', phase: 'QA', status: 'Plan' },
  { id: 24, task_id: 29, employee: 'Arifin', date: '2026-08-15', task: 'Reporting - Custom Report Builder', clickup_task_id: '86d43h5c3', phase: 'TS', status: 'In Progress' },
  { id: 25, task_id: 29, employee: 'Arifin', date: '2026-08-11', task: 'Reporting - Custom Report Builder', clickup_task_id: '86d43h5c3', phase: 'TS', status: 'Plan' },

  { id: 26, task_id: 31, employee: 'Lundy', date: '2026-08-22', task: 'Mobile - Deep Link Handler', clickup_task_id: '86d43h5f7', phase: 'QA', status: 'Completed with Feedback' },
  { id: 27, task_id: 31, employee: 'Lundy', date: '2026-08-17', task: 'Mobile - Deep Link Handler', clickup_task_id: '86d43h5f7', phase: 'QA', status: 'Completed' },
  { id: 28, task_id: 31, employee: 'Lundy', date: '2026-08-12', task: 'Mobile - Deep Link Handler', clickup_task_id: '86d43h5f7', phase: 'TS', status: 'Completed' },
];

const SIMULATE_ERROR = false;
const LATENCY_MS = 600;

const submittedKeys = new Set();

function testParams() {
  return new URLSearchParams(window.location.search);
}

function respond(data) {
  const params = testParams();
  const delay = Math.max(Number(params.get('_delay')) || LATENCY_MS, 200);
  const fail = SIMULATE_ERROR || params.has('_error');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('Tidak dapat terhubung ke server'));
      } else {
        resolve({ data });
      }
    }, delay);
  });
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function getEmployees() {
  return respond(EMPLOYEES);
}

export function getPhases() {
  return respond(MOCK_PHASES);
}

export async function saveLsppt(payload) {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

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

export function getHistory() {
  const sorted = [...HISTORY_ROWS].sort((a, b) => b.date.localeCompare(a.date));
  return respond(sorted);
}

export function getTaskHistory(taskId) {
  const entries = HISTORY_ROWS
    .filter((row) => row.task_id === taskId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ date, phase, status }) => ({ date, phase, status }));
  return respond(entries);
}

export function exportHistory({ employee_id, from, to } = {}) {
  const rows = HISTORY_ROWS.filter((row) => {
    if (employee_id) {
      const emp = EMPLOYEES.find((e) => String(e.id) === String(employee_id));
      if (emp && row.employee !== emp.name) return false;
    }
    if (from && row.date < from) return false;
    if (to && row.date > to) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const header = 'Employee,Date,Task,ClickUp ID,ClickUp URL,Phase,Status';
  const lines = rows.map((r) => [
    r.employee,
    r.date,
    `"${r.task}"`,
    r.clickup_task_id,
    `https://app.clickup.com/t/${r.clickup_task_id}`,
    r.phase,
    r.status,
  ].join(','));

  const csv = [header, ...lines].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const params = testParams();
  const delay = Math.max(Number(params.get('_delay')) || LATENCY_MS, 200);
  const fail = SIMULATE_ERROR || params.has('_error');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        URL.revokeObjectURL(url);
        reject(new Error('Gagal mengunduh file ekspor'));
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = `history-export${from ? '-' + from : ''}${to ? '-' + to : ''}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve({ data: { success: true } });
      }
    }, delay);
  });
}
