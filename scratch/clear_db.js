const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearDatabase() {
  console.log('--- Clearing Database User-Related Data ---');
  
  // Tables to clear in order of dependencies (foreign keys first)
  const tables = [
    'mapping',
    'enrollments',
    'reviews',
    'messages',
    'student_quiz_responses',
    'mentor_quiz_responses',
    'sessions',
    'circles',
    'registrations',
    'profiles'
  ];

  for (const table of tables) {
    try {
      console.log(`Clearing table '${table}'...`);
      const { data, error, count } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

      if (error) {
        console.error(`❌ Error clearing table '${table}':`, error.message);
      } else {
        console.log(`✅ Cleared table '${table}' successfully.`);
      }
    } catch (err) {
      console.error(`❌ Exception clearing table '${table}':`, err.message);
    }
  }

  console.log('--- Done Clearing User Data ---');
}

clearDatabase();
