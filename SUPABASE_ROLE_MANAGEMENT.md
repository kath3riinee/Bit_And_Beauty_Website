# Managing Administrator Roles in Supabase

## Quick Access Guide

### Step 1: Access Your Supabase Project Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your Supabase account
3. Select your project from the list (look for the project name matching your app)

### Step 2: Navigate to the Table Editor
1. In the left sidebar, click on the **Table Editor** icon (looks like a table grid)
2. You'll see a list of all your database tables
3. Click on the **`profiles`** table

### Step 3: View and Edit User Roles

#### Using the Table Editor (Visual Method)
1. In the `profiles` table, you'll see columns including:
   - `id` - User's unique ID
   - `email` - User's email address
   - `full_name` - User's display name
   - `role` - Current role assignment
   - `is_course_maker` - Boolean for course creation access
   
2. To change a user's role:
   - Find the user by scrolling or using the search/filter
   - Click on the `role` cell for that user
   - Select from dropdown: `student`, `mentor`, `business_owner`, `course_maker`, `admin`, or `administrator`
   - The change saves automatically

3. To grant course maker access:
   - Click on the `is_course_maker` cell
   - Toggle it to `true`
   - The change saves automatically

#### Using SQL Editor (Advanced Method)
1. In the left sidebar, click on **SQL Editor** icon
2. Click **New Query**
3. Use these SQL commands:

**Make someone an Administrator:**
\`\`\`sql
UPDATE public.profiles 
SET role = 'administrator', is_course_maker = true 
WHERE email = 'user@example.com';
\`\`\`

**Make someone an Admin (legacy role):**
\`\`\`sql
UPDATE public.profiles 
SET role = 'admin', is_course_maker = true 
WHERE email = 'user@example.com';
\`\`\`

**Make someone a Course Creator (can create but needs approval):**
\`\`\`sql
UPDATE public.profiles 
SET role = 'course_maker', is_course_maker = true 
WHERE email = 'user@example.com';
\`\`\`

**Remove course maker permissions:**
\`\`\`sql
UPDATE public.profiles 
SET is_course_maker = false 
WHERE email = 'user@example.com';
\`\`\`

**Find your own user ID:**
\`\`\`sql
SELECT id, email, role, is_course_maker 
FROM public.profiles 
WHERE email = 'your-email@example.com';
\`\`\`

4. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

### Step 4: Verify the Change

#### Method 1: Check in Table Editor
1. Go back to Table Editor → `profiles`
2. Find the user and verify the `role` and `is_course_maker` values

#### Method 2: Check in Your App
1. Log out of your application
2. Log back in
3. Go to **Settings** page - you should see your new role displayed under "Account Type"
4. If you're an administrator, you should see an "Admin Panel" link in the creator dashboard

## Role Hierarchy & Permissions

| Role | Creator Dashboard | Create Lessons | Manage Users | Approve Courses |
|------|------------------|----------------|--------------|-----------------|
| **administrator** | ✅ Full Access | ✅ Yes | ✅ Yes | ✅ Yes |
| **admin** | ✅ Full Access | ✅ Yes | ✅ Yes | ✅ Yes |
| **course_maker** (with is_course_maker=true) | ✅ View Only | ❌ Request Only | ❌ No | ❌ No |
| **instructor** | ✅ Limited | ✅ Yes | ❌ No | ❌ No |
| **student** | ❌ No Access | ❌ No | ❌ No | ❌ No |

## Common Tasks

### Make Yourself an Administrator (First Time Setup)
\`\`\`sql
-- Replace with your actual email address
UPDATE public.profiles 
SET role = 'administrator', is_course_maker = true 
WHERE email = 'your-email@example.com';
\`\`\`

### Promote a Course Creator to Full Admin
\`\`\`sql
UPDATE public.profiles 
SET role = 'administrator' 
WHERE email = 'creator@example.com';
\`\`\`

### Grant Course Creation Request Access
\`\`\`sql
UPDATE public.profiles 
SET is_course_maker = true 
WHERE email = 'user@example.com';
-- They can now access /creator but must request course approval
\`\`\`

### Batch Update Multiple Users
\`\`\`sql
UPDATE public.profiles 
SET is_course_maker = true 
WHERE email IN (
  'user1@example.com',
  'user2@example.com',
  'user3@example.com'
);
\`\`\`

### View All Administrators
\`\`\`sql
SELECT id, email, full_name, role, is_course_maker, created_at
FROM public.profiles
WHERE role IN ('administrator', 'admin')
ORDER BY created_at DESC;
\`\`\`

### View All Course Makers
\`\`\`sql
SELECT id, email, full_name, role, is_course_maker, created_at
FROM public.profiles
WHERE is_course_maker = true
ORDER BY created_at DESC;
\`\`\`

## Troubleshooting

### "I changed my role but still can't access /creator"
1. **Log out completely** from your app
2. **Clear browser cache** (or open incognito/private window)
3. **Log back in** - the middleware checks roles on each request
4. Verify in Settings that your role shows correctly

### "The role dropdown doesn't show 'administrator'"
1. You need to run the SQL script `023_add_administrator_role.sql` first
2. Go to SQL Editor and run:
\`\`\`sql
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'mentor', 'business_owner', 'course_maker', 'instructor', 'admin', 'administrator'));
\`\`\`

### "Changes aren't saving"
- Check Row Level Security (RLS) policies
- Make sure you're logged into Supabase as the project owner
- Try using SQL Editor instead of Table Editor

### "How do I find a user's email?"
\`\`\`sql
SELECT id, email, full_name, role 
FROM public.profiles 
WHERE full_name ILIKE '%search name%'
ORDER BY created_at DESC;
\`\`\`

## Security Best Practices

1. **Limit Administrator Access**: Only give administrator role to trusted team members
2. **Regular Audits**: Periodically review who has elevated permissions
3. **Use is_course_maker Flag**: For users who only need to create courses, don't give them admin roles
4. **Monitor Changes**: Check the `updated_at` column to see when roles were last modified

## Need Help?

If you're still having issues:
1. Check your app's Settings page to see your current role
2. Verify the SQL scripts have been run in order
3. Check browser console for any error messages
4. Make sure you're logged in as the correct user in both Supabase and your app
\`\`\`

```typescriptreact file="" isHidden
