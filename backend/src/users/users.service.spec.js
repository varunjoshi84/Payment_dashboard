const { Test } = require('@nestjs/testing');
const { UsersService } = require('./users.service');
const bcrypt = require('bcrypt');

describe('UsersService', () => {
  let usersService;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
  };

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    firstName: 'Test',
    lastName: 'User',
    toObject: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserModel',
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'plainPassword',
        firstName: 'New',
        lastName: 'User',
      };

      const savedUser = {
        ...mockUser,
        ...createUserDto,
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({
          ...mockUser,
          ...createUserDto,
          password: 'hashedPassword',
        }),
      };

      // Mock the constructor and save method
      const mockUserInstance = {
        save: jest.fn().mockResolvedValue(savedUser),
      };

      // Mock the model constructor
      usersService.userModel = jest.fn().mockReturnValue(mockUserInstance);

      const result = await usersService.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.username).toBe(createUserDto.username);
      expect(result.email).toBe(createUserDto.email);
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [
        { ...mockUser, password: undefined },
        { ...mockUser, _id: '507f1f77bcf86cd799439012', username: 'user2' },
      ];

      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await usersService.findAll();

      expect(mockUserModel.find).toHaveBeenCalledWith({}, '-password');
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return user by id without password', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const user = { ...mockUser, password: undefined };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await usersService.findById(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId, '-password');
      expect(result).toEqual(user);
    });
  });

  describe('findByUsername', () => {
    it('should return user by username with password', async () => {
      const username = 'testuser';

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await usersService.findByUsername(username);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email without password', async () => {
      const email = 'test@example.com';
      const user = { ...mockUser, password: undefined };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await usersService.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email }, '-password');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update user and return updated user without password', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { firstName: 'Updated' };
      const updatedUser = { ...mockUser, ...updateData, password: undefined };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedUser),
        }),
      });

      const result = await usersService.update(userId, updateData);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should hash password when updating password', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { password: 'newPassword' };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      await usersService.update(userId, updateData);

      // Check that the password was hashed
      const callArgs = mockUserModel.findByIdAndUpdate.mock.calls[0][1];
      expect(callArgs.password).not.toBe('newPassword');
      expect(callArgs.password).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should delete user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';

      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await usersService.remove(userId);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('createDefaultAdmin', () => {
    it('should create default admin if not exists', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const adminUser = {
        username: 'admin',
        email: 'admin@paymentdashboard.com',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
      };

      const mockUserInstance = {
        save: jest.fn().mockResolvedValue({
          ...adminUser,
          toObject: jest.fn().mockReturnValue(adminUser),
        }),
      };

      usersService.userModel = jest.fn().mockReturnValue(mockUserInstance);

      const result = await usersService.createDefaultAdmin();

      expect(result.username).toBe('admin');
      expect(result.role).toBe('admin');
    });

    it('should return existing admin if already exists', async () => {
      const existingAdmin = { ...mockUser, username: 'admin', role: 'admin' };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingAdmin),
      });

      const result = await usersService.createDefaultAdmin();

      expect(result).toEqual(existingAdmin);
    });
  });
});
