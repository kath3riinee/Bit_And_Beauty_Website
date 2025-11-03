-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "messages_select_participant"
  on public.messages for select
  using (conversation_id in (
    select conversation_id from conversation_participants where user_id = auth.uid()
  ));

create policy "messages_insert_participant"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and conversation_id in (
      select conversation_id from conversation_participants where user_id = auth.uid()
    )
  );

-- Create index for better performance
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_created_at_idx on public.messages(created_at desc);
