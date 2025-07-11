# Payment Dashboard System

A full-stack Payment Dashboard System built with **NestJS** (backend) and **Flutter** (frontend) for managing payment transactions, user authentication, and dashboard analytics.

## Project Status & Overview

This project implements a comprehensive payment management system with the following key features:

### Completed Backend Features (NestJS + MongoDB)
- **User Authentication & Authorization** with JWT
- **Role-based Access Control** (Admin, User roles)
- **Payment Transaction Management**
- **Dashboard Statistics & Analytics**
- **Advanced Filtering & Search**
- **Sample Data Seeding**
- **RESTful API** with comprehensive endpoints
- **CORS Configuration** for cross-origin requests
- **Password Security** with bcrypt hashing

### 🚧 In Progress
- Complete unit test coverage
- Frontend Flutter implementation
- Real-time WebSocket features

### 🔮 Future Enhancements
- Payment gateway integration (Stripe, PayPal)
- Email notifications
- CSV/PDF export functionality
- Advanced analytics and reporting
- Multi-tenant support

## 🛠 Tech Stack

### Backend
- **NestJS** (JavaScript/CommonJS, not TypeScript)
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with Passport
- **bcrypt** for password hashing
- **Jest** for testing

### Frontend (To Be Implemented)
- **Flutter** (Dart)
- **Material Design 3**
- **HTTP client** for API communication
- **Charts** for data visualization

## 📁 Project Structure

```
payment_dashboard/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module (JWT, Passport)
│   │   ├── users/             # User management module
│   │   ├── payments/          # Payment management module
│   │   ├── common/            # Shared utilities, guards, decorators
│   │   ├── seed/              # Data seeding module
│   │   ├── app.module.js      # Main application module
│   │   └── main.js            # Application entry point
│   ├── test/                  # Test files
│   ├── package.json
│   └── .env.example
└── frontend/                  # Flutter Frontend (to be implemented)
    ├── lib/
    ├── android/
    ├── ios/
    ├── web/
    └── pubspec.yaml
```

## 🔧 Backend Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/varunjoshi84/Payment_dashboard.git
   cd Payment_dashboard/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/payment_dashboard
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Start MongoDB**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # For MongoDB Atlas, use your connection string
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm start

   # Watch mode (auto-restart on changes)
   npm run start:watch
   ```

6. **Verify installation**
   - API runs on: `http://localhost:3000/api`
   - Health check: `GET http://localhost:3000/api`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "username": "johndoe",
    "role": "user"
  }
}
```

### User Management Endpoints (Protected)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <your-jwt-token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <your-jwt-token>
```

#### Create User (Admin only)
```http
POST /api/users
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "user"
}
```

#### Update User (Admin only)
```http
PUT /api/users/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name"
}
```

#### Delete User (Admin only)
```http
DELETE /api/users/:id
Authorization: Bearer <your-jwt-token>
```

### Payment Endpoints (Protected)

#### Get All Payments (with filtering)
```http
GET /api/payments?page=1&limit=10&status=completed&startDate=2024-01-01&endDate=2024-12-31&userId=user-id&method=credit_card
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, completed, failed)
- `method` - Filter by payment method
- `userId` - Filter by user ID
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc, desc)

#### Get Payment by ID
```http
GET /api/payments/:id
Authorization: Bearer <your-jwt-token>
```

#### Create Payment
```http
POST /api/payments
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "user-id-here",
  "amount": 100.50,
  "currency": "USD",
  "method": "credit_card",
  "description": "Payment for services",
  "merchantName": "Example Store",
  "category": "shopping"
}
```

#### Get Payment Statistics
```http
GET /api/payments/stats?userId=optional-user-id
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "totalAmount": 15000.75,
  "totalTransactions": 150,
  "avgAmount": 100.05,
  "statusBreakdown": [
    { "_id": "completed", "count": 120, "total": 14000.50 },
    { "_id": "pending", "count": 20, "total": 800.25 },
    { "_id": "failed", "count": 10, "total": 200.00 }
  ],
  "methodBreakdown": [
    { "_id": "credit_card", "count": 80, "total": 8000.00 },
    { "_id": "debit_card", "count": 40, "total": 4000.00 },
    { "_id": "bank_transfer", "count": 30, "total": 3000.75 }
  ],
  "dailyStats": [
    { "_id": "2024-01-15", "count": 5, "total": 500.00 },
    { "_id": "2024-01-16", "count": 10, "total": 1000.75 }
  ]
}
```

### Data Seeding Endpoints

#### Create Default Admin
```http
POST /api/seed/admin
```

Creates admin user with credentials:
- Username: `admin`
- Password: `admin123`
- Role: `admin`

#### Create Sample Payments
```http
POST /api/seed/payments
Content-Type: application/json

{
  "userId": "user-id-here"
}
```

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Manual API Testing

You can use the provided Postman collection:
```bash
# Import Payment_Dashboard_API.postman_collection.json into Postman
```

Or use curl commands:
```bash
# Health check
curl http://localhost:3000/api

# Create admin
curl -X POST http://localhost:3000/api/seed/admin

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔐 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Role-based Authorization** (Admin, User roles)
- **Protected Routes** with JWT guards
- **CORS Configuration** for cross-origin requests
- **Input Validation** for all API endpoints
- **Environment Variables** for sensitive configuration

## 📊 Database Schema

### User Schema
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['admin', 'user'], default: 'user'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Payment Schema
```javascript
{
  userId: ObjectId (ref: 'User', required),
  amount: Number (required, min: 0),
  currency: String (default: 'USD'),
  status: String (enum: ['pending', 'completed', 'failed'], default: 'pending'),
  method: String (required),
  description: String,
  merchantName: String,
  category: String,
  metadata: Object,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

##  Deployment

### Backend Deployment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGO_URI=your-production-mongodb-uri
   JWT_SECRET=your-super-secure-production-jwt-secret
   PORT=3000
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Recommended Platforms
- **Backend**: Railway, Render, Heroku, or DigitalOcean
- **Database**: MongoDB Atlas (recommended)
- **Frontend**: Netlify, Vercel, or Firebase Hosting

##  Git Repository

This project is version controlled with Git and hosted on GitHub:
- Repository: https://github.com/varunjoshi84/Payment_dashboard
- Main branch contains the latest stable code
- Feature branches for new developments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - For Atlas, verify IP whitelist and credentials

2. **JWT Token Expired**
   - Tokens expire in 24 hours by default
   - Login again to get a new token

3. **Port 3000 in Use**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

4. **Permission Denied**
   - Verify user role and token validity
   - Admin role required for user management endpoints

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support:
- Create an issue in the GitHub repository
- Email: support@paymentdashboard.com

---

