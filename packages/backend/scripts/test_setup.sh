#!/bin/bash
set -e

echo "Generating test Prisma client..."
npx prisma generate --schema=prisma/schema.test.prisma

echo "Setting up test database..."
TEST_DATABASE_URL="file:$(pwd)/prisma/test.db" npx prisma db push --schema=prisma/schema.test.prisma --skip-generate

echo "Seeding test database..."
npx tsx prisma/seed.ts

echo "Setup complete."
