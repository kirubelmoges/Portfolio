#!/bin/bash

echo "🚀 Starting Render build process..."

# Navigate to portfolio folder where manage.py is located
cd portfolio

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Build completed successfully!"