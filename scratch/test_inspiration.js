const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  console.log("Checking table 'inspirations' (plural)...");
  const { data: pluralData, error: pluralError } = await supabase.from('inspirations').select('*').limit(1);
  if (pluralError) {
    console.log("  Failed 'inspirations':", pluralError.message);
  } else {
    console.log("  Success 'inspirations':", pluralData);
  }

  console.log("Checking table 'inspiration_reads'...");
  const { data: readsData, error: readsError } = await supabase.from('inspiration_reads').select('*').limit(1);
  if (readsError) {
    console.log("  Failed 'inspiration_reads':", readsError.message);
  } else {
    console.log("  Success 'inspiration_reads':", readsData);
  }
}

testTables();
