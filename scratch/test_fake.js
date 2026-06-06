const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFake() {
  const { data, error, status } = await supabase.from('non_existent_table_xyz').select('*', { count: 'exact', head: true });
  console.log('Fake table Status:', status);
  console.log('Fake table Error:', error);
}

testFake();
