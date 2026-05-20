const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const payload = {
    title: "Data Analytics Pro Test",
    description: "Master data analysis with Python, SQL, and visualization tools.",
    status: 'Active',
    content: [
      {
        id: "da-m1",
        title: "Foundations of Data Analytics",
        description: "Core concepts, analytics lifecycle, and the role of a data analyst",
        enabled: true,
        lessons: [
          {
            id: "da-l1",
            title: "What is Data Analytics?",
            duration: "12 min",
            type: "video",
            enabled: true
          }
        ]
      }
    ]
  };

  console.log("Testing insert payload...");
  const { data, error } = await supabase.from('courses').insert(payload).select();
  if (error) {
    console.error("Insert Error details:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success! Inserted course:", data);
  }
}

testInsert();
