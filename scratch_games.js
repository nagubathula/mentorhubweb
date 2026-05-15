const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
async function test() {
  const { data, error } = await supabase.from('games_quizzes').select('*');
  console.log(data, error);
}
test();
