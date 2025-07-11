const { Test } = require('@nestjs/testing');
const { AuthController } = require('./auth.controller');
const { AuthService } = require('./auth.service');

describe('AuthController', () => {
  let authController;
  let authService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AuthService',
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get('AuthService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        role: 'user',
      };

      const req = { user };

      const expectedResult = {
        access_token: 'mock-jwt-token',
        user: user,
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await authController.login(req, loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('register', () => {
    it('should register new user and return access token', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const expectedResult = {
        access_token: 'mock-jwt-token',
        user: {
          _id: '507f1f77bcf86cd799439012',
          username: 'newuser',
          email: 'new@example.com',
          role: 'user',
          firstName: 'New',
          lastName: 'User',
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await authController.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
