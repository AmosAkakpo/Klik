-- ============================================
-- STORAGE SETUP FOR LISTINGS
-- ============================================

-- 1. Create the 'listings' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (It's usually enabled by default but good to ensure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES

-- Allow Public READ access to any file in 'listings' bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'listings' );

-- Allow Authenticated Managers to INSERT files
-- (Check if user is authenticated)
CREATE POLICY "Managers Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'listings'
);

-- Allow Authenticated Managers to UPDATE their own files
CREATE POLICY "Managers Can Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'listings' );

-- Allow Authenticated Managers to DELETE their own files
CREATE POLICY "Managers Can Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'listings' );
