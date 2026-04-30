#!/bin/bash
set -e

# TRC Safe Migration Helper
# Use this script to validate migrations against the "Expand-Only" principle.

echo "🔍 Validating migration safety..."

# 1. Check for forbidden keywords in the migration SQL
# Note: This is a basic check. Real-world systems use tools like 'atlas' or 'sql-lint'.
FORBIDDEN=("DROP COLUMN" "RENAME COLUMN" "DROP TABLE" "RENAME TABLE")

for term in "${FORBIDDEN[@]}"; do
  if grep -qi "$term" ./prisma/migrations/**/*.sql; then
    echo "❌ ERROR: Destructive operation detected: '$term'"
    echo "⚠️  Enterprise policy requires zero-downtime (Expand-Only) migrations."
    echo "👉 Please follow the 2-Step Deployment strategy: Add first, then Cleanup in a later release."
    exit 1
  fi
done

echo "✅ Migration validated as safe (Expand-Only)."

# 2. Run the deployment migration
echo "🚀 Applying migrations..."
npx prisma migrate deploy

echo "✨ Migrations complete."
