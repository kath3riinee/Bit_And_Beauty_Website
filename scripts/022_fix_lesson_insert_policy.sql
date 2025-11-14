-- Fix the lesson insert policy to allow creators/admins to create lessons
-- even without a course_id (standalone lessons)

drop policy if exists "lessons_insert_creator" on public.course_lessons;

-- Allow creators and admins to insert lessons
-- Course can be null for standalone lessons, or must be owned by the creator
create policy "lessons_insert_creator"
  on public.course_lessons for insert
  with check (
    -- User must be authenticated
    auth.uid() = created_by 
    -- User must be a creator, admin, or course maker
    and auth.uid() in (
      select id from public.profiles 
      where role in ('instructor', 'admin', 'course_maker') 
      or is_course_maker = true
    )
    -- If course_id is provided, it must be owned by the user or they must be admin
    and (
      course_id is null 
      or course_id in (select id from public.courses where author_id = auth.uid())
      or auth.uid() in (select id from public.profiles where role = 'admin')
    )
  );

-- Also allow course_id to be nullable
alter table public.course_lessons alter column course_id drop not null;
