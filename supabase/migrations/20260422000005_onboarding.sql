-- Migration: Onboarding
-- Stores quiz responses collected during student/mentor onboarding, and mentor-student matches

CREATE TABLE IF NOT EXISTS student_quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  college text,
  branch text,
  mother_tongue text,
  inspiration_source text,
  admired_personality text,
  curiosity_answer text,
  exploration_frequency text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE student_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own quiz responses" ON student_quiz_responses
  USING (student_id = auth.uid()::text) WITH CHECK (student_id = auth.uid()::text);

CREATE POLICY "Admins can read all quiz responses" ON student_quiz_responses
  FOR SELECT USING (true);


CREATE TABLE IF NOT EXISTS mentor_quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_company text,
  college text,
  branch text,
  mother_tongue text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE mentor_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can manage own quiz responses" ON mentor_quiz_responses
  USING (mentor_id = auth.uid()::text) WITH CHECK (mentor_id = auth.uid()::text);

CREATE POLICY "Admins can read all mentor quiz responses" ON mentor_quiz_responses
  FOR SELECT USING (true);


CREATE TABLE IF NOT EXISTS mentor_student_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_percentage integer CHECK (match_percentage >= 0 AND match_percentage <= 100),
  tags jsonb DEFAULT '[]'::jsonb,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (mentor_id, student_id)
);

ALTER TABLE mentor_student_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches" ON mentor_student_matches
  FOR SELECT USING (
    mentor_id = auth.uid()::text OR student_id = auth.uid()::text
  );

CREATE POLICY "Admins can manage all matches" ON mentor_student_matches
  USING (true) WITH CHECK (true);
