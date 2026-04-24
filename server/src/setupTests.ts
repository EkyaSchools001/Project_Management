export const setupTests = () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
};

export const cleanupTests = () => {
  jest.clearAllMocks();
};

export const mockRequest = (user = { id: 1, role: 'admin' }) => ({
  user,
  params: {},
  query: {},
  body: {},
  headers: { authorization: 'Bearer test-token' },
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};
