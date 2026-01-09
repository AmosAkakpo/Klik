-- ============================================
-- DEBUG SCRIPT FOR EXPLORE FEED
-- ============================================
-- Run these queries in Supabase SQL Editor to debug the issue

-- 1. Check if listings exist
SELECT COUNT(*) as total_listings, 
       COUNT(CASE WHEN status = 'active' THEN 1 END) as active_listings
FROM listings;

-- 2. Check if plans are properly linked
SELECT 
    l.id,
    l.title,
    l.tier,
    l.plan_id,
    p.slug as plan_slug,
    l.current_priority,
    l.status
FROM listings l
LEFT JOIN plans p ON l.plan_id = p.id
LIMIT 5;

-- 3. Test the RPC function directly
SELECT * FROM get_explore_feed(1, 5, NULL, NULL);

-- 4. Check if the function exists and its definition
SELECT 
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname LIKE '%explore%';
