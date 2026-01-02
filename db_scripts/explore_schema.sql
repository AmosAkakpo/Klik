-- 1. Add Analytics Columns
ALTER TABLE listings 
ADD COLUMN view_count INT DEFAULT 0,
ADD COLUMN click_count INT DEFAULT 0,
ADD COLUMN last_boosted_at TIMESTAMP WITH TIME ZONE;

-- Index for performance
CREATE INDEX idx_listings_status_city ON listings(status, location_city);
CREATE INDEX idx_listings_priority ON listings(current_priority DESC);


-- 2. "Get Explore Feed" Function (The Algorithm)
-- Returns sorted listings based on dynamic score
CREATE OR REPLACE FUNCTION get_explore_feed(
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0,
  p_city VARCHAR DEFAULT NULL,
  p_category_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  price DECIMAL,
  images TEXT[],
  location_city VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  plan_slug VARCHAR,
  is_boosted BOOLEAN,
  display_score FLOAT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.price,
    l.images,
    l.location_city,
    l.created_at,
    p.slug as plan_slug,
    (l.current_priority >= 100) as is_boosted,
    -- SCORING ALGORITHM
    (
      (l.current_priority * 2)               -- Base Plan Priority (Basic=1*2=2, Pro=10*2=20, Premium=20*2=40, Boost=100*2=200)
      + (CASE WHEN p.slug = 'premium' THEN 30 ELSE 0 END) -- Extra Premium Weight
      + LEAST(l.view_count / 10.0, 50.0)     -- Popularity (Capped at 50 points)
      + (random() * 30)                      -- Randomness (0-30 points) to shuffle Basic/Pro
    )::FLOAT as display_score
  FROM listings l
  LEFT JOIN plans p ON l.plan_id = p.id
  WHERE l.status = 'active'
    AND (p_city IS NULL OR l.location_city = p_city)
    AND (p_category_id IS NULL OR l.category_id = p_category_id)
  ORDER BY display_score DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;


-- 3. "Get Explore Hero" (Top Carousel)
-- Logic: Premium OR Boosted, Rotating Randomly
CREATE OR REPLACE FUNCTION get_explore_hero()
RETURNS SETOF listings
LANGUAGE sql
AS $$
  SELECT l.*
  FROM listings l
  LEFT JOIN plans p ON l.plan_id = p.id
  WHERE l.status = 'active'
    AND (p.slug = 'premium' OR l.current_priority >= 100)
  ORDER BY random()
  LIMIT 5;
$$;


-- 4. "Get Trending" (Weekly Hot)
-- Logic: High engagement in last 7 days
CREATE OR REPLACE FUNCTION get_explore_trending()
RETURNS SETOF listings
LANGUAGE sql
AS $$
  SELECT *
  FROM listings
  WHERE status = 'active'
    AND updated_at > NOW() - INTERVAL '7 days'
  ORDER BY (view_count + (click_count * 3)) DESC
  LIMIT 8;
$$;

-- Security: Allow public access to these functions
GRANT EXECUTE ON FUNCTION get_explore_feed TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_explore_hero TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_explore_trending TO anon, authenticated, service_role;
