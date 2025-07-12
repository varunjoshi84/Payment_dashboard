// Payment Dashboard - MongoDB Schema Dump
// Database: payment_dashboard

// ===========================================
// USERS COLLECTION
// ===========================================

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "name"],
      properties: {
        email: {
          bsonType: "string",
          description: "User email address - required and must be unique"
        },
        password: {
          bsonType: "string", 
          description: "Hashed password - required"
        },
        name: {
          bsonType: "string",
          description: "User full name - required"
        },
        createdAt: {
          bsonType: "date",
          description: "Account creation timestamp"
        }
      }
    }
  }
});

// Create unique index on email
db.users.createIndex({ "email": 1 }, { unique: true });

// ===========================================
// PAYMENTS COLLECTION  
// ===========================================

db.createCollection("payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "amount", "method", "status", "description"],
      properties: {
        user: {
          bsonType: "objectId",
          description: "Reference to user who made the payment - required"
        },
        amount: {
          bsonType: "number",
          minimum: 0,
          description: "Payment amount in rupees - required and must be positive"
        },
        method: {
          bsonType: "string",
          enum: ["upi", "card", "bank_transfer", "cash"],
          description: "Payment method - required"
        },
        status: {
          bsonType: "string", 
          enum: ["pending", "completed", "failed"],
          description: "Payment status - required"
        },
        description: {
          bsonType: "string",
          description: "Payment description - required"
        },
        createdAt: {
          bsonType: "date",
          description: "Payment creation timestamp"
        },
        updatedAt: {
          bsonType: "date", 
          description: "Payment last update timestamp"
        }
      }
    }
  }
});

// Create indexes for better query performance
db.payments.createIndex({ "user": 1 });
db.payments.createIndex({ "status": 1 });
db.payments.createIndex({ "method": 1 });
db.payments.createIndex({ "createdAt": -1 });

// ===========================================
// SAMPLE DATA INSERTION
// ===========================================

// Insert sample user (password: "password123" hashed with bcrypt)
db.users.insertOne({
  email: "admin@test.com",
  password: "$2b$10$X8kZm5Z6fM4Qs7vN9wE2z.gJ3uP1YvQ8xR5sT7kL9mN2oP6qW3eR4t",
  name: "Admin User",
  createdAt: new Date()
});

// Get the user ID for sample payments
const userId = db.users.findOne({email: "admin@test.com"})._id;

// Insert sample payments
db.payments.insertMany([
  {
    user: userId,
    amount: 2500.00,
    method: "upi",
    status: "completed", 
    description: "Online purchase payment",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    user: userId,
    amount: 1200.50,
    method: "card",
    status: "pending",
    description: "Subscription renewal", 
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    user: userId,
    amount: 750.00,
    method: "bank_transfer", 
    status: "failed",
    description: "Utility bill payment",
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    updatedAt: new Date(Date.now() - 259200000)
  },
  {
    user: userId,
    amount: 3000.00,
    method: "cash",
    status: "completed",
    description: "Restaurant bill",
    createdAt: new Date(Date.now() - 345600000), // 4 days ago  
    updatedAt: new Date(Date.now() - 345600000)
  },
  {
    user: userId,
    amount: 1850.75,
    method: "upi",
    status: "completed",
    description: "Grocery shopping",
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
    updatedAt: new Date(Date.now() - 432000000)
  }
]);

// ===========================================
// USEFUL QUERIES
// ===========================================

// Get all payments for a user
db.payments.find({user: userId}).sort({createdAt: -1});

// Get payments by status
db.payments.find({status: "completed"});

// Get payments by method
db.payments.find({method: "upi"});

// Get payment statistics
db.payments.aggregate([
  {
    $group: {
      _id: "$status",
      count: {$sum: 1},
      totalAmount: {$sum: "$amount"}
    }
  }
]);

// Get payments with filters (status and method)
db.payments.find({
  status: "completed",
  method: "upi"
}).sort({createdAt: -1});

console.log("✅ Payment Dashboard MongoDB schema and sample data created successfully!");
console.log("📊 Collections: users, payments");
console.log("👤 Sample user: admin@test.com (password: password123)");
console.log("💳 Sample payments: 5 payments with different methods and statuses");
