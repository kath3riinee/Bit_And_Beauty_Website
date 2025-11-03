-- Seed sample profiles for testing
-- Note: These will be linked to actual user accounts when users sign up

-- Insert sample profiles (these IDs should match real user IDs after signup)
-- For testing, you can manually update these with your actual user IDs after creating accounts

-- Sample conversation for testing
-- First, you need to create two user accounts via signup
-- Then update the user_id values below with your actual user IDs from auth.users

-- Example: After creating two test accounts, run this to create a test conversation:
-- 
-- INSERT INTO conversations (id) VALUES (gen_random_uuid()) RETURNING id;
-- 
-- Then add participants (replace with your actual user IDs):
-- INSERT INTO conversation_participants (conversation_id, user_id) VALUES 
--   ('conversation-id-here', 'user-1-id-here'),
--   ('conversation-id-here', 'user-2-id-here');
--
-- Add a test message:
-- INSERT INTO messages (conversation_id, sender_id, content) VALUES
--   ('conversation-id-here', 'user-1-id-here', 'Hello! This is a test message.');

-- This script is a template. After creating user accounts via the signup page,
-- you can use the SQL editor to insert test data with your actual user IDs.
