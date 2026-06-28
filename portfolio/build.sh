#!/bin/bash

echo "🚀 Starting Render build process..."

# This 'cd' command is the key. It moves into the directory with manage.py.
cd portfolio

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Build completed successfully!"