#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env not found. Copy .env.example to .env and fill in values."
    exit 1
fi

if [ -z "$DOMAIN" ]; then
    echo "Error: DOMAIN is not set in .env"
    exit 1
fi

if [ -z "$CERTBOT_EMAIL" ]; then
    echo "Error: CERTBOT_EMAIL is not set in .env"
    exit 1
fi

echo "=== Obtaining SSL certificate for $DOMAIN ==="

# Start nginx for ACME challenge
docker compose -f docker-compose.https.yml up -d nginx_certbot

# Wait for nginx to start
sleep 3

# Run certbot
docker compose -f docker-compose.https.yml run --rm certbot

# Stop certbot nginx
docker compose -f docker-compose.https.yml down

echo "=== SSL certificate obtained ==="
echo "=== Starting production services ==="

docker compose -f docker-compose.prod.yml up --build -d

echo "=== Deployment complete ==="
echo "Site available at: https://$DOMAIN"
