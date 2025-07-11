# Payment Dashboard System

A full-stack Payment Management Dashboard built with **Express.js** (Backend) and designed for **Flutter** (Frontend).

## 🚀 Features

### Backend (Express.js + MongoDB)
- **Authentication**: JWT-based login system
- **User Management**: Admin and viewer roles
- **Payment Processing**: Create, view, and filter transactions
- **Dashboard Analytics**: Real-time statistics and metrics
- **RESTful API**: Clean API design with proper error handling

### Key Capabilities
- Secure JWT authentication
-  Role-based access control (Admin/Viewer)
-  Payment transaction management
-  Dashboard statistics (today, weekly, total revenue)
-  Advanced filtering (status, payment method, date range)
-  Pagination support
-  Sample data seeding

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend   | Express.js (Node.js) |
| Database  | MongoDB |
| Auth      | JWT (JSON Web Tokens) |
| Password  | bcrypt |
| API       | RESTful APIs |

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/varunjoshi84/Payment_dashboard.git
cd Payment_dashboard/backend
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a \`.env\` file in the backend directory:
\`\`\`env
MONGO_URI=mongodb://localhost:27017/payment_dashboard
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
\`\`\`

### 4. Start MongoDB
Make sure MongoDB is running on your system:
\`\`\`bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
\`\`\`

### 5. Run the Application
\`\`\`bash
npm run start:express
\`\`\`

The API will be available at: **http://localhost:3000/api**

## Default Admin Credentials

```
Username: admin
Password: admin123
```

##  API Endpoints

### Authentication
- **POST** \`/api/auth/login\` - User login

### Users (Admin only)
- **GET** \`/api/users\` - List all users
- **POST** \`/api/users\` - Create new user

### Payments
- **GET** \`/api/payments\` - List payments with filtering & pagination
- **POST** \`/api/payments\` - Create new payment
- **GET** \`/api/payments/:id\` - Get payment details
- **GET** \`/api/payments/stats\` - Dashboard statistics

### Seed Data
- **POST** \`/api/seed/admin\` - Create default admin
- **POST** \`/api/seed/payments\` - Create sample payments (Admin only)

##  API Testing Examples

### 1. Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"admin123"}'
\`\`\`

### 2. Get Dashboard Stats
\`\`\`bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  http://localhost:3000/api/payments/stats
\`\`\`

### 3. List Payments with Filters
\`\`\`bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  "http://localhost:3000/api/payments?status=success&page=1&limit=10"
\`\`\`

### 4. Create New Payment
\`\`\`bash
curl -X POST http://localhost:3000/api/payments \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 99.99,
    "status": "success",
    "paymentMethod": "credit_card",
    "sender": {
      "name": "John Smith",
      "email": "john@example.com"
    },
    "receiver": {
      "name": "Online Store",
      "email": "store@example.com"
    },
    "description": "Product purchase"
  }'
\`\`\`

##  Database Schema

### User Collection
\`\`\`javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (admin|viewer),
  firstName: String,
  lastName: String,
  isActive: Boolean,
  timestamps: true
}
\`\`\`

### Payment Collection
\`\`\`javascript
{
  transactionId: String (unique),
  amount: Number,
  currency: String (default: 'USD'),
  status: String (pending|success|failed),
  paymentMethod: String (credit_card|debit_card|paypal|bank_transfer|crypto),
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
  processedAt: Date,
  timestamps: true
}
\`\`\`

## Dashboard Statistics

The \`/api/payments/stats\` endpoint provides:
- **Today's Transactions**: Count of successful transactions today
- **Week's Transactions**: Count of successful transactions this week
- **Total Revenue**: Sum of all successful payment amounts
- **Today's Revenue**: Sum of today's successful payment amounts
- **Failed Transactions**: Count of failed payments
- **Status Statistics**: Breakdown by payment status

##  Authentication & Authorization

- **JWT Tokens**: Expire in 24 hours
- **Role-based Access**:
  - **Admin**: Full access to all endpoints
  - **Viewer**: Read-only access to payments and users
- **Protected Routes**: All API endpoints require valid JWT except login and public seed endpoints

## Payment Filtering Options

Query parameters for \`/api/payments\`:
- \`page\` - Page number (default: 1)
- \`limit\` - Items per page (default: 10)
- \`status\` - Filter by status (pending|success|failed)
- \`paymentMethod\` - Filter by payment method
- \`startDate\` - Filter from date (ISO format)
- \`endDate\` - Filter to date (ISO format)

##  Development

### Running in Development Mode
\`\`\`bash
npm run start:dev
\`\`\`

### Sample Data Generation
To populate the database with sample data:
1. Start the server
2. The admin user is created automatically
3. Use the admin token to call \`POST /api/seed/payments\`

##  Frontend Integration (Flutter)

This backend is designed to work with a Flutter frontend. Key considerations:
- **CORS enabled** for cross-origin requests
- **JSON responses** for easy parsing
- **Consistent error handling** with proper HTTP status codes
- **Token-based authentication** suitable for mobile apps

##  Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Export transactions as CSV
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Payment gateway integration
- [ ] Multi-currency support
- [ ] User profile management

##  Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **JWT Token Expired**
   - Login again to get new token
   - Check system time synchronization

3. **Permission Denied**
   - Verify user role and token validity
   - Admin role required for user management

##  License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

