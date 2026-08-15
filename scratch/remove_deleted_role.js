const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function run() {
  const { data: user, error: fetchErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'ravindraa0231@gmail.com')
    .single();
    
  if (fetchErr) {
    console.error(fetchErr);
    return;
  }
  
  const prefs = user.preferences || {};
  if (prefs.roles) {
    // Remove "DELETED" from roles array
    prefs.roles = prefs.roles.filter(role => role !== 'DELETED');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      preferences: prefs
    })
    .eq('email', 'ravindraa0231@gmail.com')
    .select();
    
  console.log('Updated Roles:', data[0].preferences.roles);
}
run();
