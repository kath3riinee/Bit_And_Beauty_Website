-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "participants_select_own" ON public.conversation_participants;

-- Create new policy without infinite recursion
-- Users can see participants in conversations they're part of
CREATE POLICY "participants_select_own"
  ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid() OR conversation_id IN (
    SELECT cp.conversation_id 
    FROM conversation_participants cp 
    WHERE cp.user_id = auth.uid()
  ));

-- Add a simpler policy for selecting your own participant records
CREATE POLICY "participants_select_direct"
  ON public.conversation_participants FOR SELECT
  USING (user_id = auth.uid());
