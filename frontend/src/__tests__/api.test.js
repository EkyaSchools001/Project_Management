import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApiUrl = 'http://localhost:3001/api';

global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should fetch data successfully', async () => {
      const mockData = { success: true, data: [] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const response = await fetch(`${mockApiUrl}/users`);
      const data = await response.json();

      expect(data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/users`, expect.any(Object));
    });

    it('should handle API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const response = await fetch(`${mockApiUrl}/users`);
      expect(response.ok).toBe(false);
    });
  });

  describe('POST requests', () => {
    it('should send data correctly', async () => {
      const postData = { name: 'Test User' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, ...postData }),
      });

      const response = await fetch(`${mockApiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/users`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});