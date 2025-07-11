const { Module } = require('@nestjs/common');
const { SeedController } = require('./seed.controller');
const { UsersModule } = require('../users/users.module');
const { PaymentsModule } = require('../payments/payments.module');

@Module({
  imports: [UsersModule, PaymentsModule],
  controllers: [SeedController],
})
class SeedModule {}

module.exports = { SeedModule };
