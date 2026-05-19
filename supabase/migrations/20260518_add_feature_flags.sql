CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'student' or 'mentor'
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: Enable RLS, but allow public read/write if the rest of your app does
-- ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all actions" ON public.feature_flags FOR ALL USING (true);

INSERT INTO public.feature_flags (key, title, category, is_enabled) VALUES
('student_dashboard', 'Home / Dashboard', 'student', true),
('student_courses', 'Learning Paths / Courses', 'student', true),
('student_games', 'Games & Quizzes', 'student', true),
('student_portfolio', 'My Portfolio', 'student', true),
('student_wellness', 'Mental Wellness Tracker', 'student', true),
('student_messages', 'Messages & Chat', 'student', true),
('student_gratitude', 'Gratitude Wall', 'student', true),
('student_notes', 'Personal Notes', 'student', true),
('student_facts', 'Daily Facts', 'student', true),
('student_game_snakes', 'Snake & Ladder Quiz', 'student', true),
('student_game_ludo', 'Ludo Quiz', 'student', true),
('student_game_kbc', 'KBC Tech Edition', 'student', true),

('mentor_dashboard', 'Home / Dashboard', 'mentor', true),
('mentor_students', 'My Students', 'mentor', true),
('mentor_courses', 'Course Architect', 'mentor', true),
('mentor_sessions', 'Sessions & Notes', 'mentor', true),
('mentor_circle', 'Mentor Circle', 'mentor', true),
('mentor_messages', 'Messages & Chat', 'mentor', true),
('mentor_account', 'Mentor Profile', 'mentor', true),
('mentor_gratitude', 'Gratitude Wall', 'mentor', true),
('mentor_inspiration', 'Morning Thought Widget', 'mentor', true)
ON CONFLICT (key) DO NOTHING;
