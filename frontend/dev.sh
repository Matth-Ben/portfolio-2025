#!/bin/bash

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old containers and images
echo "🧹 Cleaning up..."
docker-compose rm -f
docker system prune -f

# Rebuild and start
echo "🚀 Starting development environment..."
docker-compose up --build

# Alternative: Use the dev compose file
# docker-compose -f docker-compose.dev.yml up --build 