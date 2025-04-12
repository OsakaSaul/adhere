#!/bin/bash

MODE=${1:-dev}

if [ "$MODE" = "dev" ]; then
  echo "Starting in DEVELOPMENT mode..."
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
elif [ "$MODE" = "prod" ]; then
  echo "Starting in PRODUCTION mode..."
  docker-compose up
else
  echo "Unknown mode: $MODE"
  echo "Usage: ./run.sh [dev|prod]"
  exit 1
fi