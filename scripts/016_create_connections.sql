-- Create connections table for friend/connection system
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(requester_id, recipient_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_recipient ON public.connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own connections (sent or received)
CREATE POLICY connections_select_own ON public.connections
  FOR SELECT
  USING (
    auth.uid() = requester_id OR 
    auth.uid() = recipient_id
  );

-- Policy: Users can insert connection requests
CREATE POLICY connections_insert_own ON public.connections
  FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Policy: Users can update connections they're involved in (for accepting/rejecting)
CREATE POLICY connections_update_involved ON public.connections
  FOR UPDATE
  USING (
    auth.uid() = requester_id OR 
    auth.uid() = recipient_id
  );

-- Policy: Users can delete their own sent requests
CREATE POLICY connections_delete_own ON public.connections
  FOR DELETE
  USING (auth.uid() = requester_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER connections_updated_at
  BEFORE UPDATE ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION update_connections_updated_at();
