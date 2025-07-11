const { Schema } = require('mongoose');

const PaymentSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'],
    required: true,
  },
  sender: {
    name: String,
    email: String,
    phone: String,
  },
  receiver: {
    name: String,
    email: String,
    phone: String,
  },
  description: {
    type: String,
  },
  failureReason: {
    type: String,
  },
  processedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = { PaymentSchema };
