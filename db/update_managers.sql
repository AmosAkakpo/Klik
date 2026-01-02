-- Add is_active column to managers
ALTER TABLE managers 
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Add updated_at if missing
-- ALTER TABLE managers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Policy: Super Admins can update managers
create policy "Super Admins can update managers"
  on managers for update
  using ( is_super_admin() );
