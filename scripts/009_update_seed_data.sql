-- Update seed data to include proper roles and create demo conversations

-- First, let's make sure we have some profiles with instructor role
-- This assumes you'll create users through the signup flow first

-- Update Alice to be an instructor (you'll need to replace the UUID with actual user ID)
-- UPDATE profiles SET role = 'instructor' WHERE full_name = 'Alice Designer';

-- Create a helper function to set up demo data after users are created
CREATE OR REPLACE FUNCTION setup_demo_chat(user1_id uuid, user2_id uuid)
RETURNS void AS $$
DECLARE
  conv_id uuid;
BEGIN
  -- Create conversation
  INSERT INTO conversations DEFAULT VALUES
  RETURNING id INTO conv_id;
  
  -- Add participants
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (conv_id, user1_id), (conv_id, user2_id);
  
  -- Add demo messages
  INSERT INTO messages (conversation_id, sender_id, content)
  VALUES 
    (conv_id, user1_id, 'Hi! I''m excited to learn about fashion tech!'),
    (conv_id, user2_id, 'Welcome! I''m here to help with the technical side of things.');
END;
$$ LANGUAGE plpgsql;

-- Note: To use this function, call it with actual user IDs:
-- SELECT setup_demo_chat('user1-uuid-here', 'user2-uuid-here');
