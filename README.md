# Payment Dashboard System

A full-stack payment management application with **NestJS backend** (TypeScript) and **Flutter frontend**.

## 📋 Prerequisites

- **Node.js** (v16+)
- **Flutter** (latest stable)
- **MongoDB** (local or Atlas)

## 🛠️ Project Structure

```
payment_dashboard/
├── backend/          # NestJS TypeScript API
├── frontend/         # Flutter App
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/varunjoshi84/Payment_dashboard.git
cd payment_dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Update MongoDB URI in .env
npm run build
npm run start:dev     # Runs on http://localhost:3002
```

### 3. Frontend Setup
```bash
cd frontend
flutter pub get
flutter run          # For mobile
flutter run -d chrome # For web
```

## 🗄️ Database Schema

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

## 🔐 Sample Login Credentials

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


## 🔧 Environment Variables

Create `.env` file in backend directory:
```env
PORT=3002
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/payment_dashboard
```

## 🚀 Features

- JWT Authentication
- Payment Management (CRUD)
- Dashboard Analytics
- Advanced Filtering
- Currency Support (₹)
- Mobile & Web Support

---

**Repository:** https://github.com/varunjoshi84/Payment_dashboard.git


