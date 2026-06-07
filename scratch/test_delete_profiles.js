const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) {
    console.error("Delete failed with error:", error);
  } else {
    console.log("Delete succeeded:", data);
  }
}

run();
