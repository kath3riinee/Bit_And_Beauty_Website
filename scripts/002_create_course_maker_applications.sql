-- Create course maker applications table
create table if not exists public.course_maker_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  expertise text not null,
  experience text not null,
  sample_content text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.course_maker_applications enable row level security;

-- Policies
create policy "applications_select_own"
  on public.course_maker_applications for select
  using (auth.uid() = user_id or auth.uid() in (select id from profiles where role = 'admin'));

create policy "applications_insert_own"
  on public.course_maker_applications for insert
  with check (auth.uid() = user_id);

create policy "applications_update_admin"
  on public.course_maker_applications for update
  using (auth.uid() in (select id from profiles where role = 'admin'));
