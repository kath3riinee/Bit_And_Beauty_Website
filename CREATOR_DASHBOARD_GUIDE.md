# Creator Dashboard Guide

## How to Access the Creator Dashboard

### Step 1: Assign Admin or Creator Role

You need to update your user role in the Supabase database:

1. **Go to your Supabase project dashboard**
   - Navigate to https://supabase.com
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the role assignment query**
   \`\`\`sql
   -- Replace 'your-email@example.com' with your actual email address
   UPDATE public.profiles
   SET 
     role = 'admin',
     is_course_maker = true,
     updated_at = now()
   WHERE email = 'your-email@example.com';
   \`\`\`

4. **Verify the update**
   \`\`\`sql
   SELECT id, email, full_name, role, is_course_maker
   FROM public.profiles
   WHERE email = 'your-email@example.com';
   \`\`\`

   You should see your role as `admin` or `course_maker`.

5. **Log out and log back in**
   - Log out of your account on the website
   - Log back in to refresh your session

### Step 2: Access the Creator Dashboard

Once your role is updated:

1. **Navigate to the Creator Dashboard**
   - Visit `/creator` on your website
   - Or click "Creator Dashboard" in the header navigation (visible for creators/admins)

2. **You'll see the dashboard with:**
   - Overview statistics (lessons, courses, views)
   - Quick actions to create new lessons
   - Navigation to manage lessons and courses

### Step 3: Create Your First MDX Lesson

1. **Go to Lessons Management**
   - Click "Manage Lessons" or navigate to `/creator/lessons`

2. **Create a New Lesson**
   - Click "Create New Lesson"
   - Fill in the lesson details:
     - **Title**: The lesson name (e.g., "Introduction to Fashion Design")
     - **Slug**: URL-friendly identifier (e.g., "intro-fashion-design")
     - **Course**: Select which course this lesson belongs to
     - **Order**: Lesson sequence number (1, 2, 3, etc.)
     - **Duration**: Estimated time (e.g., "15 minutes")
     - **Status**: Choose "draft" (private) or "published" (public)

3. **Write MDX Content**
   The MDX editor supports rich formatting:
   
   \`\`\`mdx
   # Lesson Title
   
   This is a paragraph with **bold** and *italic* text.
   
   ## Section Heading
   
   - Bullet point 1
   - Bullet point 2
   
   ### Code Example
   
   \`\`\`javascript
   const greeting = "Hello, Fashion World!";
   console.log(greeting);
   \`\`\`
   
   > 💡 **Pro Tip**: Use MDX to add interactive components!
   \`\`\`

4. **Preview and Save**
   - The right panel shows a live preview of your MDX
   - Click "Save Lesson" to create the lesson
   - You'll be redirected to the lessons list

### Step 4: Edit Existing Lessons

1. **From the Lessons List**
   - Navigate to `/creator/lessons`
   - Find the lesson you want to edit
   - Click the "Edit" button (pencil icon)

2. **Make Your Changes**
   - Update any field (title, content, status, etc.)
   - Preview changes in real-time
   - Click "Update Lesson" to save

3. **Delete a Lesson**
   - Click the "Delete" button (trash icon)
   - Confirm the deletion

### Step 5: Manage Lesson Status

- **Draft**: Only visible to creators/admins
- **Published**: Visible to all users who can access the course

To publish a lesson:
1. Edit the lesson
2. Change status from "draft" to "published"
3. Save the lesson

## Roles Explained

- **admin**: Full access to everything (create, edit, delete all content)
- **course_maker**: Can create and manage their own courses and lessons
- **student**: Default role, can view published content only

## Tips for Creating Great Lessons

1. **Use Clear Structure**: Start with headers (##, ###) to organize content
2. **Add Visuals**: Use images and videos to illustrate concepts
3. **Include Examples**: Code blocks and practical examples help learning
4. **Keep it Focused**: One main concept per lesson works best
5. **Preview Often**: Check the preview panel to see how students will see it

## Troubleshooting

**Can't see Creator Dashboard link?**
- Verify your role is set correctly in the database
- Log out and log back in to refresh your session

**Changes not appearing?**
- Make sure you clicked "Save" or "Update"
- Check that the lesson status is "published" if you want others to see it

**Permission errors?**
- Ensure your role is 'admin' or 'course_maker'
- Check that the `is_course_maker` field is set to `true`
