#!/bin/bash

# Apply the auction views fix migration to the database

echo "🔧 Applying auction views fix migration..."
echo ""
echo "This script will update the database views to properly filter auctions by time."
echo "Make sure you have your Supabase connection details ready."
echo ""

# Check if migration file exists
if [ ! -f "./database/migrations/fix-auction-views-real-time-status.sql" ]; then
    echo "❌ Migration file not found at ./database/migrations/fix-auction-views-real-time-status.sql"
    exit 1
fi

echo "📋 Migration file found. This will:"
echo "  1. Update active_auctions view to only show currently active auctions"
echo "  2. Create upcoming_auctions view for future auctions"
echo "  3. Create ended_auctions view for past auctions"
echo "  4. Add real-time status calculation to all views"
echo "  5. Create performance indexes for time-based queries"
echo ""

read -p "Do you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "Please enter your Supabase database connection string."
echo "You can find this in your Supabase project settings under Database > Connection string."
echo "It should look like: postgresql://postgres:[password]@[host]:[port]/postgres"
echo ""
read -p "Database URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Database URL is required"
    exit 1
fi

echo ""
echo "🚀 Running migration..."

# Run the migration using psql
psql "$DATABASE_URL" -f ./database/migrations/fix-auction-views-real-time-status.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Refresh your application to load the updated views"
    echo "2. Test the auction filtering on all tabs"
    echo "3. Verify that:"
    echo "   - Active Auctions tab only shows currently running auctions"
    echo "   - Upcoming tab shows future auctions"
    echo "   - Past Auctions tab shows ended auctions"
else
    echo ""
    echo "❌ Migration failed. Please check the error messages above."
    echo "If you need to rollback, check the AUCTION_VIEWS_FIX_README.md for instructions."
    exit 1
fi