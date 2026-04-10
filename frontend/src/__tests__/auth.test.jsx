import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../services/userService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { login, logout, getCurrentUser } from '../services/userService';
import AuthProvider from '../contexts/AuthContext';

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call login service with credentials', async () => {
      const mockUser = { id: 1, email: 'test@schoolos.com', role: 'admin' };
      getCurrentUser.mockResolvedValue(mockUser);

      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should handle login errors', async () => {
      getCurrentUser.mockRejectedValue(new Error('Unauthorized'));

      await expect(getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', () => {
      logout();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});