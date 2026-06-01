const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function run() {
  console.log('Testing delete from reviews...');
  const { error } = await supabase.from('reviews').delete().eq('feedback', 'Test feedback');
  if (error) {
    console.error('Error deleting from reviews:', error);
  } else {
    console.log('Success! Deleted review.');
  }
}
run();
