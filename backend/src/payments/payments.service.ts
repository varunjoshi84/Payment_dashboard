import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: any, userId: string): Promise<Payment> {
    const payment = new this.paymentModel({
      ...createPaymentDto,
      userId,
    });
    return payment.save();
  }

  async findAll(userId: string, filters?: any): Promise<Payment[]> {
    const query: any = { userId };
    
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.method) {
      query.method = filters.method;
    }
    
    return this.paymentModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Payment> {
    return this.paymentModel.findOne({ _id: id, userId }).exec();
  }

  async update(id: string, updatePaymentDto: any, userId: string): Promise<Payment> {
    return this.paymentModel.findOneAndUpdate(
      { _id: id, userId },
      updatePaymentDto,
      { new: true }
    ).exec();
  }

  async remove(id: string, userId: string): Promise<any> {
    return this.paymentModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async getStats(userId: string): Promise<any> {
    const stats = await this.paymentModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
            }
          },
          failedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    return stats[0] || {
      totalAmount: 0,
      totalCount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      failedAmount: 0
    };
  }
}
