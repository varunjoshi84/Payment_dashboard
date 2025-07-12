# Payment Dashboard System

A full-stack payment management application with **NestJS backend** (TypeScript) and **Flutter frontend**.

## 🌐 Live Deployment

**Backend API:** https://payment-dashboard-z1s2.onrender.com  
**Database:** MongoDB Atlas (Cloud)  
**Status:** ✅ Live and Running

### Quick API Test
```bash
curl https://payment-dashboard-z1s2.onrender.com/
# Response: {"message":"Payment Dashboard API is running!","timestamp":"..."}
```

## 📋 Prerequisites

- **Node.js** (v16+)
- **Flutter** (latest stable)
- **MongoDB Atlas Account** (for cloud deployment)

## 🛠️ Project Structure

```
payment_dashboard/
├── backend/          # NestJS TypeScript API
│   ├── src/
│   │   ├── users/    # User management
│   │   ├── payments/ # Payment operations
│   │   └── app.*     # Main app files
│   ├── .env          # Environment variables
│   └── package.json
├── frontend/         # Flutter App
│   └── lib/services/api_service.dart # API integration
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/varunjoshi84/Payment_dashboard.git
cd payment_dashboard
```

### 2. Backend Setup (Local Development)
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

npm run build
npm run start:dev     # Runs on http://localhost:3002
```

### 3. Backend Setup (MongoDB Atlas)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get connection string and update `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment_dashboard?retryWrites=true&w=majority&appName=your-cluster-name
```

### 4. Frontend Setup
```bash
cd frontend
flutter pub get
flutter run          # For mobile
flutter run -d chrome # For web
```

**Note:** The frontend is already configured to use the live backend API. For local development, update `lib/services/api_service.dart` to use `http://localhost:3002`.

## � Deployment Instructions

### Deploy to Render (Recommended)

1. **Prepare Backend for Deployment:**
   ```bash
   cd backend
   npm run build
   ```

2. **Create Render Account:**
   - Visit [Render.com](https://render.com) and sign up
   - Connect your GitHub repository

3. **Create Web Service:**
   - Select "Web Service" → Connect GitHub repo
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     PORT=3002
     JWT_SECRET=your-super-secret-jwt-key-here
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment_dashboard?retryWrites=true&w=majority&appName=cluster-name
     ```

4. **Configure MongoDB Atlas:**
   - Whitelist Render's IP: `0.0.0.0/0` (or specific Render IPs)
   - Ensure connection string format is correct
   - Test connection from Render logs

## 🔗 API Endpoints

### Base URL
- **Production:** `https://payment-dashboard-z1s2.onrender.com`
- **Local:** `http://localhost:3002`

### Authentication
```bash
# Register
POST /auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

# Login
POST /auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Users
```bash
# Get current user
GET /users/profile
Authorization: Bearer <token>

# Get all users (requires auth)
GET /users
Authorization: Bearer <token>
```

### Payments
```bash
# Get all payments
GET /payments
Authorization: Bearer <token>

# Create payment
POST /payments
Authorization: Bearer <token>
Content-Type: application/json
{
  "amount": 2500.00,
  "method": "upi",
  "description": "Payment description"
}

# Get payment by ID
GET /payments/:id
Authorization: Bearer <token>

# Update payment
PUT /payments/:id
Authorization: Bearer <token>

# Delete payment
DELETE /payments/:id
Authorization: Bearer <token>
```

### Health Check
```bash
# API health check
GET /
# Response: {"message":"Payment Dashboard API is running!","timestamp":"..."}
```

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

#### Payments Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  amount: Number,
  method: String, // 'upi', 'card', 'bank_transfer', 'cash'
  status: String, // 'pending', 'completed', 'failed'
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## � Usage Instructions

### 1. Registration & Login
1. **Register a new account:**
   - Open the Flutter app
   - Navigate to registration screen
   - Fill in email, password, and name
   - Submit to create account

2. **Login:**
   - Use registered email and password
   - App will store JWT token for authenticated requests

### 2. Dashboard Overview
- View total payments, pending amounts, and transaction counts
- See payment distribution by method (UPI, Card, Bank Transfer, Cash)
- Monitor payment status breakdown (Completed, Pending, Failed)

### 3. Payment Management
1. **Create Payment:**
   - Tap "Add Payment" button
   - Select payment method
   - Enter amount and description
   - Submit to create

2. **View Payments:**
   - Browse all payments in list view
   - Use filters to sort by method, status, or date
   - Tap any payment to view details

3. **Update Payment:**
   - Open payment details
   - Edit amount, method, status, or description
   - Save changes

4. **Delete Payment:**
   - Open payment details
   - Use delete option to remove payment

### 4. Filtering & Search
- Filter by payment method (UPI, Card, Bank Transfer, Cash)
- Filter by status (Pending, Completed, Failed)
- Sort by date (newest/oldest first)
- Search by description or amount

## 🗄️ Database Schema

**Test User Account:**
- Email: `admin@test.com`
- Password: `password123`

**Note:** You need to register this account first through the app, then use these credentials to login.

## 📊 Sample Payment Data (Seed)

The system includes sample payment data that gets created automatically:

```javascript
// Sample payments for testing
[
  {
    amount: 2500.00,
    method: "upi",
    status: "completed",
    description: "Online purchase payment"
  },
  {
    amount: 1200.50,
    method: "card", 
    status: "pending",
    description: "Subscription renewal"
  },
  {
    amount: 750.00,
    method: "bank_transfer",
    status: "failed", 
    description: "Utility bill payment"
  },
  {
    amount: 3000.00,
    method: "cash",
    status: "completed",
    description: "Restaurant bill"
  }
]
```

**Payment Methods:** UPI, Card, Bank Transfer, Cash  
**Payment Status:** Pending, Completed, Failed  
**Currency:** Indian Rupees (₹)

## 📸 Screenshots


![Database](screenshots/Screenshot%202025-07-12%20at%2012.30.17.png)



![](screenshots/Screenshot%202025-07-12%20at%2012.37.27.png)



![Payment List](screenshots/Screenshot%202025-07-12%20at%2012.38.33.png)



![Create Payment](screenshots/Screenshot%202025-07-12%20at%2012.38.44.png)



![Payment Details](screenshots/Screenshot%202025-07-12%20at%2012.39.06.png)



![User Interface](screenshots/Screenshot%202025-07-12%20at%2012.39.22.png)


## � Sample Login Credentials

**Test User Account:**
- Email: `admin@test.com`
- Password: `password123`

**Note:** You need to register this account first through the app, then use these credentials to login.

## 🔧 Environment Variables

### Backend (.env file)
```env
# Server Configuration
NODE_ENV=production
PORT=3002

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment_dashboard?retryWrites=true&w=majority&appName=cluster-name
```

### Frontend Configuration
Update `lib/services/api_service.dart` for different environments:

```dart
// For production (default)
static const String baseUrl = 'https://payment-dashboard-z1s2.onrender.com';

// For local development
// static const String baseUrl = 'http://localhost:3002';
```

## 🛠️ Troubleshooting

### Common Backend Issues

**1. MongoDB Connection Failed:**
```bash
# Check connection string format
# Ensure IP whitelist includes your deployment platform
# Verify database user permissions
```

**2. Render Deployment Issues:**
```bash
# Check build logs for errors
# Verify environment variables are set correctly
# Ensure start command matches package.json scripts
```

**3. CORS Issues:**
```bash
# Backend already configured with CORS for all origins
# If issues persist, check browser network tab for specific errors
```

### Common Frontend Issues

**1. API Connection Failed:**
```dart
// Verify baseUrl in api_service.dart
// Check network connectivity
// Ensure backend is running and accessible
```

**2. Authentication Issues:**
```dart
// Clear app data/cache
// Re-register user account
// Check JWT token storage and expiration
```

**3. Flutter Build Issues:**
```bash
flutter clean
flutter pub get
flutter run
```

### Database Issues

**1. Empty Dashboard:**
- Create some sample payments through the app
- Check if user is properly authenticated
- Verify API endpoints are returning data

**2. Payment Creation Failed:**
- Check all required fields are filled
- Verify authentication token is valid
- Check backend logs for validation errors

## 🚀 Features

- **🔐 JWT Authentication** - Secure user registration and login
- **💳 Payment Management** - Full CRUD operations for payments
- **📊 Dashboard Analytics** - Real-time payment statistics and charts
- **🔍 Advanced Filtering** - Filter by method, status, date, and amount
- **💰 Currency Support** - Indian Rupees (₹) with proper formatting
- **📱 Mobile & Web Support** - Flutter cross-platform compatibility
- **☁️ Cloud Database** - MongoDB Atlas integration
- **🚀 Production Ready** - Deployed on Render with proper error handling
- **🔄 Real-time Updates** - Live data synchronization
- **🎨 Modern UI** - Clean and intuitive user interface

## 🧪 Testing the API

### Using cURL
```bash
# Health check
curl https://payment-dashboard-z1s2.onrender.com/

# Register new user
curl -X POST https://payment-dashboard-z1s2.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST https://payment-dashboard-z1s2.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get payments (replace TOKEN with actual JWT token)
curl -X GET https://payment-dashboard-z1s2.onrender.com/payments \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman
1. Import the API endpoints into Postman
2. Set base URL to `https://payment-dashboard-z1s2.onrender.com`
3. Use Bearer token authentication for protected routes
4. Test all CRUD operations for users and payments

## 🔗 Links

- **Live Backend:** https://payment-dashboard-z1s2.onrender.com
- **GitHub Repository:** https://github.com/varunjoshi84/Payment_dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Render Dashboard:** https://dashboard.render.com/

## 📝 Development Notes

### Tech Stack
- **Backend:** NestJS (TypeScript), MongoDB Atlas, JWT
- **Frontend:** Flutter (Dart)
- **Deployment:** Render (Backend), MongoDB Atlas (Database)
- **Authentication:** JWT with bcrypt password hashing
- **API:** RESTful with proper HTTP status codes

### Code Structure
- **Modular Architecture:** Separate modules for users, payments, auth
- **Type Safety:** Full TypeScript implementation with proper DTOs
- **Error Handling:** Comprehensive error responses and logging
- **Security:** Password hashing, JWT tokens, input validation
- **Scalability:** Cloud database with connection pooling

---

**Repository:** https://github.com/varunjoshi84/Payment_dashboard  
**Backend Status:** ✅ Live at https://payment-dashboard-z1s2.onrender.com  
**Database:** ✅ MongoDB Atlas Connected


