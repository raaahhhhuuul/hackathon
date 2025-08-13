#!/bin/bash

echo "🚀 Starting AI Business Analytics Dashboard..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🔧 Starting backend server on port 5001..."
echo "🌐 Starting frontend on port 3000..."
echo ""
echo "📱 Open your browser and go to: http://localhost:3000"
echo "🔌 Backend API will be available at: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev 