-- Create courses table
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration text,
  thumbnail_url text,
  is_published boolean default false,
  enrollments_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.courses enable row level security;

-- Policies
create policy "courses_select_published"
  on public.courses for select
  using (is_published = true or auth.uid() = author_id);

create policy "courses_insert_course_maker"
  on public.courses for insert
  with check (auth.uid() = author_id and auth.uid() in (select id from profiles where is_course_maker = true));

create policy "courses_update_own"
  on public.courses for update
  using (auth.uid() = author_id);

create policy "courses_delete_own"
  on public.courses for delete
  using (auth.uid() = author_id);
