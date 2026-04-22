-- Migration: Admin Settings
-- Per-admin configuration and notification preferences

CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id text NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text,
  email text,
  notify_student_messages boolean DEFAULT true,
  notify_review_submissions boolean DEFAULT true,
  notify_session_reminders boolean DEFAULT true,
  notify_weekly_digest boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage own settings" ON admin_settings
  USING (admin_id = auth.uid()::text) WITH CHECK (admin_id = auth.uid()::text);
