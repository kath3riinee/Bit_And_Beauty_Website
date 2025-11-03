-- COMPLETE FIX for infinite recursion in conversation_participants RLS
-- This script removes ALL problematic policies and creates simple, non-recursive ones

-- Drop ALL existing policies on conversation_participants
DROP POLICY IF EXISTS "participants_select_own" ON public.conversation_participants;
DROP POLICY IF EXISTS "participants_select_direct" ON public.conversation_participants;
DROP POLICY IF EXISTS "participants_insert_any" ON public.conversation_participants;

-- Drop ALL existing policies on conversations
DROP POLICY IF EXISTS "conversations_select_participant" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert_any" ON public.conversations;

-- Create simple, non-recursive policies for conversation_participants
-- Users can only see their own participant records (no subquery needed)
CREATE POLICY "participants_select_own_only"
  ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid());

-- Anyone can insert participant records (we'll handle validation in app logic)
CREATE POLICY "participants_insert_authenticated"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own participant records
CREATE POLICY "participants_update_own"
  ON public.conversation_participants FOR UPDATE
  USING (user_id = auth.uid());

-- Create simple policies for conversations
-- Users can see conversations where they are a participant
-- We use a function to avoid recursion
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = conversation_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "conversations_select_if_participant"
  ON public.conversations FOR SELECT
  USING (public.is_conversation_participant(id));

-- Anyone authenticated can create conversations
CREATE POLICY "conversations_insert_authenticated"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update conversations they're part of
CREATE POLICY "conversations_update_if_participant"
  ON public.conversations FOR UPDATE
  USING (public.is_conversation_participant(id));
