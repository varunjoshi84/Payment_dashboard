const { Controller, Post } = require('@nestjs/common');
const { UsersService } = require('../users/users.service');
const { PaymentsService } = require('../payments/payments.service');

@Controller('seed')
class SeedController {
  constructor(usersService, paymentsService) {
    this.usersService = usersService;
    this.paymentsService = paymentsService;
  }

  static get parameters() {
    return [UsersService, PaymentsService];
  }

  @Post('admin')
  async createAdmin() {
    try {
      const admin = await this.usersService.createDefaultAdmin();
      return { 
        message: 'Admin created successfully', 
        user: admin 
      };
    } catch (error) {
      if (error.message.includes('duplicate') || error.code === 11000) {
        const admin = await this.usersService.findByUsername('admin');
        return { 
          message: 'Admin already exists', 
          user: { username: admin.username, role: admin.role } 
        };
      }
      throw error;
    }
  }

  @Post('payments')
  async createSamplePayments() {
    try {
      const result = await this.paymentsService.createSampleData();
      return result;
    } catch (error) {
      return { message: 'Error creating sample data', error: error.message };
    }
  }
}

module.exports = { SeedController };
