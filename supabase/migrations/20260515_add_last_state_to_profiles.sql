-- Add last_state to profiles for persistence
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_state text;
