const { Module } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { AuthModule } = require('./auth/auth.module');
const { PaymentsModule } = require('./payments/payments.module');
const { ConfigModule } = require('@nestjs/config');

@Module({
  imports: [
    ConfigModule.forRoot(), // to load .env variables
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/payment_dashboard'),
    AuthModule,
    PaymentsModule,
  ],
})
class AppModule {}

module.exports = { AppModule };
