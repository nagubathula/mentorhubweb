const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function inspect() {
  const tables = [
    'profiles', 'courses', 'sessions', 'enrollments', 'reviews', 'messages', 'mapping',
    'circles', 'registrations', 'questionnaires', 'inspiration', 'gratitude_messages',
    'csr_sponsors', 'games_quizzes', 'student_quiz_responses', 'mentor_quiz_responses',
    'feature_flags', 'platform_feedback'
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    console.log(`Table '${table}' exists:`, !error, error ? `(Error: ${error.message})` : '');
  }
}

inspect();
