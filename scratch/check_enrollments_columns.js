const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('enrollments').select('*').limit(1);
  if (error) {
    console.error('Error fetching enrollments:', error);
  } else {
    console.log('Enrollments keys:', data.length > 0 ? Object.keys(data[0]) : 'No records found');
  }
}

check();
