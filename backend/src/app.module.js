const { Module } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { ConfigModule } = require('@nestjs/config');
const { AppController } = require('./app.controller');
const { AppService } = require('./app.service');
const { AuthModule } = require('./auth/auth.module');
const { UsersModule } = require('./users/users.module');
const { PaymentsModule } = require('./payments/payments.module');
const { SeedModule } = require('./seed/seed.module');

@Module({
  imports: [
    ConfigModule.forRoot(), // to load .env variables
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/payment_dashboard'),
    AuthModule,
    UsersModule,
    PaymentsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

module.exports = { AppModule };
