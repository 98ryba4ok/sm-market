#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "=== Pulling latest changes ==="
git pull

echo "=== Rebuilding and restarting services ==="
docker compose -f docker-compose.prod.yml up --build -d

echo "=== Release complete ==="
