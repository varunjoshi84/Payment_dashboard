const { Injectable } = require('@nestjs/common');

@Injectable()
class PaymentsService {
  constructor(paymentModel) {
    this.paymentModel = paymentModel;
  }

  static get parameters() {
    return ['PaymentModel'];
  }

  async create(createPaymentDto) {
    // Generate a unique transaction ID
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const createdPayment = new this.paymentModel({
      ...createPaymentDto,
      transactionId,
      processedAt: createPaymentDto.status === 'success' ? new Date() : null,
    });
    
    return createdPayment.save();
  }

  async findAll(query = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentMethod, 
      startDate, 
      endDate 
    } = query;
    
    const filter = {};
    
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const payments = await this.paymentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    const total = await this.paymentModel.countDocuments(filter);
    
    return {
      payments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    return this.paymentModel.findById(id).exec();
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    thisWeek.setHours(0, 0, 0, 0);
    
    const [
      todayTransactions,
      weekTransactions,
      totalRevenue,
      todayRevenue,
      failedTransactions,
      statusStats
    ] = await Promise.all([
      this.paymentModel.countDocuments({ 
        createdAt: { $gte: today },
        status: 'success'
      }),
      this.paymentModel.countDocuments({ 
        createdAt: { $gte: thisWeek },
        status: 'success'
      }),
      this.paymentModel.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      this.paymentModel.aggregate([
        { 
          $match: { 
            status: 'success',
            createdAt: { $gte: today }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      this.paymentModel.countDocuments({ status: 'failed' }),
      this.paymentModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    return {
      todayTransactions,
      weekTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      failedTransactions,
      statusStats,
    };
  }

  async createSampleData() {
    const samplePayments = [
      {
        amount: 150.50,
        status: 'success',
        paymentMethod: 'credit_card',
        sender: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        },
        receiver: {
          name: 'Amazon Store',
          email: 'orders@amazon.com'
        },
        description: 'Online purchase - Electronics'
      },
      {
        amount: 75.25,
        status: 'failed',
        paymentMethod: 'paypal',
        sender: {
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        receiver: {
          name: 'Netflix Subscription',
          email: 'billing@netflix.com'
        },
        description: 'Monthly subscription',
        failureReason: 'Insufficient funds'
      },
      {
        amount: 300.00,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        sender: {
          name: 'Mike Johnson',
          email: 'mike@example.com'
        },
        receiver: {
          name: 'Rent Payment',
          email: 'landlord@apartments.com'
        },
        description: 'Monthly rent payment'
      },
      {
        amount: 25.99,
        status: 'success',
        paymentMethod: 'debit_card',
        sender: {
          name: 'Sarah Wilson',
          email: 'sarah@example.com'
        },
        receiver: {
          name: 'Uber Ride',
          email: 'receipts@uber.com'
        },
        description: 'Transportation service'
      },
      {
        amount: 1200.00,
        status: 'success',
        paymentMethod: 'crypto',
        sender: {
          name: 'David Brown',
          email: 'david@example.com'
        },
        receiver: {
          name: 'Investment Fund',
          email: 'invest@cryptofund.com'
        },
        description: 'Cryptocurrency investment'
      }
    ];

    const existingCount = await this.paymentModel.countDocuments();
    if (existingCount === 0) {
      for (const payment of samplePayments) {
        await this.create(payment);
      }
      return { message: 'Sample data created successfully', count: samplePayments.length };
    }
    return { message: 'Sample data already exists', count: existingCount };
  }
}

module.exports = { PaymentsService };
