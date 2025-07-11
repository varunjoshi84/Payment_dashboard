const { Module } = require('@nestjs/common');
const { MongooseModule, getModelToken } = require('@nestjs/mongoose');
const { PaymentsService } = require('./payments.service');
const { PaymentsController } = require('./payments.controller');
const { PaymentSchema } = require('./payment.schema');

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }])
  ],
  controllers: [PaymentsController],
  providers: [
    {
      provide: PaymentsService,
      useFactory: (paymentModel) => new PaymentsService(paymentModel),
      inject: [getModelToken('Payment')],
    },
  ],
  exports: [PaymentsService],
})
class PaymentsModule {}

module.exports = { PaymentsModule };
