const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  console.log('Testing head select on review_queue...');
  const { data, error, status, statusText } = await supabase.from('review_queue').select('*', { count: 'exact', head: true });
  console.log('Error:', error);
  console.log('Data:', data);
  console.log('Status:', status, statusText);
}

testQuery();
