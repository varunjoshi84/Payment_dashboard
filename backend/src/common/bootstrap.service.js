const { Injectable, OnModuleInit } = require('@nestjs/common');
const { UsersService } = require('../users/users.service');
const { PaymentsService } = require('../payments/payments.service');

@Injectable()
class BootstrapService {
  constructor(usersService, paymentsService) {
    this.usersService = usersService;
    this.paymentsService = paymentsService;
  }

  static get parameters() {
    return [UsersService, PaymentsService];
  }

  async onModuleInit() {
    try {
      // Create default admin user
      const admin = await this.usersService.createDefaultAdmin();
      console.log('✅ Default admin user ready:', admin.username);
      
      // Create sample payment data
      const sampleData = await this.paymentsService.createSampleData();
      console.log('✅ Sample data:', sampleData.message);
      
      console.log('\n🚀 Payment Dashboard API is ready!');
      console.log('📋 Default admin credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('\n📍 API Endpoints:');
      console.log('   POST /auth/login - User authentication');
      console.log('   GET  /payments - List payments with filters');
      console.log('   GET  /payments/stats - Dashboard statistics');
      console.log('   POST /payments - Create new payment');
      console.log('   GET  /users - List users (admin only)');
      console.log('   POST /users - Create new user (admin only)');
      
    } catch (error) {
      console.error('Bootstrap error:', error.message);
    }
  }
}

module.exports = { BootstrapService };
