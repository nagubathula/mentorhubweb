-- Add content column to courses to store lessons/activities
ALTER TABLE courses ADD COLUMN IF NOT EXISTS content jsonb DEFAULT '[]'::jsonb;

-- Add progress column to enrollments to store completed activities
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress jsonb DEFAULT '[]'::jsonb;

-- Ensure courses can be assigned to mentors
-- (The mentor_id column already exists based on database.types.ts)
