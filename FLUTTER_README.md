# Payment Dashboard - Full Stack Flutter & NestJS Application

A complete payment dashboard system built with Flutter frontend and NestJS backend, featuring authentication, payment management, and real-time dashboard analytics.

##  Features

### Backend (NestJS + MongoDB)
- **JWT Authentication** - Secure login/logout with role-based access
- **User Management** - Registration, user profiles, admin controls
- **Payment Processing** - Create, view, filter payments with multiple methods
- **Dashboard Analytics** - Real-time payment statistics and insights
- **Data Seeding** - Sample data generation for testing
- **CORS Support** - Cross-origin resource sharing for frontend integration
- **API Documentation** - Comprehensive endpoint documentation

### Frontend (Flutter Web/Mobile)
- **Responsive Design** - Works on web, mobile, and desktop
- **Modern UI** - Clean, intuitive Material Design interface
- **Real-time Updates** - Live dashboard with payment statistics
- **Advanced Filtering** - Filter payments by status, method, date
- **State Management** - Efficient state handling with Provider
- **Demo Mode** - Fallback demo data when backend is unavailable
- **Error Handling** - Graceful error handling and user feedback

## 📱 Screenshots & Demo

### Login Screen
- Clean authentication interface
- Support for both registration and login
- Demo credentials for easy testing
- Form validation and error handling

### Dashboard
- **Statistics Cards**: Total amount, payment counts by status
- **Payment List**: Detailed payment history with filtering
- **Create Payments**: Easy payment creation form
- **Responsive Layout**: Adapts to different screen sizes

### Features Demonstrated
- Real-time payment statistics
- Advanced filtering by status and method
- Modern card-based UI design
- Loading states and error handling
- Demo mode for offline testing

## 🛠 Technology Stack

### Backend
- **NestJS** - Modern Node.js framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Flutter** - Cross-platform UI framework
- **Provider** - State management solution
- **HTTP** - REST API communication
- **SharedPreferences** - Local storage for tokens
- **Material Design** - Modern UI components

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- Flutter (v3.0+)
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your MongoDB URL
npm start
```

### Frontend Setup
```bash
cd frontend
flutter pub get
flutter run -d chrome --web-port 3001
```

### Demo Access
**Demo Mode (Works without backend):**
- Email: `demo@test.com`
- Password: `demo123`

**Backend Test (Requires backend running):**
- Email: `admin@test.com`
- Password: `admin123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Payments
- `GET /api/payments` - Get payments (with filtering)
- `POST /api/payments` - Create new payment
- `GET /api/payments/stats` - Get payment statistics
- `GET /api/payments/:id` - Get payment by ID

### Data Seeding
- `POST /api/seed/admin` - Create admin user
- `POST /api/seed/payments` - Generate sample payments

## 🎯 Key Features Implemented

### 1. Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin/User)
- Persistent login sessions
- Password hashing with bcrypt

### 2. Payment Management
- Create payments with multiple methods (Credit Card, PayPal, Bank Transfer)
- View payment history with pagination
- Filter payments by status (Pending, Completed, Failed)
- Filter payments by payment method
- Real-time payment statistics

### 3. Dashboard Analytics
- Total payment amount calculation
- Payment count by status
- Visual status indicators with color coding
- Responsive statistics cards

### 4. Modern UI/UX
- Material Design 3 components
- Responsive layout for all screen sizes
- Loading states and error handling
- Intuitive navigation and user flow
- Professional color scheme and typography

### 5. Production Ready Features
- Environment configuration
- Error handling and logging
- Input validation and sanitization
- CORS configuration
- Demo mode for testing

## 🔧 Configuration

### Backend Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/payment_dashboard
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

### Frontend Configuration
Update `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'your-backend-url/api';
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop Web** - Full-featured experience
- **Mobile Web** - Touch-optimized interface
- **Native Mobile** - iOS and Android apps (when compiled)
- **Tablet** - Optimized for larger touch screens

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test          # Unit tests
npm run test:e2e  # End-to-end tests
```

### Frontend Testing
```bash
cd frontend
flutter test
```

### Demo Data
Use the seeding endpoints or demo mode to populate the application with sample data for testing.

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, AWS, or DigitalOcean
- Configure production MongoDB instance
- Set environment variables for production

### Frontend Deployment
- **Web**: `flutter build web` and deploy to any static hosting
- **Mobile**: `flutter build apk` for Android, `flutter build ios` for iOS
- **Desktop**: `flutter build macos/windows/linux` for native apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Built with modern Flutter and NestJS frameworks
- Uses MongoDB for scalable data storage
- Implements industry-standard authentication and security practices
- Follows Material Design guidelines for consistent UI/UX

---

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

**Demo URL**: http://localhost:3001 (when running locally)
**API URL**: http://localhost:3000/api (when running locally)

Happy coding! 🎉
