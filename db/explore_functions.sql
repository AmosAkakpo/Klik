-- ============================================
-- EXPLORE PAGE RPC FUNCTIONS
-- ============================================
-- Run this in Supabase SQL Editor to create the functions needed for the Explore page

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_explore_hero();
DROP FUNCTION IF EXISTS get_explore_trending();
DROP FUNCTION IF EXISTS get_explore_feed(INT, INT, TEXT, UUID);

-- 1. GET HERO CAROUSEL ITEMS
-- Returns Premium or Boosted listings for the hero carousel
CREATE OR REPLACE FUNCTION get_explore_hero()
RETURNS TABLE (
    id uuid,
    title text,
    images jsonb,
    location_city text,
    price numeric
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        l.id,
        l.title::text,
        l.images,
        l.location_city::text,
        l.price
    FROM listings l
    WHERE l.status = 'active'
      AND (l.tier = 'premium' OR l.current_priority >= 100)
    ORDER BY random()
    LIMIT 5;
$$;


-- 2. GET TRENDING LISTINGS
-- Based on engagement (views + clicks)
CREATE OR REPLACE FUNCTION get_explore_trending()
RETURNS TABLE (
    id uuid,
    title text,
    images jsonb,
    location_city text,
    price numeric,
    current_priority integer
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        id,
        title::text,
        images,
        location_city::text,
        price,
        current_priority
    FROM listings
    WHERE status = 'active'
    ORDER BY (view_count + (click_count * 3)) DESC
    LIMIT 8;
$$;


-- 3. MAIN EXPLORE FEED (The "Fair Algorithm")
-- Returns listings with weighted scoring for infinite scroll
CREATE OR REPLACE FUNCTION get_explore_feed(
    page_number INT DEFAULT 1,
    page_size INT DEFAULT 12,
    filter_city TEXT DEFAULT NULL,
    filter_category UUID DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    price numeric,
    images jsonb,
    location_city text,
    plan_slug text,
    is_boosted boolean,
    display_score float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title::text,
        l.price,
        l.images,
        l.location_city::text,
        p.slug::text as plan_slug,
        (l.current_priority >= 100) as is_boosted,
        
        -- SCORING ALGORITHM
        (
            (l.current_priority * 2.0) +                    -- Base Priority (Basic=1*2, Pro=10*2, Premium=20*2, Boosted=100*2)
            (CASE WHEN p.slug = 'premium' THEN 50.0 ELSE 0.0 END) + -- Premium Bonus
            (LEAST(l.view_count, 1000) / 20.0) +           -- Organic Popularity (capped)
            (random() * 40.0)                               -- Randomness (allows Basic to beat Pro sometimes)
        )::float as display_score

    FROM listings l
    JOIN plans p ON l.plan_id = p.id
    WHERE l.status = 'active'
        AND (filter_city IS NULL OR l.location_city = filter_city)
        AND (filter_category IS NULL OR l.category_id = filter_category)
    ORDER BY display_score DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;

-- Grant execute permissions to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_explore_hero() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_explore_trending() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_explore_feed(INT, INT, TEXT, UUID) TO authenticated, anon;
