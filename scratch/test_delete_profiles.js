const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
  const { data, error, count } = await supabase
    .from('profiles')
    .delete()
    .eq('id', 'test-dup-sdle4v');
  console.log('Result:', { data, error, count });
}
testDelete();
