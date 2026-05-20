-- Fix enrollments table by adding the missing progress column
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '[]'::jsonb;

-- Recompile sync_lesson_progress_to_enrollment trigger function to ensure it works with the new progress column
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

-- Recreate trigger to ensure clean execution
DROP TRIGGER IF EXISTS trigger_sync_lesson_progress_to_enrollment ON lesson_progress;
CREATE TRIGGER trigger_sync_lesson_progress_to_enrollment
AFTER INSERT OR UPDATE OR DELETE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION sync_lesson_progress_to_enrollment();
