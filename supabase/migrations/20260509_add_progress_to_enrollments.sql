-- Add progress column to enrollments table
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '[]'::jsonb;
