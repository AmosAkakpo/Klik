-- ============================================
-- STORAGE SETUP (SAFE VERSION)
-- ============================================

-- 1. Create the 'listings' bucket
-- We use DO block to avoid errors if it exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLICIES
-- Note: We skip 'ALTER TABLE' because it causes permission errors. 
-- RLS is enabled by default on storage.objects in Supabase.

-- Drop existing policies to avoid conflicts if you run this multiple times
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Listings: Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Listings: Owner Update" ON storage.objects;
DROP POLICY IF EXISTS "Listings: Owner Delete" ON storage.objects;

-- Public Read Access
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT
TO PUBLIC
USING (bucket_id = 'listings');

-- Upload: Authenticated users can upload
CREATE POLICY "Listings: Auth Upload" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listings'
  -- We don't strictly enforce owner check on insert because auth.uid() is auto-assigned
);

-- Update: Only owner (uploader) can update
CREATE POLICY "Listings: Owner Update" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listings'
  AND owner = auth.uid() 
);

-- Delete: Only owner (uploader) can delete
CREATE POLICY "Listings: Owner Delete" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'listings'
  AND owner = auth.uid()
);
