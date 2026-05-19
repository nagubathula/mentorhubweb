const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function check() {
  const { data, error } = await supabase.rpc('get_tables'); // standard/custom pg function maybe
  console.log('Tables from RPC:', data, error);

  // Let's check a few possible table names
  const testTables = ['feature_flags', 'features', 'flags', 'settings', 'config', 'profiles'];
  for (const t of testTables) {
    const { data: rows, error: err } = await supabase.from(t).select('*').limit(1);
    console.log(`Table '${t}' query status:`, err ? `Error: ${err.message}` : `Success (${rows.length} rows)`);
  }
}

check();
