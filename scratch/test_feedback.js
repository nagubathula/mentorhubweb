const { createClient } = require('@supabase/supabase-js');

const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function run() {
  console.log('Testing platform_feedback connection...');
  const { data, error } = await supabase
    .from('platform_feedback')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching platform_feedback:', error);
  } else {
    console.log('Successfully fetched platform_feedback:', data);
  }
}

run();
