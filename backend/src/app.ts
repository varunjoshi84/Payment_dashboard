import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Post, Body, Injectable, Query } from '@nestjs/common';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule, InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

// Payment Schema
export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  description: string;

  @Prop()
  userId: string;

  @Prop()
  transactionId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Simple Auth Service
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    // Demo credentials
    if (email === 'demo@test.com' && password === 'demo123') {
      const payload = { username: 'demo', sub: 'demo-id', role: 'admin' };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: 'demo-id', username: 'demo', email: 'demo@test.com', role: 'admin' }
      };
    }
    throw new Error('Invalid credentials');
  }
}

// Auth Controller
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}

// App Controller
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World! Payment Dashboard API is running.';
  }
}

// Payments Controller
@Controller('payments')
export class PaymentsController {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  private samplePayments = [
    { id: '1', amount: 100, method: 'credit-card', status: 'completed', description: 'Online purchase', createdAt: new Date('2024-01-15') },
    { id: '2', amount: 250, method: 'upi', status: 'pending', description: 'Service payment', createdAt: new Date('2024-01-16') },
    { id: '3', amount: 75, method: 'bank-transfer', status: 'failed', description: 'Monthly subscription', createdAt: new Date('2024-01-14') },
    { id: '4', amount: 320, method: 'credit-card', status: 'completed', description: 'Product purchase', createdAt: new Date('2024-01-17') },
    { id: '5', amount: 150, method: 'debit-card', status: 'pending', description: 'Utility payment', createdAt: new Date('2024-01-18') },
    { id: '6', amount: 89, method: 'upi', status: 'completed', description: 'Digital content', createdAt: new Date('2024-01-19') },
    { id: '7', amount: 500, method: 'bank-transfer', status: 'failed', description: 'Transfer payment', createdAt: new Date('2024-01-20') },
    { id: '8', amount: 45, method: 'credit-card', status: 'completed', description: 'Small purchase', createdAt: new Date('2024-01-21') },
  ];

  @Get('stats')
  async getStats() {
    try {
      // Try to get stats from database
      const totalPayments = await this.paymentModel.countDocuments();
      const completedPayments = await this.paymentModel.countDocuments({ status: 'completed' });
      const pendingPayments = await this.paymentModel.countDocuments({ status: 'pending' });
      const failedPayments = await this.paymentModel.countDocuments({ status: 'failed' });
      
      const totalAmountResult = await this.paymentModel.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalAmount = totalAmountResult[0]?.total || 0;

      return {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalAmount
      };
    } catch (error) {
      // Fallback to sample data if database fails
      const totalPayments = this.samplePayments.length;
      const completedPayments = this.samplePayments.filter(p => p.status === 'completed').length;
      const pendingPayments = this.samplePayments.filter(p => p.status === 'pending').length;
      const failedPayments = this.samplePayments.filter(p => p.status === 'failed').length;
      const totalAmount = this.samplePayments.reduce((sum, p) => sum + p.amount, 0);

      return {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalAmount
      };
    }
  }

  @Get()
  async getPayments(@Query('status') status?: string, @Query('method') method?: string) {
    try {
      // Try to get from database first
      const query: any = {};
      if (status) query.status = status;
      if (method) {
        // Direct method matching (since we're using consistent format now)
        query.method = method;
      }
      
      const payments = await this.paymentModel.find(query).sort({ createdAt: -1 });
      
      // If we have payments in database, return them
      if (payments.length > 0) {
        return payments;
      }
      
      // If no payments in database, seed and return sample data
      await this.seedSampleData();
      return await this.paymentModel.find(query).sort({ createdAt: -1 });
      
    } catch (error) {
      // Fallback to in-memory filtering if database fails
      let filteredPayments = [...this.samplePayments];

      if (status) {
        filteredPayments = filteredPayments.filter(p => p.status === status);
      }

      if (method) {
        filteredPayments = filteredPayments.filter(p => p.method === method);
      }

      return filteredPayments;
    }
  }

  @Post()
  async createPayment(@Body() body: any) {
    try {
      // Try to save to database
      const newPayment = new this.paymentModel({
        amount: body.amount,
        method: body.method,
        description: body.description,
        status: 'pending',
        userId: 'demo-user-id',
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      
      const savedPayment = await newPayment.save();
      return savedPayment;
    } catch (error) {
      // Fallback to in-memory if database fails
      const newPayment = {
        id: Date.now().toString(),
        ...body,
        status: 'pending',
        createdAt: new Date()
      };
      this.samplePayments.push(newPayment);
      return newPayment;
    }
  }

  @Post('seed')
  async seedPayments() {
    try {
      await this.seedSampleData();
      return { message: 'Sample data seeded successfully' };
    } catch (error) {
      return { message: 'Failed to seed data, using in-memory fallback' };
    }
  }

  private async seedSampleData() {
    // Clear existing data
    await this.paymentModel.deleteMany({});
    
    // Insert sample data
    await this.paymentModel.insertMany([
      { amount: 1250, method: 'credit-card', status: 'completed', description: 'Monthly subscription payment', userId: 'demo-user-id' },
      { amount: 890.50, method: 'upi', status: 'pending', description: 'Product purchase - Electronics', userId: 'demo-user-id' },
      { amount: 2100, method: 'bank-transfer', status: 'completed', description: 'Service fee payment', userId: 'demo-user-id' },
      { amount: 345.75, method: 'debit-card', status: 'failed', description: 'Failed transaction - insufficient funds', userId: 'demo-user-id' },
      { amount: 5500, method: 'credit-card', status: 'completed', description: 'Large purchase - Equipment', userId: 'demo-user-id' },
      { amount: 750, method: 'upi', status: 'pending', description: 'Online shopping', userId: 'demo-user-id' },
      { amount: 125, method: 'debit-card', status: 'completed', description: 'Utility bill payment', userId: 'demo-user-id' },
      { amount: 980, method: 'bank-transfer', status: 'failed', description: 'Insurance premium', userId: 'demo-user-id' },
    ]);
  }
}

// Main App Module
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-super-secret-jwt-key',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/payment_dashboard'),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [AppController, AuthController, PaymentsController],
  providers: [AuthService],
})
export class AppModule {}

// Bootstrap
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  const port = 3002;
  await app.listen(port);
  
  console.log(`🚀 Payment Dashboard API running on http://localhost:${port}/api`);
}

bootstrap().catch(err => console.error('Failed to start server:', err));
