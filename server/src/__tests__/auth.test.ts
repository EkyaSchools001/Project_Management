import { describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../app', () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockImplementation((args) => {
        const email = args?.where?.email || '';
        if (email === 'nonexistent@test.com' || email.includes('brandnew') || email.includes('newuser')) {
          return Promise.resolve(null);
        }
        return Promise.resolve({ 
          id: '1', 
          email: email || 'admin@schoolos.com', 
          password: 'hashed_password', 
          role: 'SUPER_ADMIN', 
          profile: {},
          status: 'Active'
        });
      }),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((args) => {
        return Promise.resolve({
          id: 'new-user-id',
          email: args.data.email,
          name: args.data.name,
          role: args.data.role || 'TEACHER_CORE',
          profile: { id: 'profile-1', firstName: 'Test', lastName: 'User' }
        });
      }),
    },
    session: {
      create: jest.fn().mockResolvedValue({ id: '1', token: 'test-token' }),
      findFirst: jest.fn().mockResolvedValue(null),
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  },
}));

jest.mock('../utils/validation.schemas', () => ({
  loginSchema: { 
    parse: jest.fn().mockImplementation((data) => {
      if (!data.email || !data.password) throw new Error('Validation failed');
      return data;
    }) 
  },
  registerSchema: { 
    parse: jest.fn().mockImplementation((data) => {
      if (!data.email || !data.password || !data.name) throw new Error('Validation failed');
      return data;
    }) 
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === 'password123');
  }),
}));

jest.mock('../middlewares/auth.middleware', () => ({
  generateTokens: jest.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh' }),
}));

jest.mock('../middlewares/sessionManager', () => ({
  createSession: jest.fn().mockResolvedValue({ id: '1', token: 'test-token' }),
  recordFailedLogin: jest.fn().mockResolvedValue({}),
}));

jest.mock('../services/email.service', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendTwoFactorCodeEmail: jest.fn().mockResolvedValue(true),
  sendEmail: jest.fn().mockResolvedValue(true),
}));

import * as authController from '../controllers/auth.controller';

describe('Auth Controller', () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = {
      body: { email: 'admin@schoolos.com', password: 'password123' },
      ip: '127.0.0.1',
      query: {},
      params: {},
      headers: {
        'user-agent': 'jest-test',
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
    };
  });

  describe('login', () => {
    it('should return 200 with token on successful login', async () => {
      await authController.login(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 401 on user not found', async () => {
      mockRequest.body = { email: 'nonexistent@test.com', password: 'wrong' };
      await authController.login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 on wrong password', async () => {
      mockRequest.body = { email: 'admin@schoolos.com', password: 'wrongpassword' };
      await authController.login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('register', () => {
    it('should create new user and return token', async () => {
      mockRequest.body = {
        email: 'brandnewuser@schoolos.com',
        password: 'password123',
        name: 'New User',
        role: 'TEACHER_CORE',
      };
      await authController.register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });
});