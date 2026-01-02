-- ============================================
-- SCHÉMA V3 - EXPLORE PAGE & ALGORITHMS
-- ============================================

-- 1. COLUMNS FOR ANALYTICS & BOOST HISTORY
-- ============================================
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_boosted_at TIMESTAMP WITH TIME ZONE;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_listings_analytics ON listings(view_count, click_count);
CREATE INDEX IF NOT EXISTS idx_listings_priority ON listings(current_priority);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location_city);

-- 2. UPDATE BASIC PLAN PRIORITY
-- ============================================
-- User requested Basic = 1 (was 0)
UPDATE plans SET priority_level = 1 WHERE slug = 'basic';


-- 3. EXPLORE ALGORITHM FUNCTIONS (RPC)
-- ============================================

-- A. GET HERO CAROUSEL ITEMS
-- Premium listings OR Currently Boosted listings
-- Random rotation (Limit 5)
CREATE OR REPLACE FUNCTION get_explore_hero()
RETURNS SETOF listings 
LANGUAGE sql
STABLE
AS $$
  SELECT l.*
  FROM listings l
  JOIN plans p ON l.plan_id = p.id
  WHERE l.status = 'active'
    AND (p.slug = 'premium' OR l.current_priority >= 100) -- 100+ is boosted
  ORDER BY random()
  LIMIT 5;
$$;


-- B. GET TRENDING LISTINGS
-- Based on Views + Clicks (User Engagement)
-- Formula: (Views * 1) + (Clicks * 3)
-- Limit 8
CREATE OR REPLACE FUNCTION get_explore_trending()
RETURNS SETOF listings
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM listings
  WHERE status = 'active'
  ORDER BY (view_count + (click_count * 3)) DESC
  LIMIT 8;
$$;


-- C. MAIN EXPLORE FEED (Infinite Scroll)
-- The "Fair Algorithm"
CREATE OR REPLACE FUNCTION get_explore_feed(
  page_number INT DEFAULT 1,
  page_size INT DEFAULT 20,
  filter_city TEXT DEFAULT NULL,
  filter_category UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price DECIMAL,
  images TEXT[],
  location_city TEXT,
  plan_slug TEXT,
  is_boosted BOOLEAN,
  display_score FLOAT -- Debugging purpose
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.price,
    l.images,
    l.location_city,
    p.slug as plan_slug,
    (l.current_priority >= 100) as is_boosted,
    
    -- SCORING ALGORITHM
    (
      (l.current_priority * 2.0) +       -- Base Tier Priority (Basic=1*2, Pro=10*2, Premium=20*2, Boosted=100*2)
      (CASE WHEN p.slug = 'premium' THEN 50.0 ELSE 0.0 END) + -- Premium Bonus
      (LEAST(l.view_count, 1000) / 20.0) +  -- Organic Pop (Capped impact)
      (random() * 40.0)                  -- Randomness (0-40 points) -> Allows Basic to beat Pro sometimes
    )::FLOAT as display_score

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
