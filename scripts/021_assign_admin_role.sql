-- This script helps you assign admin or course_maker roles to users
-- Replace the email addresses below with your actual user email(s)

-- Option 1: Make yourself an admin (full access)
UPDATE public.profiles
SET 
  role = 'admin',
  is_course_maker = true,
  updated_at = now()
WHERE email = 'your-email@example.com'; -- Replace with your actual email

-- Option 2: Make someone a course maker (can create courses and lessons)
UPDATE public.profiles
SET 
  role = 'course_maker',
  is_course_maker = true,
  updated_at = now()
WHERE email = 'creator-email@example.com'; -- Replace with creator's email

-- Verify the role assignment
SELECT id, email, full_name, role, is_course_maker
FROM public.profiles
WHERE role IN ('admin', 'course_maker')
ORDER BY created_at DESC;
