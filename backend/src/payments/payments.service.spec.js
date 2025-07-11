const { Test } = require('@nestjs/testing');
const { PaymentsService } = require('./payments.service');

describe('PaymentsService', () => {
  let paymentsService;

  const mockPaymentModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
    save: jest.fn(),
    insertMany: jest.fn(),
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
      providers: [
        PaymentsService,
        {
          provide: 'PaymentModel',
          useValue: mockPaymentModel,
        },
      ],
    }).compile();

    paymentsService = module.get(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      const mockPaymentInstance = {
        save: jest.fn().mockResolvedValue(mockPayment),
      };

      paymentsService.paymentModel = jest.fn().mockReturnValue(mockPaymentInstance);

      const result = await paymentsService.create(createPaymentDto);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentInstance.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated payments with filters', async () => {
      const options = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'completed',
        userId: '507f1f77bcf86cd799439010',
      };

      const payments = [mockPayment];
      const total = 1;

      mockPaymentModel.countDocuments.mockResolvedValue(total);
      mockPaymentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(payments),
              }),
            }),
          }),
        }),
      });

      const result = await paymentsService.findAll(options);

      expect(result).toEqual({
        data: payments,
        total,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('should apply date range filters', async () => {
      const options = {
        page: 1,
        limit: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      mockPaymentModel.countDocuments.mockResolvedValue(0);
      mockPaymentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([]),
              }),
            }),
          }),
        }),
      });

      await paymentsService.findAll(options);

      const expectedFilter = {
        createdAt: {
          $gte: new Date('2024-01-01T00:00:00.000Z'),
          $lte: new Date('2024-12-31T23:59:59.999Z'),
        },
      };

      expect(mockPaymentModel.find).toHaveBeenCalledWith(expectedFilter);
    });
  });

  describe('findById', () => {
    it('should return payment by id', async () => {
      const paymentId = '507f1f77bcf86cd799439011';

      mockPaymentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockPayment),
        }),
      });

      const result = await paymentsService.findById(paymentId);

      expect(mockPaymentModel.findById).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('update', () => {
    it('should update payment and return updated payment', async () => {
      const paymentId = '507f1f77bcf86cd799439011';
      const updateData = { status: 'failed' };
      const updatedPayment = { ...mockPayment, ...updateData };

      mockPaymentModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedPayment),
        }),
      });

      const result = await paymentsService.update(paymentId, updateData);

      expect(mockPaymentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        paymentId,
        { ...updateData, updatedAt: expect.any(Date) },
        { new: true }
      );
      expect(result).toEqual(updatedPayment);
    });
  });

  describe('remove', () => {
    it('should delete payment by id', async () => {
      const paymentId = '507f1f77bcf86cd799439011';

      mockPaymentModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPayment),
      });

      const result = await paymentsService.remove(paymentId);

      expect(mockPaymentModel.findByIdAndDelete).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('getStats', () => {
    it('should return payment statistics', async () => {
      const mockStats = [
        {
          _id: null,
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
        },
      ];

      mockPaymentModel.aggregate.mockResolvedValue(mockStats);

      const result = await paymentsService.getStats();

      expect(result).toEqual(mockStats[0]);
      expect(mockPaymentModel.aggregate).toHaveBeenCalled();
    });

    it('should apply user filter to stats', async () => {
      const userId = '507f1f77bcf86cd799439010';

      mockPaymentModel.aggregate.mockResolvedValue([]);

      await paymentsService.getStats(userId);

      const aggregationPipeline = mockPaymentModel.aggregate.mock.calls[0][0];
      expect(aggregationPipeline[0].$match.userId).toEqual(userId);
    });
  });

  describe('createSamplePayments', () => {
    it('should create sample payments for a user', async () => {
      const userId = '507f1f77bcf86cd799439010';
      const samplePayments = [mockPayment];

      mockPaymentModel.insertMany.mockResolvedValue(samplePayments);

      const result = await paymentsService.createSamplePayments(userId);

      expect(result).toEqual(samplePayments);
      expect(mockPaymentModel.insertMany).toHaveBeenCalled();

      const insertedPayments = mockPaymentModel.insertMany.mock.calls[0][0];
      expect(insertedPayments.length).toBeGreaterThan(0);
      expect(insertedPayments[0].userId).toBe(userId);
    });
  });
});
