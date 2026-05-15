-- Supabase Migration: Schema Normalization & Adaptation
-- Created on: 2026-05-13
-- Focus: transition from JSON columns to fully normalized relationships while maintaining backward compatibility triggers.

-- ==========================================
-- 1. EXTEND EXISTING TABLES
-- ==========================================

-- Extend profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coins integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0;

-- Extend courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS total_modules integer DEFAULT 0;

-- Extend enrollments table
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress_pct integer DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS modules_completed integer DEFAULT 0;

-- Extend sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS topic text;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('1on1', 'group', 'review'));
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;

-- ==========================================
-- 2. CREATE NEW TABLES
-- ==========================================

-- onboarding_answers table
CREATE TABLE IF NOT EXISTS onboarding_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES profiles(id) ON DELETE CASCADE,
  game_type text NOT NULL,
  score integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  played_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES profiles(id) ON DELETE CASCADE,
  module_id text,
  score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  taken_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- inspirations table
CREATE TABLE IF NOT EXISTS inspirations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text REFERENCES profiles(id) ON DELETE CASCADE,
  type text CHECK (type IN ('morning', 'evening')),
  content text NOT NULL,
  sent boolean DEFAULT false,
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- inspiration_reads table
CREATE TABLE IF NOT EXISTS inspiration_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES inspirations(id) ON DELETE CASCADE,
  student_id text REFERENCES profiles(id) ON DELETE CASCADE,
  saved boolean DEFAULT false,
  read_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_inspiration_read UNIQUE (post_id, student_id)
);

-- modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_index integer DEFAULT 0
);

-- lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration text,
  type text CHECK (type IN ('video', 'quiz', 'exercise')),
  order_index integer DEFAULT 0
);

-- lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  status text CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completed_at timestamp with time zone,
  CONSTRAINT unique_lesson_enrollment UNIQUE (enrollment_id, lesson_id)
);

-- circle_members table
CREATE TABLE IF NOT EXISTS circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  student_id text REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_circle_member UNIQUE (circle_id, student_id)
);

-- review_queue table
CREATE TABLE IF NOT EXISTS review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id text REFERENCES profiles(id) ON DELETE CASCADE,
  student_id text REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  status text CHECK (status IN ('pending', 'done')) DEFAULT 'pending',
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;

-- Apply "Allow public inserts/selects/updates" policies for easy client operations in prototype phase
CREATE POLICY "Public select onboarding_answers" ON onboarding_answers FOR SELECT USING (true);
CREATE POLICY "Public insert onboarding_answers" ON onboarding_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update onboarding_answers" ON onboarding_answers FOR UPDATE USING (true);

CREATE POLICY "Public select games" ON games FOR SELECT USING (true);
CREATE POLICY "Public insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update games" ON games FOR UPDATE USING (true);

CREATE POLICY "Public select quiz_results" ON quiz_results FOR SELECT USING (true);
CREATE POLICY "Public insert quiz_results" ON quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update quiz_results" ON quiz_results FOR UPDATE USING (true);

CREATE POLICY "Public select inspirations" ON inspirations FOR SELECT USING (true);
CREATE POLICY "Public insert inspirations" ON inspirations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update inspirations" ON inspirations FOR UPDATE USING (true);

CREATE POLICY "Public select inspiration_reads" ON inspiration_reads FOR SELECT USING (true);
CREATE POLICY "Public insert inspiration_reads" ON inspiration_reads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update inspiration_reads" ON inspiration_reads FOR UPDATE USING (true);

CREATE POLICY "Public select modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Public insert modules" ON modules FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update modules" ON modules FOR UPDATE USING (true);
CREATE POLICY "Public delete modules" ON modules FOR DELETE USING (true);

CREATE POLICY "Public select lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Public insert lessons" ON lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update lessons" ON lessons FOR UPDATE USING (true);
CREATE POLICY "Public delete lessons" ON lessons FOR DELETE USING (true);

CREATE POLICY "Public select lesson_progress" ON lesson_progress FOR SELECT USING (true);
CREATE POLICY "Public insert lesson_progress" ON lesson_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update lesson_progress" ON lesson_progress FOR UPDATE USING (true);
CREATE POLICY "Public delete lesson_progress" ON lesson_progress FOR DELETE USING (true);

CREATE POLICY "Public select circle_members" ON circle_members FOR SELECT USING (true);
CREATE POLICY "Public insert circle_members" ON circle_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update circle_members" ON circle_members FOR UPDATE USING (true);
CREATE POLICY "Public delete circle_members" ON circle_members FOR DELETE USING (true);

CREATE POLICY "Public select review_queue" ON review_queue FOR SELECT USING (true);
CREATE POLICY "Public insert review_queue" ON review_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update review_queue" ON review_queue FOR UPDATE USING (true);
CREATE POLICY "Public delete review_queue" ON review_queue FOR DELETE USING (true);


-- ==========================================
-- 4. DB TRIGGERS (LEGACY SYNC LAYER)
-- ==========================================

-- Trigger to sync JSON 'content' column of courses into modules and lessons tables
CREATE OR REPLACE FUNCTION sync_course_normalized_tables()
RETURNS TRIGGER AS $$
DECLARE
  m_record jsonb;
  lesson_title text;
  m_id uuid;
  m_index integer := 0;
  l_index integer := 0;
BEGIN
  -- Clear existing modules and lessons for this course to write fresh
  DELETE FROM modules WHERE course_id = NEW.id;

  -- Exit if content is not valid
  IF NEW.content IS NULL OR jsonb_typeof(NEW.content) <> 'array' THEN
    RETURN NEW;
  END IF;

  -- Iterate through modules array
  FOR m_record IN SELECT * FROM jsonb_array_elements(NEW.content) LOOP
    INSERT INTO modules (course_id, title, order_index)
    VALUES (NEW.id, COALESCE(m_record->>'title', 'Untitled Module'), m_index)
    RETURNING id INTO m_id;

    m_index := m_index + 1;

    -- Process lessons if they exist in standard form
    IF m_record ? 'lessons' AND jsonb_typeof(m_record->'lessons') = 'array' THEN
      l_index := 0;
      FOR m_record IN SELECT * FROM jsonb_array_elements(m_record->'lessons') LOOP
        INSERT INTO lessons (module_id, title, duration, type, order_index)
        VALUES (
          m_id,
          COALESCE(m_record->>'title', 'Untitled Lesson'),
          COALESCE(m_record->>'duration', '15 mins'),
          COALESCE(m_record->>'type', 'video'),
          l_index
        );
        l_index := l_index + 1;
      END LOOP;
    -- Process topics array (legacy compatibility)
    ELSIF m_record ? 'topics' AND jsonb_typeof(m_record->'topics') = 'array' THEN
      l_index := 0;
      FOR lesson_title IN SELECT jsonb_array_elements_text(m_record->'topics') LOOP
        INSERT INTO lessons (module_id, title, duration, type, order_index)
        VALUES (
          m_id,
          lesson_title,
          '15 mins',
          'exercise',
          l_index
        );
        l_index := l_index + 1;
      END LOOP;
    END IF;
  END LOOP;

  NEW.total_modules := m_index;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_course_normalized_tables ON courses;
CREATE TRIGGER trigger_sync_course_normalized_tables
BEFORE INSERT OR UPDATE OF content ON courses
FOR EACH ROW
EXECUTE FUNCTION sync_course_normalized_tables();


-- Trigger to sync lesson completions in lesson_progress back to enrollments.progress JSON array
-- and compute progress_pct and modules_completed
CREATE OR REPLACE FUNCTION sync_lesson_progress_to_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  v_progress jsonb;
  v_lesson_id text;
  v_total_lessons integer;
  v_completed_lessons integer;
  v_progress_pct integer := 0;
  v_course_id uuid;
  v_completed_modules_count integer := 0;
  v_module_id uuid;
  v_module_all_completed boolean;
  v_lesson_record record;
BEGIN
  -- Fetch current progress state from the target enrollment
  SELECT progress, course_id INTO v_progress, v_course_id 
  FROM enrollments 
  WHERE id = COALESCE(NEW.enrollment_id, OLD.enrollment_id);
  
  IF v_progress IS NULL OR jsonb_typeof(v_progress) <> 'array' THEN
    v_progress := '[]'::jsonb;
  END IF;

  v_lesson_id := COALESCE(NEW.lesson_id::text, OLD.lesson_id::text);

  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status <> 'completed') THEN
    -- Ensure lesson is listed in the progress array
    IF NOT v_progress ? v_lesson_id THEN
      v_progress := v_progress || jsonb_build_array(v_lesson_id);
    END IF;
  ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status <> 'completed' AND OLD.status = 'completed') THEN
    -- Remove lesson from progress array
    SELECT jsonb_agg(elem) INTO v_progress
    FROM jsonb_array_elements(v_progress) elem
    WHERE elem::text <> ('"' || v_lesson_id || '"');
    
    IF v_progress IS NULL THEN
      v_progress := '[]'::jsonb;
    END IF;
  END IF;

  -- 1. Count total lessons inside the course
  SELECT count(*) INTO v_total_lessons 
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = v_course_id;

  -- 2. Count completed lessons inside lesson_progress
  SELECT count(*) INTO v_completed_lessons
  FROM lesson_progress
  WHERE enrollment_id = COALESCE(NEW.enrollment_id, OLD.enrollment_id) AND status = 'completed';

  IF v_total_lessons > 0 THEN
    v_progress_pct := round((v_completed_lessons::numeric / v_total_lessons::numeric) * 100);
  END IF;

  -- 3. Calculate modules completed
  FOR v_module_id IN SELECT id FROM modules WHERE course_id = v_course_id LOOP
    v_module_all_completed := true;
    
    -- Check if all lessons of this module are marked completed
    FOR v_lesson_record IN SELECT id FROM lessons WHERE module_id = v_module_id LOOP
      IF NOT EXISTS (
        SELECT 1 FROM lesson_progress 
        WHERE enrollment_id = COALESCE(NEW.enrollment_id, OLD.enrollment_id) 
        AND lesson_id = v_lesson_record.id 
        AND status = 'completed'
      ) THEN
        v_module_all_completed := false;
        EXIT;
      END IF;
    END LOOP;

    -- If module has no lessons, it's not completed
    IF NOT EXISTS (SELECT 1 FROM lessons WHERE module_id = v_module_id) THEN
      v_module_all_completed := false;
    END IF;

    IF v_module_all_completed THEN
      v_completed_modules_count := v_completed_modules_count + 1;
    END IF;
  END LOOP;

  -- Persist calculations back to enrollment record
  UPDATE enrollments
  SET 
    progress = v_progress,
    progress_pct = v_progress_pct,
    modules_completed = v_completed_modules_count
  WHERE id = COALESCE(NEW.enrollment_id, OLD.enrollment_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_lesson_progress_to_enrollment ON lesson_progress;
CREATE TRIGGER trigger_sync_lesson_progress_to_enrollment
AFTER INSERT OR UPDATE OR DELETE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION sync_lesson_progress_to_enrollment();


-- ==========================================
-- 5. ONE-TIME INITIAL CONVERSION SCRIPT
-- ==========================================

-- Populate modules & lessons from existing courses
DO $$
DECLARE
  v_course record;
  v_module jsonb;
  v_lesson jsonb;
  v_lesson_text text;
  v_module_id uuid;
  v_module_idx integer;
  v_lesson_idx integer;
BEGIN
  -- Disable trigger temporarily to prevent infinite loops / duplicates
  ALTER TABLE courses DISABLE TRIGGER trigger_sync_course_normalized_tables;
  
  -- Clear existing records to ensure clean slate
  DELETE FROM lessons;
  DELETE FROM modules;

  FOR v_course IN SELECT id, content FROM courses LOOP
    IF v_course.content IS NOT NULL AND jsonb_typeof(v_course.content) = 'array' THEN
      v_module_idx := 0;
      FOR v_module IN SELECT * FROM jsonb_array_elements(v_course.content) LOOP
        
        INSERT INTO modules (course_id, title, order_index)
        VALUES (v_course.id, COALESCE(v_module->>'title', 'Untitled Module'), v_module_idx)
        RETURNING id INTO v_module_id;

        v_module_idx := v_module_idx + 1;

        IF v_module ? 'lessons' AND jsonb_typeof(v_module->'lessons') = 'array' THEN
          v_lesson_idx := 0;
          FOR v_lesson IN SELECT * FROM jsonb_array_elements(v_module->'lessons') LOOP
            INSERT INTO lessons (module_id, title, duration, type, order_index)
            VALUES (
              v_module_id,
              COALESCE(v_lesson->>'title', 'Untitled Lesson'),
              COALESCE(v_lesson->>'duration', '15 mins'),
              COALESCE(v_lesson->>'type', 'video'),
              v_lesson_idx
            );
            v_lesson_idx := v_lesson_idx + 1;
          END LOOP;
        ELSIF v_module ? 'topics' AND jsonb_typeof(v_module->'topics') = 'array' THEN
          v_lesson_idx := 0;
          FOR v_lesson_text IN SELECT jsonb_array_elements_text(v_module->'topics') LOOP
            INSERT INTO lessons (module_id, title, duration, type, order_index)
            VALUES (
              v_module_id,
              v_lesson_text,
              '15 mins',
              'exercise',
              v_lesson_idx
            );
            v_lesson_idx := v_lesson_idx + 1;
          END LOOP;
        END IF;
      END LOOP;

      UPDATE courses SET total_modules = v_module_idx WHERE id = v_course.id;
    END IF;
  END FOR;

  -- Re-enable courses trigger
  ALTER TABLE courses ENABLE TRIGGER trigger_sync_course_normalized_tables;
END;
$$;


-- Reconstruct lesson_progress records from existing enrollments
DO $$
DECLARE
  v_enrollment record;
  v_lesson_id_text text;
  v_lesson_id uuid;
BEGIN
  -- Clear existing records
  DELETE FROM lesson_progress;

  FOR v_enrollment IN SELECT id, progress, course_id FROM enrollments LOOP
    IF v_enrollment.progress IS NOT NULL AND jsonb_typeof(v_enrollment.progress) = 'array' THEN
      FOR v_lesson_id_text IN SELECT jsonb_array_elements_text(v_enrollment.progress) LOOP
        BEGIN
          v_lesson_id := v_lesson_id_text::uuid;
          
          -- Check if lesson exists in the lessons table
          IF EXISTS (SELECT 1 FROM lessons WHERE id = v_lesson_id) THEN
            INSERT INTO lesson_progress (enrollment_id, lesson_id, status, completed_at)
            VALUES (v_enrollment.id, v_lesson_id, 'completed', now())
            ON CONFLICT DO NOTHING;
          END IF;
        EXCEPTION WHEN others THEN
          -- Catch casting exceptions and ignore non-UUID elements
        END;
      END LOOP;
    END IF;
  END FOR;
END;
$$;
