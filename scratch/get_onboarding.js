const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function checkOnboarding() {
  const { data, error } = await supabase
    .from('onboarding_answers')
    .select('*');
  console.log('--- ONBOARDING ANSWERS ---');
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkOnboarding();
