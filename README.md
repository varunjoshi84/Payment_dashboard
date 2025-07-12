# Payment Dashboard System

A full-stack payment management application with a **NestJS backend** (TypeScript) and a **Flutter frontend**. The system provides JWT authentication, payment management, dashboard statistics, and advanced filtering capabilities.

## 🚀 Features

- **User Authentication**: JWT-based login/register system
- **Payment Management**: Create, view, and manage payments
- **Dashboard Statistics**: Real-time payment stats and analytics
- **Advanced Filtering**: Filter payments by status, method, and more
- **Modern UI**: Clean and responsive Flutter interface
- **Database Integration**: MongoDB for data persistence
- **Currency Support**: Indian Rupee (₹) display

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Flutter** (latest stable version)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**## 🛠️ Project Structure

```
payment_dashboard/
├── backend/          # NestJS TypeScript API
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         # Flutter Mobile/Web App
│   ├── lib/
│   ├── pubspec.yaml
│   └── ...
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/varunjoshi84/Payment_dashboard.git
cd payment_dashboard
```

### 2. Backend Setup (NestJS)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# OR create .env manually with the following content:
```

Create a `.env` file in the `backend` directory:

```env
PORT=3002
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/payment_dashboard
```

```bash
# Build the TypeScript project
npm run build

# Start the development server
npm run start:dev
```

The backend will be running on `http://localhost:3002`

### 3. Frontend Setup (Flutter)

```bash
# Navigate to frontend directory
cd ../frontend

# Get Flutter dependencies
flutter pub get

# Run the Flutter app
flutter run
```

For web development:
```bash
flutter run -d chrome
```## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment_dashboard
   ```

## 🔐 Login Credentials

The system supports user registration and login. You can:

### Create a New Account
1. Open the app
2. Click "Don't have an account? Register"
3. Fill in your details and register

### Demo/Test Users
After starting the backend, you can register with any email and password. The system will create users automatically.

**Example credentials for testing:**
- Email: `admin@test.com`
- Password: `password123`

**Note**: These credentials will only work after you register them through the app.## 🚀 Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   flutter run
   ```

### Production Mode

1. **Build Backend**:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend**:
   ```bash
   cd frontend
   flutter build web
   # OR for mobile
   flutter build apk
   ```

## 🧪 API Endpoints

The backend provides the following REST API endpoints:

- `GET /api` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/payments` - Get payments (with filtering)
- `POST /api/payments` - Create new payment
- `GET /api/payments/stats` - Get payment statistics

### Example API Usage

```bash
# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'

# Get payments (requires JWT token)
curl -X GET http://localhost:3002/api/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📱 Frontend Features

- **Login/Register**: User authentication with form validation
- **Dashboard**: Payment statistics and overview
- **Payment List**: View all payments with filtering options
- **Create Payment**: Add new payments with various methods
- **Filters**: Filter by status (pending, completed, failed) and payment method (UPI, bank_transfer, cash, card)
- **Currency**: All amounts displayed in Indian Rupees (₹)## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3002
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/payment_dashboard
```

### Frontend
The Flutter app automatically connects to `http://localhost:3002` for development. For production, update the API base URL in `lib/services/api_service.dart`.

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network connectivity for Atlas

2. **Flutter Build Issues**:
   ```bash
   flutter clean
   flutter pub get
   flutter run
   ```

3. **Backend Port Already in Use**:
   - Change the PORT in `.env` to a different number
   - Or kill the process using the port:
     ```bash
     # Find the process
     lsof -i :3002
     # Kill it
     kill -9 <PID>
     ```

4. **CORS Issues**:
   - The backend is configured to allow all origins in development
   - For production, update CORS settings in `src/main.ts`

## 📦 Dependencies

### Backend Dependencies
- NestJS Framework
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- TypeScript

### Frontend Dependencies
- Flutter SDK
- Provider for state management
- HTTP for API calls
- Intl for date formatting

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request


