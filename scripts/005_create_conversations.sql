-- Create conversations table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.conversations enable row level security;

-- Create conversation participants table
create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  unique(conversation_id, user_id)
);

-- Enable RLS
alter table public.conversation_participants enable row level security;

-- Policies for conversations
create policy "conversations_select_participant"
  on public.conversations for select
  using (id in (select conversation_id from conversation_participants where user_id = auth.uid()));

create policy "conversations_insert_any"
  on public.conversations for insert
  with check (true);

-- Policies for participants
create policy "participants_select_own"
  on public.conversation_participants for select
  using (conversation_id in (select conversation_id from conversation_participants where user_id = auth.uid()));

create policy "participants_insert_any"
  on public.conversation_participants for insert
  with check (true);
