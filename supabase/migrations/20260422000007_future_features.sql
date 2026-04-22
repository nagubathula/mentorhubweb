-- Migration: Future Feature Tables
-- Skeleton tables for admin sections currently marked "Coming Soon"

CREATE TABLE IF NOT EXISTS circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  mentor_id text REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read on circles" ON circles FOR SELECT USING (true);
CREATE POLICY "Admin write on circles" ON circles FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  mentor_id text REFERENCES profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read on courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Admin write on courses" ON courses FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Dropped'))
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT
  USING (student_id = auth.uid()::text);
CREATE POLICY "Admin manage enrollments" ON enrollments FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text REFERENCES profiles(id) ON DELETE SET NULL,
  student_id text REFERENCES profiles(id) ON DELETE SET NULL,
  title text,
  scheduled_at timestamp with time zone,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT
  USING (mentor_id = auth.uid()::text OR student_id = auth.uid()::text);
CREATE POLICY "Admin manage sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id text REFERENCES profiles(id) ON DELETE SET NULL,
  reviewee_id text REFERENCES profiles(id) ON DELETE SET NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT
  USING (reviewer_id = auth.uid()::text OR reviewee_id = auth.uid()::text);
CREATE POLICY "Admin manage reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES profiles(id) ON DELETE CASCADE,
  event_name text,
  event_date timestamp with time zone,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own registrations" ON registrations FOR SELECT
  USING (user_id = auth.uid()::text);
CREATE POLICY "Admin manage registrations" ON registrations FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  questions jsonb DEFAULT '[]'::jsonb,
  target_role text CHECK (target_role IN ('STUDENT', 'MENTOR', 'ALL')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active questionnaires" ON questionnaires FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admin manage questionnaires" ON questionnaires FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS inspiration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  author text,
  media_url text,
  type text DEFAULT 'Quote' CHECK (type IN ('Quote', 'Story', 'Video', 'Article')),
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE inspiration ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published inspiration" ON inspiration FOR SELECT
  USING (is_published = true);
CREATE POLICY "Admin manage inspiration" ON inspiration FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS games_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text DEFAULT 'Quiz' CHECK (type IN ('Quiz', 'Game', 'Challenge')),
  questions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE games_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active games" ON games_quizzes FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admin manage games" ON games_quizzes FOR ALL USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES circles(id) ON DELETE SET NULL,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Completed')),
  mapped_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (mentor_id, student_id)
);

ALTER TABLE mapping ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own mappings" ON mapping FOR SELECT
  USING (mentor_id = auth.uid()::text OR student_id = auth.uid()::text);
CREATE POLICY "Admin manage mapping" ON mapping FOR ALL USING (true) WITH CHECK (true);
