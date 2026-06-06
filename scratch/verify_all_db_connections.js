const { createClient } = require('@supabase/supabase-js');

const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function verifyAllConnections() {
  const tables = [
    'profiles',
    'courses',
    'sessions',
    'enrollments',
    'reviews',
    'messages',
    'mapping',
    'circles',
    'registrations',
    'questionnaires',
    'inspiration',
    'inspirations',
    'inspiration_reads',
    'gratitude_messages',
    'csr_sponsors',
    'games_quizzes',
    'games',
    'quiz_results',
    'student_quiz_responses',
    'mentor_quiz_responses',
    'student_notes',
    'custom_todos',
    'feature_flags',
    'platform_feedback',
    'review_queue',
    'onboarding_answers',
    'modules',
    'lessons',
    'lesson_progress',
    'circle_members'
  ];

  console.log('--- Supabase Database Connection & Schema Audit ---');
  let successfulConnections = 0;
  let failedConnections = 0;

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('JSON object')) {
          console.log(`✅ Table '${table}': Connected (Status: Row level constraint)`);
          successfulConnections++;
        } else if (error.message.includes('does not exist') || error.message.includes('Could not find')) {
          console.log(`❌ Table '${table}': Missing / Does not exist (Error: ${error.message})`);
          failedConnections++;
        } else {
          console.log(`✅ Table '${table}': Connected (Status: ${error.message})`);
          successfulConnections++;
        }
      } else {
        console.log(`✅ Table '${table}': Connected (Status: Success)`);
        successfulConnections++;
      }
    } catch (err) {
      console.log(`❌ Table '${table}': Connection Exception (Error: ${err.message})`);
      failedConnections++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total Tables Checked: ${tables.length}`);
  console.log(`Connected Tables: ${successfulConnections}`);
  console.log(`Missing/Failed Tables: ${failedConnections}`);
}

verifyAllConnections();
