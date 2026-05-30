const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectColumns() {
  const { data, error } = await supabase
    .from('student_notes')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Inspection Error:", error);
  } else if (data && data.length > 0) {
    console.log("Success! Columns found on student_notes table:", Object.keys(data[0]));
  } else {
    // If empty, let's insert a test note and select it to check keys
    console.log("student_notes is empty. Attempting a test insert...");
    const { data: insertData, error: insertError } = await supabase
      .from('student_notes')
      .insert({
        title: "Temporary Schema Test Note",
        content: "Testing columns",
        timestamp: Date.now()
      })
      .select();

    if (insertError) {
      console.error("Insert Error:", insertError);
    } else {
      console.log("Success! Columns found on student_notes table:", Object.keys(insertData[0]));
      // Clean up
      await supabase.from('student_notes').delete().eq('id', insertData[0].id);
    }
  }
}

inspectColumns();
