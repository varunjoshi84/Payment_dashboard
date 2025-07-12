import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: any, @Request() req: any) {
    return this.paymentsService.create(createPaymentDto, req.user.userId);
  }

  @Get()
  async findAll(@Request() req: any, @Query() query: any) {
    return this.paymentsService.findAll(req.user.userId, query);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.paymentsService.getStats(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.paymentsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePaymentDto: any, @Request() req: any) {
    return this.paymentsService.update(id, updatePaymentDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.paymentsService.remove(id, req.user.userId);
  }

  @Post('seed')
  async seedPayments(@Request() req: any) {
    const samplePayments = [
      { amount: 2500.00, method: 'upi', status: 'completed', description: 'Online purchase payment' },
      { amount: 1200.50, method: 'card', status: 'pending', description: 'Subscription renewal' },
      { amount: 750.00, method: 'bank_transfer', status: 'failed', description: 'Utility bill payment' },
      { amount: 3000.00, method: 'cash', status: 'completed', description: 'Restaurant bill' },
      { amount: 1850.75, method: 'upi', status: 'completed', description: 'Grocery shopping' },
    ];

    const createdPayments = [];
    for (const payment of samplePayments) {
      try {
        const created = await this.paymentsService.create(payment, req.user.userId);
        createdPayments.push(created);
      } catch (error) {
        // Payment might already exist, continue
      }
    }

    return { message: 'Sample payments seeded', count: createdPayments.length };
  }
}
