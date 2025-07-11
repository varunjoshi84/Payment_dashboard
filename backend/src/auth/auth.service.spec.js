const { AuthService } = require('./auth.service');
const bcrypt = require('bcrypt');

describe('AuthService', () => {
  let authService;
  let mockUsersService;
  let mockJwtService;

  beforeEach(() => {
    mockUsersService = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    authService = new AuthService(mockUsersService, mockJwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
        firstName: 'Test',
        lastName: 'User',
        toObject: () => ({
          _id: '507f1f77bcf86cd799439011',
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword,
          role: 'user',
          firstName: 'Test',
          lastName: 'User',
        }),
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', plainPassword);

      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        password: 'hashedPassword',
        toObject: () => ({}),
      };
      
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('loginWithCredentials', () => {
    it('should return access token and user data when credentials are valid', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        role: 'user',
        password: hashedPassword,
        toObject: () => ({
          _id: '507f1f77bcf86cd799439011',
          username: 'testuser',
          role: 'user',
        }),
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.loginWithCredentials('testuser', plainPassword);

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: '507f1f77bcf86cd799439011',
          username: 'testuser',
          role: 'user',
        },
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(authService.loginWithCredentials('testuser', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });
});
