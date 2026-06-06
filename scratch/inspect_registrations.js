const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectRegistrations() {
  const { data: regs, error: regsErr } = await supabase.from('registrations').select('*');
  console.log('--- REGISTRATIONS ---', regsErr || regs);

  const { data: mappings, error: mapErr } = await supabase.from('mapping').select('*');
  console.log('--- MAPPINGS ---', mapErr || mappings);

  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  console.log('--- ALL PROFILES ---', profErr || profiles);
}

inspectRegistrations();
