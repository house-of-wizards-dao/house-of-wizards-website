-- Database Verification Script
-- Run this in Supabase SQL Editor after deploying the schema

-- 1. Check if all tables exist
SELECT 
    'artworks' as table_name, 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'artworks') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END as status
UNION ALL
SELECT 
    'auctions', 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auctions') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'bids', 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bids') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'bid_history', 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bid_history') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'watchlist', 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'watchlist') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'auction_views', 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auction_views') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'activity_logs', 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_logs') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END;

-- 2. Check if custom types exist
SELECT 
    'auction_status' as type_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auction_status') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END as status
UNION ALL
SELECT 
    'bid_status',
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_status') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'artwork_status',
    CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'artwork_status') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END;

-- 3. Check if functions exist
SELECT 
    'update_updated_at_column' as function_name,
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END as status
UNION ALL
SELECT 
    'update_auction_bid_stats',
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_auction_bid_stats') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'auto_end_auctions',
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'auto_end_auctions') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END
UNION ALL
SELECT 
    'prevent_self_bidding',
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'prevent_self_bidding') 
         THEN '✅ Exists' 
         ELSE '❌ Missing' 
    END;

-- 4. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('artworks', 'auctions', 'bids', 'bid_history', 'watchlist', 'auction_views', 'activity_logs')
ORDER BY tablename;

-- 5. Count policies for each table
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('artworks', 'auctions', 'bids', 'bid_history', 'watchlist', 'auction_views', 'activity_logs')
GROUP BY schemaname, tablename
ORDER BY tablename;

-- 6. Test basic functionality (should return empty results but no errors)
SELECT 'Testing artworks table...' as test_name;
SELECT COUNT(*) as artwork_count FROM artworks;

SELECT 'Testing auctions table...' as test_name;
SELECT COUNT(*) as auction_count FROM auctions;

SELECT 'Testing bids table...' as test_name;
SELECT COUNT(*) as bid_count FROM bids;

-- If you reach here without errors, the database schema is deployed correctly! ✅