-- Add category, difficulty, and duration columns to courses if needed for direct column access
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS difficulty text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration text;
