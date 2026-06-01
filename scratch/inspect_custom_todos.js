const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectColumns() {
  const { data, error } = await supabase
    .from('custom_todos')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Inspection Error for custom_todos:", error);
  } else {
    console.log("Success! custom_todos table exists.");
  }
}

inspectColumns();
