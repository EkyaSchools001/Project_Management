import { vi } from 'vitest';

export const setupTests = () => {
  global.fetch = vi.fn();
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('user', JSON.stringify({ id: '1', role: 'admin' }));
};

export const cleanupTests = () => {
  localStorage.clear();
  vi.clearAllMocks();
};

export const mockApiResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};