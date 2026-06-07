const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  const { data: profilesList, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error(error);
    return;
  }

  const students = profilesList.filter((p) => p.role === "STUDENT" || p.preferences?.roles?.includes("STUDENT"));
  const mentors = profilesList.filter((p) => p.role === "MENTOR" || p.preferences?.roles?.includes("MENTOR"));
  const unassigned = profilesList.filter((p) => !p.role && (!p.preferences?.roles || p.preferences.roles.length === 0));

  console.log('--- ADMIN FILTERED COUNTS ---');
  console.log('Total Profiles in DB:', profilesList.length);
  console.log('Admin Students:', students.length);
  console.log('Admin Mentors:', mentors.length);
  console.log('Admin Unassigned:', unassigned.length);
}

verify();
