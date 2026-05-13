const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function inspect() {
  // Query information_schema to see which tables exist in 'public' schema
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log('Profiles table exists:', !error);
  if (error) console.error('Profiles error:', error);

  // We can query custom tables too or retrieve list of schemas
  const tables = [
    'users', 'onboarding_answers', 'games', 'quiz_results', 'inspirations', 'inspiration_reads',
    'courses', 'modules', 'lessons', 'enrollments', 'lesson_progress', 'circles', 'circle_members',
    'sessions', 'review_queue'
  ];

  for (const table of tables) {
    const { error: tblError } = await supabase.from(table).select('*').limit(1);
    console.log(`Table '${table}' exists:`, !tblError, tblError ? `(Error: ${tblError.message})` : '');
  }
}

inspect();
