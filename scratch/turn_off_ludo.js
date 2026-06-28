const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vhrmcfwlkjgepdcyhmnw.supabase.co', 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe');

async function main() {
  const { data, error } = await supabase
    .from('feature_flags')
    .update({ is_enabled: false })
    .eq('key', 'student_game_ludo')
    .select();

  if (error) {
    console.error("Error disabling Ludo:", error);
  } else {
    console.log("Successfully updated Ludo flag:", data);
  }
}

main();
