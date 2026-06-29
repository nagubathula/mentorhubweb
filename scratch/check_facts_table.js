const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInspiration() {
  console.log('Checking "inspiration" singular...');
  const { data: data1, error: error1 } = await supabase.from('inspiration').select('*').limit(1);
  if (error1) {
    console.error('Error singular:', error1.message);
  } else {
    console.log('Singular rows:', data1);
  }

  console.log('Checking "inspirations" plural...');
  const { data: data2, error: error2 } = await supabase.from('inspirations').select('*').limit(1);
  if (error2) {
    console.error('Error plural:', error2.message);
  } else {
    console.log('Plural rows:', data2);
  }
}

checkInspiration();
