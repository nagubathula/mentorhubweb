const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function run() {
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'ravindraa0231@gmail.com')
    .single();
    
  console.log('User:', JSON.stringify(user, null, 2));
}
run();
