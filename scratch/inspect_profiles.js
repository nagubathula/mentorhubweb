const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function inspectProfiles() {
  const { data: students, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'STUDENT')
    .limit(10);

  if (error) {
    console.error('Error fetching student profiles:', error);
    return;
  }

  console.log('--- STUDENT PROFILES INSPECTION ---');
  for (const stud of students) {
    console.log(`\nID: ${stud.id}`);
    console.log(`Name: ${stud.name}`);
    console.log(`Email: ${stud.email}`);
    console.log(`Preferences:`, JSON.stringify(stud.preferences));
    console.log(`Screening Answers:`, JSON.stringify(stud.screening_answers));
    // Print all keys of the profile object to see what fields exist
    console.log(`Profile Keys:`, Object.keys(stud));
  }
}

inspectProfiles();
