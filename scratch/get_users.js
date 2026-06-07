const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function checkUsers() {
  const { data: profiles, error: err1 } = await supabase
    .from('profiles')
    .select('*');
  console.log('--- PROFILES ---');
  if (err1) {
    console.error(err1);
  } else {
    console.log(profiles);
  }

  const { data: registrations, error: err2 } = await supabase
    .from('registrations')
    .select('*');
  console.log('--- REGISTRATIONS ---');
  if (err2) {
    console.error(err2);
  } else {
    console.log(registrations);
  }
}

checkUsers();
