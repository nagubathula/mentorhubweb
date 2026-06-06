-- ==============================================================================
-- Supabase Consolidation Script: Create All 14 Missing Tables
-- Execute this in your Supabase project SQL Editor to enable all features.
-- ==============================================================================

-- 1. feature_flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'student' or 'mentor'
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. platform_feedback
CREATE TABLE IF NOT EXISTS public.platform_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    user_email TEXT,
    user_role TEXT, -- 'student' | 'mentor' | 'admin'
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. student_notes
CREATE TABLE IF NOT EXISTS public.student_notes (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT,
    title TEXT,
    content TEXT,
    timestamp BIGINT
);

-- 4. custom_todos
CREATE TABLE IF NOT EXISTS public.custom_todos (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    notes TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. onboarding_answers
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. games
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    coins_earned INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. quiz_results
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id TEXT,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    coins_earned INTEGER DEFAULT 0,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. inspirations
CREATE TABLE IF NOT EXISTS public.inspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('morning', 'evening')),
    content TEXT NOT NULL,
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. inspiration_reads
CREATE TABLE IF NOT EXISTS public.inspiration_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.inspirations(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    saved BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_inspiration_read UNIQUE (post_id, student_id)
);

-- 10. modules
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- 11. lessons
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT,
    type TEXT CHECK (type IN ('video', 'quiz', 'exercise')),
    order_index INTEGER DEFAULT 0
);

-- 12. lesson_progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_lesson_enrollment UNIQUE (enrollment_id, lesson_id)
);

-- 13. circle_members
CREATE TABLE IF NOT EXISTS public.circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_circle_member UNIQUE (circle_id, student_id)
);

-- 14. review_queue
CREATE TABLE IF NOT EXISTS public.review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'done')) DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;

-- Allow public read/write policies for rapid prototype deployment
CREATE POLICY "Public actions feature_flags" ON public.feature_flags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions platform_feedback" ON public.platform_feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions student_notes" ON public.student_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions custom_todos" ON public.custom_todos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions onboarding_answers" ON public.onboarding_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions games" ON public.games FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions quiz_results" ON public.quiz_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions inspirations" ON public.inspirations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions inspiration_reads" ON public.inspiration_reads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions modules" ON public.modules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions lesson_progress" ON public.lesson_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions circle_members" ON public.circle_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public actions review_queue" ON public.review_queue FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- SEED DATA: feature_flags
-- ==========================================

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
