const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
  console.log('Inspecting tables...');
  try {
    // Let's check reviews table
    const { data: reviews, error: reviewsErr } = await supabase.from('reviews').select('*').limit(5);
    console.log('--- REVIEWS TABLE ---');
    console.log('Error:', reviewsErr);
    console.log('Data:', reviews);

    // Let's run a generic query to get table list if possible, or try common tables
    const tables = ['profiles', 'courses', 'enrollments', 'mapping', 'circles', 'circle_members', 'reviews', 'review_queue', 'submissions'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`Table '${table}' failed: ${error.message} (${error.code})`);
      } else {
        console.log(`Table '${table}' exists.`);
      }
    }
  } catch (e) {
    console.error('Error during inspection:', e);
  }
}

inspectTables();
