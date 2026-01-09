-- ============================================
-- INCREMENT HELPER FUNCTION
-- ============================================
-- Generic function to increment any integer column in any table
-- Used for view_count, click_count, contact_click_count, whatsapp_click_count

CREATE OR REPLACE FUNCTION increment(
    row_id UUID,
    table_name TEXT,
    column_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE format(
        'UPDATE %I SET %I = COALESCE(%I, 0) + 1 WHERE id = $1',
        table_name,
        column_name,
        column_name
    ) USING row_id;
END;
$$;

-- Grant execute to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment(UUID, TEXT, TEXT) TO authenticated, anon;
