const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const supabaseKey = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Querying student_quiz_responses...");
  const { data: students, error: studentErr } = await supabase.from('student_quiz_responses').select('*').limit(5);
  if (studentErr) {
    console.error("Student error:", studentErr);
  } else {
    console.log("Student quiz responses:", students);
  }

  console.log("Querying mentor_quiz_responses...");
  const { data: mentors, error: mentorErr } = await supabase.from('mentor_quiz_responses').select('*').limit(5);
  if (mentorErr) {
    console.error("Mentor error:", mentorErr);
  } else {
    console.log("Mentor quiz responses:", mentors);
  }
}

test();
