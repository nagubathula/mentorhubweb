const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectColumns() {
  console.log("Inserting a minimal test course...");
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: "Temporary Schema Test Course",
      description: "Inspecting available columns"
    })
    .select();

  if (error) {
    console.error("Inspection Insert Error:", error);
  } else {
    console.log("Success! Columns found on courses table:", Object.keys(data[0]));
    // Delete it so we leave the DB clean
    await supabase.from('courses').delete().eq('id', data[0].id);
    console.log("Cleaned up test course.");
  }
}

inspectColumns();
