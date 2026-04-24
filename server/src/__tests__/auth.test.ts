import { describe, it, expect, vi, beforeEach, afterEach } from '@jest/globals';
import * as authController from '../controllers/auth.controller';
import { Request, Response } from 'express';

jest.mock('../utils/validation.schemas', () => ({
  loginSchema: { parse: vi.fn() },
  registerSchema: { parse: vi.fn() },
}));

jest.mock('../utils/auth', () => ({
  generateToken: vi.fn().mockReturnValue('mock-jwt-token'),
  verifyToken: vi.fn().mockResolvedValue({ id: 1, role: 'admin' }),
  hashPassword: vi.fn().mockResolvedValue('hashed-password'),
  comparePassword: vi.fn().mockResolvedValue(true),
}));

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: { email: 'admin@schoolos.com', password: 'password123' },
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('login', () => {
    it('should return 200 with token on successful login', async () => {
      const req = mockRequest as Request;
      const res = mockResponse as Response;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.any(Object),
        })
      );
    });

    it('should return 401 on invalid credentials', async () => {
      const req = {
        ...mockRequest,
        body: { email: 'invalid@test.com', password: 'wrong' },
      } as Request;

      await authController.login(req, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('register', () => {
    it('should create new user and return token', async () => {
      const req = {
        body: {
          email: 'newuser@schoolos.com',
          password: 'password123',
          name: 'New User',
          role: 'teacher',
        },
      } as Request;

      await authController.register(req, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.any(Object),
        })
      );
    });
  });
});
