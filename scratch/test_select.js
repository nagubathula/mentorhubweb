const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSelect() {
  const { data: d1, error: e1 } = await supabase.from('enrollments').select('id, status').limit(1);
  console.log('Select ID, Status:', { dataExist: !!d1, error: e1?.message });

  const { data: d2, error: e2 } = await supabase.from('enrollments').select('progress').limit(1);
  console.log('Select Progress:', { dataExist: !!d2, error: e2?.message });
}

testSelect();
