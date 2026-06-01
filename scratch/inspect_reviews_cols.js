const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('reviews').select('*').limit(1);
  if (error) {
    console.error('Error fetching reviews:', error);
  } else {
    console.log('Successfully fetched reviews, columns:', data.length > 0 ? Object.keys(data[0]) : 'no records');
  }
}

run();
