#!/bin/bash

set -e

echo "Starting deployment..."

ENVIRONMENT=${1:-production}
echo "Deploying to: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "Deploying to production..."
else
    echo "Deploying to staging..."
fi

echo "Building Docker images..."
docker-compose build

echo "Stopping old containers..."
docker-compose down

echo "Starting services..."
docker-compose up -d

echo "Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy

echo "Checking service health..."
sleep 10

docker-compose ps

echo "Deployment completed successfully!"