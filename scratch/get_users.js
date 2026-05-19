const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getUsers() {
  const { data: profiles, error } = await supabase.from('profiles').select('id, name, email, role');
  if (error) {
    console.error("Error reading profiles:", error);
  } else {
    console.log("Registered Profiles:", JSON.stringify(profiles, null, 2));
  }
}

getUsers();
