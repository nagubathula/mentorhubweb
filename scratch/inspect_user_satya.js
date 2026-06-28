const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('email', '%satya%');
  console.log('Result for satya email:', data, 'Error:', error);

  const { data: data2, error: error2 } = await supabase
    .from('profiles')
    .select('*')
    .ilike('name', '%satya%');
  console.log('Result for satya name:', data2, 'Error:', error2);
}
run();
