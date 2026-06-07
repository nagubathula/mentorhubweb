const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function softClearProfiles() {
  console.log('--- Soft Clearing/Hiding Profiles ---');

  // Fetch all profiles
  const { data: profiles, error: fetchErr } = await supabase.from('profiles').select('id');
  if (fetchErr) {
    console.error('Error fetching profiles:', fetchErr.message);
    return;
  }

  console.log(`Found ${profiles.length} profiles to reset.`);

  for (const profile of profiles) {
    try {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          name: 'Deleted User',
          email: `deleted-${profile.id}@example.com`,
          role: null,
          expertise: null,
          preferences: { roles: ['DELETED'], deleted: true }
        })
        .eq('id', profile.id);

      if (updateErr) {
        console.error(`❌ Error updating profile '${profile.id}':`, updateErr.message);
      } else {
        console.log(`✅ Reset profile '${profile.id}' successfully.`);
      }
    } catch (err) {
      console.error(`❌ Exception updating profile '${profile.id}':`, err.message);
    }
  }

  console.log('--- Soft Clear Complete ---');
}

softClearProfiles();
