const { Test } = require('@nestjs/testing');
const { PaymentsController } = require('./payments.controller');
const { PaymentsService } = require('./payments.service');

describe('PaymentsController', () => {
  let paymentsController;
  let paymentsService;

  const mockPaymentsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  const mockPayment = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439010',
    amount: 100.50,
    currency: 'USD',
    status: 'completed',
    method: 'credit_card',
    description: 'Test payment',
    merchantName: 'Test Merchant',
    category: 'shopping',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: 'PaymentsService',
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    paymentsController = module.get(PaymentsController);
    paymentsService = module.get('PaymentsService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated payments', async () => {
      const query = {
        page: '1',
        limit: '10',
        status: 'completed',
      };

      const expectedResult = {
        data: [mockPayment],
        total: 1,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      mockPaymentsService.findAll.mockResolvedValue(expectedResult);

      const result = await paymentsController.findAll(query);

      expect(mockPaymentsService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: 'completed',
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle query parameters with defaults', async () => {
      const query = {};

      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      mockPaymentsService.findAll.mockResolvedValue(expectedResult);

      const result = await paymentsController.findAll(query);

      expect(mockPaymentsService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return payment by id', async () => {
      const paymentId = '507f1f77bcf86cd799439011';
      mockPaymentsService.findById.mockResolvedValue(mockPayment);

      const result = await paymentsController.findOne(paymentId);

      expect(mockPaymentsService.findById).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const createPaymentDto = {
        userId: '507f1f77bcf86cd799439010',
        amount: 100.50,
        currency: 'USD',
        method: 'credit_card',
        description: 'Test payment',
        merchantName: 'Test Merchant',
      };

      mockPaymentsService.create.mockResolvedValue(mockPayment);

      const result = await paymentsController.create(createPaymentDto);

      expect(mockPaymentsService.create).toHaveBeenCalledWith(createPaymentDto);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('update', () => {
    it('should update payment', async () => {
      const paymentId = '507f1f77bcf86cd799439011';
      const updatePaymentDto = { status: 'failed' };
      const updatedPayment = { ...mockPayment, status: 'failed' };

      mockPaymentsService.update.mockResolvedValue(updatedPayment);

      const result = await paymentsController.update(paymentId, updatePaymentDto);

      expect(mockPaymentsService.update).toHaveBeenCalledWith(paymentId, updatePaymentDto);
      expect(result).toEqual(updatedPayment);
    });
  });

  describe('remove', () => {
    it('should delete payment', async () => {
      const paymentId = '507f1f77bcf86cd799439011';
      mockPaymentsService.remove.mockResolvedValue(mockPayment);

      const result = await paymentsController.remove(paymentId);

      expect(mockPaymentsService.remove).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('getStats', () => {
    it('should return payment statistics', async () => {
      const query = { userId: '507f1f77bcf86cd799439010' };

      const expectedStats = {
        totalAmount: 1500.75,
        totalTransactions: 15,
        avgAmount: 100.05,
        statusBreakdown: [
          { _id: 'completed', count: 10, total: 1200.50 },
          { _id: 'pending', count: 3, total: 200.25 },
          { _id: 'failed', count: 2, total: 100.00 },
        ],
        methodBreakdown: [
          { _id: 'credit_card', count: 8, total: 800.00 },
          { _id: 'debit_card', count: 4, total: 400.00 },
          { _id: 'bank_transfer', count: 3, total: 300.75 },
        ],
        dailyStats: [
          { _id: '2024-01-15', count: 5, total: 500.00 },
          { _id: '2024-01-16', count: 10, total: 1000.75 },
        ],
      };

      mockPaymentsService.getStats.mockResolvedValue(expectedStats);

      const result = await paymentsController.getStats(query);

      expect(mockPaymentsService.getStats).toHaveBeenCalledWith(query.userId);
      expect(result).toEqual(expectedStats);
    });

    it('should get stats without user filter', async () => {
      const query = {};

      mockPaymentsService.getStats.mockResolvedValue({});

      await paymentsController.getStats(query);

      expect(mockPaymentsService.getStats).toHaveBeenCalledWith(undefined);
    });
  });
});
