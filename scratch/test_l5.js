const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Replicate l5 from components/mentor/MentorCourses.tsx
function l5(c) {
  let parsedCourse = { ...c };
  try {
    if (c.description && c.description.trim().startsWith('{')) {
      const parsed = JSON.parse(c.description);
      if (parsed && typeof parsed === 'object') {
        parsedCourse = {
          ...c,
          description: parsed.description || "",
          difficulty: parsed.difficulty || "Beginner",
          duration: parsed.duration || "10 hours",
          category: parsed.category || "General",
          modules: parsed.modules || parsed.content || [],
          content: parsed.modules || parsed.content || []
        };
      }
    }
  } catch (e) {
    console.error("l5 catch description parse error:", e);
  }

  const finalSource = parsedCourse;

  return {
    id: finalSource.id,
    title: finalSource.title,
    description: finalSource.description || "",
    category: finalSource.category || "General",
    difficulty: finalSource.difficulty || "Beginner",
    duration: finalSource.duration || "10 hours",
    enrolled: finalSource.enrolled ?? false,
    progress: finalSource.progress || 0,
    modules: (finalSource.modules || finalSource.content || []).map((m) => {
      const dbLessons = m.lessons || (m.topics || []).map((topicName, tIdx) => ({
        id: `${m.id || 'm'}-l-${tIdx}`,
        title: topicName,
        duration: "10 min",
        type: "video",
        enabled: true
      }));

      return {
        id: m.id || `m-${Date.now()}-${Math.random()}`,
        title: m.title || "Untitled Module",
        description: m.description || "",
        color: m.color || "bg-emerald-500",
        enabled: m.enabled ?? true,
        lessons: dbLessons.map((l) => ({
          id: l.id || `l-${Date.now()}-${Math.random()}`,
          title: l.title || "Untitled Lesson",
          duration: l.duration || "10 min",
          type: l.type || "video",
          enabled: l.enabled ?? true
        }))
      };
    })
  };
}

async function testParsing() {
  console.log('Fetching course from DB...');
  const { data, error } = await supabase.from('courses').select('*');
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  console.log('Successfully fetched courses:', data.length);
  try {
    for (const c of data) {
      console.log('Mapping course:', c.id, c.title);
      const mapped = l5(c);
      console.log('Successfully mapped course!', mapped.title);
    }
  } catch (e) {
    console.error('TypeError or mapping exception during l5:', e);
  }
}

testParsing();
