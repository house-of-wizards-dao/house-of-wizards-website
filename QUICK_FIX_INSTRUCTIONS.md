# Quick Fix for Auction Categorization Issue

## Problem
The "Active Auctions" tab is showing ended auctions because the database views aren't filtering by actual time.

## Solution
The frontend code has been updated. Now you need to update the database views.

## Steps to Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open your Supabase Dashboard**
   - Go to your project at https://supabase.com/dashboard
   - Navigate to the SQL Editor

2. **Run the Migration**
   - Copy the entire contents of `database/migrations/fix-auction-views-real-time-status.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify the Fix**
   - Go back to your application
   - Check that:
     - Active Auctions tab only shows currently running auctions
     - Upcoming tab shows future auctions  
     - Past Auctions tab shows ended auctions

### Option 2: Using Command Line

1. **Run the migration script**:
   ```bash
   ./apply-auction-views-fix.sh
   ```

2. **Enter your database connection string when prompted**

### Option 3: Manual psql Command

```bash
psql "YOUR_DATABASE_URL" -f ./database/migrations/fix-auction-views-real-time-status.sql
```

## What This Fix Does

1. **Updates `active_auctions` view** to only include auctions where:
   - `start_time <= NOW()` (auction has started)
   - `end_time > NOW()` (auction hasn't ended)

2. **Creates `upcoming_auctions` view** for auctions where:
   - `start_time > NOW()` (auction hasn't started yet)

3. **Creates `ended_auctions` view** for auctions where:
   - `end_time <= NOW()` (auction has ended)

4. **Adds real-time status calculation** that computes status based on current time

5. **Creates performance indexes** on `start_time` and `end_time` columns

## Testing

After applying the fix, test by:

1. Navigate to `/auctions` page
2. Click on each tab (Active, Upcoming, Past Auctions)
3. Verify auctions appear in the correct categories
4. Check that status badges match the actual auction state

## Rollback (if needed)

If you need to rollback, run this SQL in your Supabase dashboard:

```sql
-- Drop the new views
DROP VIEW IF EXISTS upcoming_auctions CASCADE;
DROP VIEW IF EXISTS ended_auctions CASCADE;
DROP VIEW IF EXISTS all_auctions_with_status CASCADE;

-- Restore original active_auctions view
DROP VIEW IF EXISTS active_auctions CASCADE;
CREATE VIEW active_auctions AS
SELECT 
    a.*,
    p.name as creator_name,
    p.avatar_url as creator_avatar,
    COUNT(DISTINCT b.id) as total_bids,
    COUNT(DISTINCT w.user_id) as watchers_count,
    MAX(b.amount) as current_bid
FROM auctions a
LEFT JOIN profiles p ON a.creator_id = p.id
LEFT JOIN bids b ON a.id = b.auction_id
LEFT JOIN auction_watchers w ON a.id = w.auction_id
WHERE a.deleted_at IS NULL
GROUP BY a.id, p.name, p.avatar_url;
```

## Success Indicators

✅ Active Auctions tab shows only auctions currently accepting bids
✅ Ended auctions appear in Past Auctions tab  
✅ Status badges correctly show "Active", "Upcoming", or "Ended"
✅ Time remaining only shows for active auctions