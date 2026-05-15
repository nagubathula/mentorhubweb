const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking remote courses table columns...");
  const { data, error } = await supabase.from('courses').select('*').limit(1);
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Success! Columns in row:", data[0] ? Object.keys(data[0]) : "Empty table");
  }
}

test();
