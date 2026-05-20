const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vhrmcfwlkjgepdcyhmnw.supabase.co', 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe');

async function seedCourses() {
  const vlsiCourse = {
    id: 'course-vlsi-1',
    title: 'VLSI Design',
    description: 'Learn VLSI chip design from RTL to GDSII.',
    content: [
      { id: 'm1', title: 'Introduction', description: 'Basics of VLSI', lessons: [] }
    ],
    is_active: true
  };

  const { data, error } = await supabase.from('courses').upsert([vlsiCourse]).select();
  console.log("Seeded Course:", data, "Error:", error);
}

seedCourses();
