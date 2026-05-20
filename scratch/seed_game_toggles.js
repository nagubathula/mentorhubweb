const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

const newFlags = [
  { key: 'student_game_snakes', title: 'Snake & Ladder Quiz', category: 'student', is_enabled: true },
  { key: 'student_game_ludo', title: 'Ludo Quiz', category: 'student', is_enabled: true },
  { key: 'student_game_kbc', title: 'KBC Tech Edition', category: 'student', is_enabled: true }
];

async function seed() {
  console.log('Inserting game feature toggles...');
  for (const flag of newFlags) {
    const { data, error } = await supabase
      .from('feature_flags')
      .upsert(flag, { onConflict: 'key' })
      .select();
    
    if (error) {
      console.error(`Error inserting ${flag.key}:`, error);
    } else {
      console.log(`Successfully seeded: ${flag.key}`, data);
    }
  }
}

seed();
