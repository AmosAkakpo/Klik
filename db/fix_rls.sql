-- ============================================
-- FIX: BREAKING INFINITE RECURSION IN RLS
-- ============================================

-- Function to check if user is super_admin securely
-- Uses SECURITY DEFINER to bypass RLS for this specific check
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM managers
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated Policy for Managers Table
DROP POLICY IF EXISTS "Voir profils managers" ON managers;

CREATE POLICY "Voir profils managers" ON managers FOR SELECT USING (
    auth.uid() = id OR is_super_admin()
);
