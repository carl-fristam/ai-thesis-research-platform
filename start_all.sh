# This script opens the backend and frontend
echo "Starting Backend..."
cd backend && source venv/bin/activate && python app.py & 
echo "Starting Frontend..."
cd ../frontend && npm run dev
