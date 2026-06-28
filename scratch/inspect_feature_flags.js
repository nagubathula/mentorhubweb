const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vhrmcfwlkjgepdcyhmnw.supabase.co', 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe');

async function main() {
  const { data, error } = await supabase.from('feature_flags').select('*');
  if (error) {
    console.error("Error fetching feature flags:", error);
  } else {
    console.log("Feature flags in DB:", data);
  }
}

main();
