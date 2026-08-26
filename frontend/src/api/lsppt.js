import api from './client.js';
import * as mock from './mock.js';

const USE_MOCK = false;

async function request(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    const error = new Error(err.response?.data?.message || err.message);
    error.status = err.response?.status;
    throw error;
  }
}

export function getEmployees() {
  if (USE_MOCK) return mock.getEmployees();
  return request(api.get('/employees'));
}

export function getPhases() {
  if (USE_MOCK) return mock.getPhases();
  return request(api.get('/phases'));
}

export function saveLsppt(payload) {
  if (USE_MOCK) return mock.saveLsppt(payload);
  return request(api.post('/lsppt', payload));
}

export function getHistory({ employee_id, from, to } = {}) {
  if (USE_MOCK) return mock.getHistory();
  return request(api.get('/history', { params: { employee_id, from, to } }));
}

export function getTaskHistory(taskId) {
  if (USE_MOCK) return mock.getTaskHistory(taskId);
  return request(api.get(`/tasks/${taskId}/history`));
}

export async function exportHistory({ employee_id, from, to } = {}) {
  const res = await api.get('/history/export', {
    params: { employee_id, from, to },
    responseType: 'blob',
  });

  const url = URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'lsppt-history.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
