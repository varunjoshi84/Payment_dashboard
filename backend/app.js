const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/payment_dashboard');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Payment Schema
const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'], required: true },
  sender: {
    name: String,
    email: String,
    phone: String
  },
  receiver: {
    name: String,
    email: String,
    phone: String
  },
  description: String,
  failureReason: String,
  processedAt: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'viewer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { username, email, password, role, firstName, lastName } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'viewer',
      firstName,
      lastName
    });

    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Payment Routes
app.get('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentMethod, startDate, endDate } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Payment.countDocuments(filter);
    
    res.json({
      payments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/payments/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    thisWeek.setHours(0, 0, 0, 0);
    
    const [
      todayTransactions,
      weekTransactions,
      totalRevenue,
      todayRevenue,
      failedTransactions,
      statusStats
    ] = await Promise.all([
      Payment.countDocuments({ createdAt: { $gte: today }, status: 'success' }),
      Payment.countDocuments({ createdAt: { $gte: thisWeek }, status: 'success' }),
      Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'success', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.countDocuments({ status: 'failed' }),
      Payment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      todayTransactions,
      weekTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      failedTransactions,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const payment = new Payment({
      ...req.body,
      transactionId,
      processedAt: req.body.status === 'success' ? new Date() : null
    });
    
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/payments/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seed data endpoints
app.post('/api/seed/admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', user: { username: existingAdmin.username, role: existingAdmin.role } });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@paymentdashboard.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator'
    });

    await admin.save();
    const { password: _, ...adminResponse } = admin.toObject();
    res.json({ message: 'Admin created successfully', user: adminResponse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/seed/payments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const existingCount = await Payment.countDocuments();
    if (existingCount > 0) {
      return res.json({ message: 'Sample data already exists', count: existingCount });
    }

    const samplePayments = [
      {
        amount: 150.50,
        status: 'success',
        paymentMethod: 'credit_card',
        sender: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
        receiver: { name: 'Amazon Store', email: 'orders@amazon.com' },
        description: 'Online purchase - Electronics'
      },
      {
        amount: 75.25,
        status: 'failed',
        paymentMethod: 'paypal',
        sender: { name: 'Jane Smith', email: 'jane@example.com' },
        receiver: { name: 'Netflix Subscription', email: 'billing@netflix.com' },
        description: 'Monthly subscription',
        failureReason: 'Insufficient funds'
      },
      {
        amount: 300.00,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        sender: { name: 'Mike Johnson', email: 'mike@example.com' },
        receiver: { name: 'Rent Payment', email: 'landlord@apartments.com' },
        description: 'Monthly rent payment'
      },
      {
        amount: 25.99,
        status: 'success',
        paymentMethod: 'debit_card',
        sender: { name: 'Sarah Wilson', email: 'sarah@example.com' },
        receiver: { name: 'Uber Ride', email: 'receipts@uber.com' },
        description: 'Transportation service'
      },
      {
        amount: 1200.00,
        status: 'success',
        paymentMethod: 'crypto',
        sender: { name: 'David Brown', email: 'david@example.com' },
        receiver: { name: 'Investment Fund', email: 'invest@cryptofund.com' },
        description: 'Cryptocurrency investment'
      }
    ];

    for (const paymentData of samplePayments) {
      const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      const payment = new Payment({
        ...paymentData,
        transactionId,
        processedAt: paymentData.status === 'success' ? new Date() : null
      });
      await payment.save();
    }

    res.json({ message: 'Sample data created successfully', count: samplePayments.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Payment Dashboard API', 
    version: '1.0.0',
    endpoints: {
      auth: 'POST /api/auth/login',
      payments: 'GET /api/payments',
      stats: 'GET /api/payments/stats',
      users: 'GET /api/users'
    }
  });
});

// Initialize app
async function initializeApp() {
  try {
    // Create default admin
    await fetch('http://localhost:3000/api/seed/admin', { method: 'POST' })
      .catch(() => {}); // Ignore errors for now
    
    console.log('✅ Payment Dashboard API initialized');
    console.log('📋 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n📍 API Endpoints:');
    console.log('   POST /api/auth/login - User authentication');
    console.log('   GET  /api/payments - List payments with filters');
    console.log('   GET  /api/payments/stats - Dashboard statistics');
    console.log('   POST /api/payments - Create new payment');
    console.log('   GET  /api/users - List users (admin only)');
    console.log('   POST /api/users - Create new user (admin only)');
  } catch (error) {
    console.log('⚠️ Note: Initialize admin manually via POST /api/seed/admin');
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Payment Dashboard API running on http://localhost:${PORT}/api`);
  setTimeout(initializeApp, 1000);
});

module.exports = app;
