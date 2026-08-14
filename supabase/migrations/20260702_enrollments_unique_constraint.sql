-- Migration: Add unique constraint on (student_id, course_id) in enrollments table
-- Prevents duplicate enrollment records at database schema level

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_student_course'
    ) THEN
        ALTER TABLE enrollments 
        ADD CONSTRAINT unique_student_course UNIQUE (student_id, course_id);
    END IF;
END $$;
