#!/usr/bin/env bash
# Content to switch among environment {Development or Production}
# Usage: ./switch-env.sh dev || ./switch-env.sh prod
if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo "Switching to production environment..."
    cp .env.production .env
    export NODE_ENV=production
elif [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    echo "Switching to development environment..."
    cp config.env .env
    export NODE_ENV=development
else
    echo "Please specify environment: dev/development or prod/production"
    exit 1
fi

echo "Environment switched to $NODE_ENV"
