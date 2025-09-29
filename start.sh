#!/bin/bash

# Intelligent Internship Navigator - Startup Script

echo "🚀 Starting Intelligent Internship Navigator..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Function to start backend
start_backend() {
    echo "📦 Starting backend server..."
    cd backend
    source venv/bin/activate
    python app_sqlite.py &
    BACKEND_PID=$!
    echo "✅ Backend started on http://localhost:5001 (PID: $BACKEND_PID)"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
    cd ..
}

# Start both servers
start_backend
sleep 3
start_frontend

echo ""
echo "🎉 Both servers are starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait
