-- Create user_settings table to store user preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notification preferences
  notifications_course_updates boolean DEFAULT true,
  notifications_community boolean DEFAULT true,
  notifications_achievements boolean DEFAULT true,
  notifications_newsletter boolean DEFAULT false,
  notifications_marketing boolean DEFAULT false,
  
  -- Security preferences
  security_two_factor_enabled boolean DEFAULT false,
  
  -- Appearance preferences
  appearance_theme text DEFAULT 'light' CHECK (appearance_theme IN ('light', 'dark', 'auto')),
  appearance_compact_mode boolean DEFAULT false,
  appearance_animations boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own settings
CREATE POLICY user_settings_select_own ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY user_settings_insert_own ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY user_settings_update_own ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own settings
CREATE POLICY user_settings_delete_own ON user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
