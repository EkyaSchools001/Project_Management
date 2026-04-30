import { describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as userController from '../controllers/users.controller';

jest.mock('../middlewares/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    (req as any).user = { id: 1, role: 'admin' };
    next();
  }),
}));

jest.mock('../app', () => ({
  prisma: {
    user: {
      findMany: jest.fn().mockResolvedValue([
        { id: '1', email: 'test@test.com', role: 'TEACHER_CORE' }
      ]),
      findUnique: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com', role: 'TEACHER_CORE' }),
      findFirst: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com', role: 'TEACHER_CORE' }),
      update: jest.fn().mockResolvedValue({ id: '1', role: 'TEACHER_CORE' }),
    },
  },
}));

describe('Users API', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      params: {},
      query: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('GET /users', () => {
    it('should return list of users', async () => {
      const req = {} as Request;
      const res = mockResponse as Response;

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse as Response;

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('PUT /users/:id/role', () => {
    it('should assign role to user', async () => {
      const req = {
        params: { id: '1' },
        body: { role: 'TEACHER_CORE' },
      } as unknown as Request;

      await userController.assignRole(req, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
