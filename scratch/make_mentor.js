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
  prefs.deleted = false;
  if (!prefs.roles) prefs.roles = [];
  if (!prefs.roles.includes('MENTOR')) prefs.roles.push('MENTOR');
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      role: 'MENTOR',
      preferences: prefs
    })
    .eq('email', 'ravindraa0231@gmail.com')
    .select();
    
  console.log('Updated:', data, 'Error:', error);
}
run();
