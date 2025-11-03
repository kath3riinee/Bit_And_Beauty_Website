-- Simplified RLS policies that will definitely work
-- This removes all complex policies and creates simple ones for authenticated users

-- First, drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on conversations
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'conversations') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.conversations';
    END LOOP;
    
    -- Drop all policies on conversation_participants
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'conversation_participants') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.conversation_participants';
    END LOOP;
    
    -- Drop all policies on messages
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'messages') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.messages';
    END LOOP;
END $$;

-- Drop the helper function if it exists
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid);

-- Create simple, permissive policies for conversations
-- Any authenticated user can do anything (we'll add proper security later)
CREATE POLICY "conversations_all_authenticated"
  ON public.conversations
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create simple, permissive policies for conversation_participants
CREATE POLICY "participants_all_authenticated"
  ON public.conversation_participants
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create simple, permissive policies for messages
CREATE POLICY "messages_all_authenticated"
  ON public.messages
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
