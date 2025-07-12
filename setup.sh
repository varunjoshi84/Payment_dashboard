#!/bin/bash

# Payment Dashboard Setup Script
# This script helps you set up the Payment Dashboard with different backend options

set -e

echo " Payment Dashboard Setup"
echo "=========================="
echo ""

# Function to display menu
show_menu() {
    echo "Choose your setup option:"
    echo "1) Quick Start (Use Production Backend) - Recommended"
    echo "2) Local Development Setup"
    echo "3) Custom Backend Setup"
    echo "4) Backend Information"
    echo "5) Exit"
    echo ""
}

# Function for quick start
quick_start() {
    echo " Quick Start Setup"
    echo "==================="
    echo ""
    echo "This will set up the Flutter app to use our production backend."
    echo "No backend setup required!"
    echo ""
    
    if [ ! -d "frontend" ]; then
        echo "Frontend directory not found. Please run this script from the project root."
        exit 1
    fi
    
    cd frontend
    echo "Installing Flutter dependencies..."
    flutter pub get
    
    echo ""
    echo "Setup complete! You can now run the app with:"
    echo "   flutter run"
    echo ""
    echo "Backend URL: https://payment-dashboard-z1s2.onrender.com/api"
    echo ""
}

# Function for local development
local_setup() {
    echo "Local Development Setup"
    echo "=========================="
    echo ""
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo "Node.js is not installed. Please install Node.js (v16+) first."
        echo "   Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check if MongoDB is available
    if ! command -v mongod &> /dev/null; then
        echo "  MongoDB is not installed locally."
        echo "   You can either:"
        echo "   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
        echo "   2. Use MongoDB Atlas (cloud): https://cloud.mongodb.com/"
        echo ""
    fi
    
    # Setup backend
    if [ ! -d "backend" ]; then
        echo " Backend directory not found."
        exit 1
    fi
    
    cd backend
    echo "Installing backend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/payment_dashboard
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3002
NODE_ENV=development
EOF
        echo "Created .env file with default settings."
        echo "   Edit backend/.env to configure your MongoDB connection."
    fi
    
    echo "Building backend..."
    npm run build
    
    cd ../frontend
    echo "Installing Flutter dependencies..."
    flutter pub get
    
    # Update API config to use local backend
    echo "🔧 Configuring app for local backend..."
    sed -i.bak 's/static const String currentEnvironment = PRODUCTION/static const String currentEnvironment = LOCAL/' lib/config/api_config.dart
    
    echo ""
    echo " Local setup complete!"
    echo ""
    echo "To start the backend:"
    echo "   cd backend && npm start"
    echo ""
    echo "To start the Flutter app:"
    echo "   cd frontend && flutter run"
    echo ""
    echo "Backend will be available at: http://localhost:3002"
    echo ""
}

# Function for custom backend setup
custom_setup() {
    echo " Custom Backend Setup"
    echo "======================="
    echo ""
    echo "This option helps you configure a custom backend URL."
    echo ""
    
    read -p "Enter your custom backend URL (e.g., https://your-app.herokuapp.com/api): " custom_url
    
    if [ -z "$custom_url" ]; then
        echo " No URL provided. Exiting."
        return
    fi
    
    cd frontend
    echo " Installing Flutter dependencies..."
    flutter pub get
    
    # Update API config
    echo "Configuring app for custom backend..."
    sed -i.bak "s|CUSTOM: 'https://your-custom-backend.com/api'|CUSTOM: '$custom_url'|" lib/config/api_config.dart
    sed -i.bak 's/static const String currentEnvironment = PRODUCTION/static const String currentEnvironment = CUSTOM/' lib/config/api_config.dart
    
    echo ""
    echo " Custom backend setup complete!"
    echo ""
    echo "Backend URL: $custom_url"
    echo ""
    echo "To start the Flutter app:"
    echo "   cd frontend && flutter run"
    echo ""
}

# Function to show backend information
show_backend_info() {
    echo " Backend Information"
    echo "======================"
    echo ""
    echo "Available Backend Options:"
    echo ""
    echo "1.  Production Backend (Recommended)"
    echo "   URL: https://payment-dashboard-z1s2.onrender.com/api"
    echo "   Features: Ready to use, shared database, no setup"
    echo "   Best for: End users, quick testing"
    echo ""
    echo "2.  Local Development Backend"
    echo "   URL: http://localhost:3002/api"
    echo "   Features: Full control, custom database, local development"
    echo "   Best for: Developers, customization"
    echo "   Requirements: Node.js, MongoDB"
    echo ""
    echo "3.  Custom Backend"
    echo "   URL: Your deployed backend"
    echo "   Features: Your infrastructure, full control"
    echo "   Best for: Production deployments"
    echo "   Requirements: Backend deployment (Heroku, Render, etc.)"
    echo ""
    echo "Current Configuration:"
    if [ -f "frontend/lib/config/api_config.dart" ]; then
        current_env=$(grep "currentEnvironment =" frontend/lib/config/api_config.dart | head -1)
        echo "   $current_env"
    else
        echo "   Configuration file not found"
    fi
    echo ""
}

# Main script
while true; do
    show_menu
    read -p "Enter your choice (1-5): " choice
    echo ""
    
    case $choice in
        1)
            quick_start
            break
            ;;
        2)
            local_setup
            break
            ;;
        3)
            custom_setup
            break
            ;;
        4)
            show_backend_info
            echo ""
            ;;
        5)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo " Invalid option. Please choose 1-5."
            echo ""
            ;;
    esac
done
