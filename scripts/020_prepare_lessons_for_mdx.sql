-- Ensure course_lessons table supports MDX content
-- Add slug column for lesson URLs if not exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'course_lessons' and column_name = 'slug') then
    alter table public.course_lessons add column slug text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'course_lessons' and column_name = 'status') then
    alter table public.course_lessons add column status text default 'draft' check (status in ('draft', 'published'));
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'course_lessons' and column_name = 'created_by') then
    alter table public.course_lessons add column created_by uuid references auth.users(id);
  end if;
end $$;

-- Update existing lessons to set created_by from course author
update public.course_lessons cl
set created_by = c.author_id
from public.courses c
where cl.course_id = c.id and cl.created_by is null;

-- Add index for better query performance
create index if not exists idx_course_lessons_created_by on public.course_lessons(created_by);
create index if not exists idx_course_lessons_status on public.course_lessons(status);

-- Update RLS policies to allow creators/admins to manage all lessons
drop policy if exists "lessons_insert_own_course" on public.course_lessons;
drop policy if exists "lessons_update_own_course" on public.course_lessons;
drop policy if exists "lessons_delete_own_course" on public.course_lessons;

create policy "lessons_insert_creator"
  on public.course_lessons for insert
  with check (
    auth.uid() = created_by 
    and auth.uid() in (
      select id from public.profiles 
      where role in ('instructor', 'admin', 'course_maker') 
      or is_course_maker = true
    )
  );

create policy "lessons_update_creator"
  on public.course_lessons for update
  using (
    auth.uid() = created_by
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "lessons_delete_creator"
  on public.course_lessons for delete
  using (
    auth.uid() = created_by
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );
