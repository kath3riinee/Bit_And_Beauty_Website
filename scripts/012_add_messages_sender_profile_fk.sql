-- Add foreign key constraint from messages.sender_id to profiles.id
-- This allows Supabase to automatically join messages with profiles
-- Note: sender_id already references auth.users(id), and profiles.id also references auth.users(id)
-- So this creates a relationship path: messages.sender_id -> profiles.id -> auth.users(id)

-- First, drop the existing foreign key to auth.users if it exists
alter table public.messages 
  drop constraint if exists messages_sender_id_fkey;

-- Add the new foreign key to profiles instead
alter table public.messages
  add constraint messages_sender_id_fkey 
  foreign key (sender_id) 
  references public.profiles(id) 
  on delete cascade;

-- Refresh the schema cache
notify pgrst, 'reload schema';
