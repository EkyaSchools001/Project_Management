import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as userController from '../controllers/users.controller';

jest.mock('../middlewares/auth.middleware', () => ({
  authenticate: vi.fn((req, res, next) => {
    (req as any).user = { id: 1, role: 'admin' };
    next();
  }),
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
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('GET /users', () => {
    it('should return list of users', async () => {
      const req = {} as Request;
      const res = mockResponse as Response;

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          users: expect.any(Array),
        })
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse as Response;

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.any(Object),
        })
      );
    });

    it('should return 404 for non-existent user', async () => {
      const req = { params: { id: '999' } } as unknown as Request;
      const res = { ...mockResponse, status: vi.fn().mockReturnThis() } as any;

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('POST /users', () => {
    it('should create new user', async () => {
      const req = {
        body: {
          email: 'newuser@test.com',
          name: 'New User',
          password: 'password123',
          role: 'student',
        },
      } as Request;

      await userController.createUser(req, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.any(Object),
        })
      );
    });
  });
});
