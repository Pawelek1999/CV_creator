#!/bin/sh
set -e

mkdir -p /app/data

echo "Applying database migrations (creates the database if it doesn't exist yet)..."
alembic upgrade head

exec "$@"
