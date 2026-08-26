import api from './client.js';
import * as mock from './mock.js';

const USE_MOCK = true;

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
