#!/bin/bash

# Payment Dashboard Setup Script
echo "🚀 Setting up Payment Dashboard System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📄 Created .env file from template. Please update MongoDB URI and JWT secret."
fi

# Install dependencies
npm install
echo "✅ Backend dependencies installed!"

# Build TypeScript
npm run build
echo "✅ Backend built successfully!"

# Go back to root
cd ..

# Setup Frontend
echo "📱 Setting up Frontend..."
cd frontend

# Get Flutter dependencies
flutter pub get
echo "✅ Frontend dependencies installed!"

# Go back to root
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start MongoDB (if using local database)"
echo "2. Update backend/.env with your MongoDB URI"
echo "3. Start backend: cd backend && npm run start:dev"
echo "4. Start frontend: cd frontend && flutter run"
echo ""
echo "🔐 Login Info:"
echo "- Register a new account through the app"
echo "- Or use any email/password combination after registering"
echo ""
echo "📚 For detailed instructions, see README.md"
