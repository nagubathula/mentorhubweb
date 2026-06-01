const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function inspectAllPreferences() {
  const { data: students, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'STUDENT');

  if (error) {
    console.error(error);
    return;
  }

  console.log('--- ALL STUDENT PREFERENCES ---');
  for (const s of students) {
    console.log(`Student: ${s.name || s.email} (ID: ${s.id})`);
    console.log(`Preferences:`, JSON.stringify(s.preferences, null, 2));
    console.log('-----------------------------');
  }
}

inspectAllPreferences();
