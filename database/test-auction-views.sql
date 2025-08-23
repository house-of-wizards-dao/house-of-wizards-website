-- Test script for auction views with real-time status calculation
-- Run this after applying the migration to verify everything works correctly

-- Test 1: Check that all views exist and can be queried
SELECT 'Testing view existence and basic functionality' as test_name;

SELECT 'active_auctions' as view_name, COUNT(*) as count FROM active_auctions
UNION ALL
SELECT 'upcoming_auctions' as view_name, COUNT(*) as count FROM upcoming_auctions  
UNION ALL
SELECT 'ended_auctions' as view_name, COUNT(*) as count FROM ended_auctions
UNION ALL
SELECT 'all_auctions_with_status' as view_name, COUNT(*) as count FROM all_auctions_with_status
UNION ALL
SELECT 'auction_details' as view_name, COUNT(*) as count FROM auction_details;

-- Test 2: Verify that real-time status calculation is working correctly
SELECT 'Testing real-time status calculation' as test_name;

SELECT 
    title,
    status as stored_status,
    real_time_status,
    start_time,
    end_time,
    CASE 
        WHEN end_time < NOW() THEN 'Should be: ended'
        WHEN start_time > NOW() THEN 'Should be: upcoming'
        ELSE 'Should be: active'
    END as expected_status,
    CASE 
        WHEN real_time_status = CASE 
            WHEN status = 'cancelled' THEN 'cancelled'
            WHEN end_time < NOW() THEN 'ended'
            WHEN start_time > NOW() THEN 'upcoming'
            ELSE 'active'
        END THEN '✓ CORRECT'
        ELSE '✗ INCORRECT'
    END as status_check
FROM all_auctions_with_status
ORDER BY created_at DESC
LIMIT 10;

-- Test 3: Verify that active_auctions only shows truly active auctions
SELECT 'Testing active_auctions filtering' as test_name;

SELECT 
    COUNT(*) as active_auctions_count,
    COUNT(*) FILTER (WHERE start_time <= NOW() AND end_time > NOW()) as should_be_active,
    CASE 
        WHEN COUNT(*) = COUNT(*) FILTER (WHERE start_time <= NOW() AND end_time > NOW()) 
        THEN '✓ CORRECT - All auctions in active_auctions are truly active'
        ELSE '✗ INCORRECT - Some auctions in active_auctions are not currently active'
    END as validation_result
FROM active_auctions;

-- Test 4: Verify that upcoming_auctions only shows future auctions
SELECT 'Testing upcoming_auctions filtering' as test_name;

SELECT 
    COUNT(*) as upcoming_auctions_count,
    COUNT(*) FILTER (WHERE start_time > NOW()) as should_be_upcoming,
    CASE 
        WHEN COUNT(*) = COUNT(*) FILTER (WHERE start_time > NOW()) 
        THEN '✓ CORRECT - All auctions in upcoming_auctions are in the future'
        ELSE '✗ INCORRECT - Some auctions in upcoming_auctions have already started'
    END as validation_result
FROM upcoming_auctions;

-- Test 5: Verify that ended_auctions only shows finished auctions  
SELECT 'Testing ended_auctions filtering' as test_name;

SELECT 
    COUNT(*) as ended_auctions_count,
    COUNT(*) FILTER (WHERE end_time <= NOW()) as should_be_ended,
    CASE 
        WHEN COUNT(*) = COUNT(*) FILTER (WHERE end_time <= NOW()) 
        THEN '✓ CORRECT - All auctions in ended_auctions have finished'
        ELSE '✗ INCORRECT - Some auctions in ended_auctions have not finished yet'
    END as validation_result
FROM ended_auctions;

-- Test 6: Check performance with EXPLAIN for key queries
SELECT 'Performance test: Checking query plans' as test_name;

-- Note: EXPLAIN output will show if indexes are being used properly
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM active_auctions 
WHERE creator_id IS NOT NULL 
LIMIT 5;

-- Test 7: Verify time calculations are reasonable
SELECT 'Testing time calculations' as test_name;

SELECT 
    title,
    real_time_status,
    time_remaining_or_until_start,
    CASE 
        WHEN real_time_status = 'active' AND time_remaining_or_until_start < INTERVAL '0' 
        THEN '✗ INCORRECT - Active auction has negative time remaining'
        WHEN real_time_status = 'upcoming' AND time_remaining_or_until_start < INTERVAL '0'
        THEN '✗ INCORRECT - Upcoming auction has negative time until start'
        ELSE '✓ CORRECT - Time calculations look good'
    END as time_validation
FROM all_auctions_with_status
WHERE time_remaining_or_until_start IS NOT NULL
LIMIT 5;

-- Test 8: Check that total counts make sense
SELECT 'Testing count consistency' as test_name;

WITH counts AS (
    SELECT 
        (SELECT COUNT(*) FROM active_auctions) as active_count,
        (SELECT COUNT(*) FROM upcoming_auctions) as upcoming_count,
        (SELECT COUNT(*) FROM ended_auctions) as ended_count,
        (SELECT COUNT(*) FROM all_auctions_with_status WHERE real_time_status != 'cancelled') as non_cancelled_count,
        (SELECT COUNT(*) FROM all_auctions_with_status) as total_count
)
SELECT 
    active_count,
    upcoming_count, 
    ended_count,
    non_cancelled_count,
    total_count,
    CASE 
        WHEN active_count + upcoming_count + ended_count = non_cancelled_count
        THEN '✓ CORRECT - Active + Upcoming + Ended = Non-cancelled total'
        ELSE '✗ INCORRECT - Counts do not add up correctly'
    END as count_validation
FROM counts;

-- Test 9: Sample data from each view to verify structure
SELECT 'Sample data from active_auctions' as test_name;
SELECT title, real_time_status, time_remaining, total_bids, watchers_count 
FROM active_auctions 
LIMIT 3;

SELECT 'Sample data from upcoming_auctions' as test_name;
SELECT title, real_time_status, time_until_start, total_bids 
FROM upcoming_auctions 
LIMIT 3;

SELECT 'Sample data from ended_auctions' as test_name;
SELECT title, real_time_status, time_since_ended, total_bids 
FROM ended_auctions 
LIMIT 3;

-- Final summary
SELECT 'TEST SUMMARY' as result, 
       'All auction views have been tested. Review the results above to ensure everything is working correctly.' as message;

-- Instructions for fixing any issues
SELECT 'TROUBLESHOOTING' as section,
       'If any tests show INCORRECT results, check the auction data and verify that start_time and end_time values are reasonable.' as instructions;