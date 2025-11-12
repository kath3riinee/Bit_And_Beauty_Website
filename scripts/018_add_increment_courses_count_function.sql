-- Create a function to safely increment courses_count
CREATE OR REPLACE FUNCTION increment_courses_count(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET courses_count = COALESCE(courses_count, 0) + 1,
      updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_courses_count(uuid) TO authenticated;
