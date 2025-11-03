-- Create course lessons table
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text not null, -- Markdown content
  order_index integer not null,
  duration text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.course_lessons enable row level security;

-- Policies
create policy "lessons_select_published_course"
  on public.course_lessons for select
  using (
    course_id in (select id from courses where is_published = true)
    or course_id in (select id from courses where author_id = auth.uid())
  );

create policy "lessons_insert_own_course"
  on public.course_lessons for insert
  with check (course_id in (select id from courses where author_id = auth.uid()));

create policy "lessons_update_own_course"
  on public.course_lessons for update
  using (course_id in (select id from courses where author_id = auth.uid()));

create policy "lessons_delete_own_course"
  on public.course_lessons for delete
  using (course_id in (select id from courses where author_id = auth.uid()));
