const { Test } = require('@nestjs/testing');
const { UsersController } = require('./users.controller');
const { UsersService } = require('./users.service');

describe('UsersController', () => {
  let usersController;
  let usersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'UsersService',
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get(UsersController);
    usersService = module.get('UsersService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await usersController.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await usersController.findOne(userId);

      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await usersController.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto = { firstName: 'Updated' };
      const updatedUser = { ...mockUser, firstName: 'Updated' };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.update(userId, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUsersService.remove.mockResolvedValue(mockUser);

      const result = await usersController.remove(userId);

      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });
});
