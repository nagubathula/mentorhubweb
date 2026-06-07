const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function checkQuestionnaires() {
  const { data, error } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('is_active', true);
  if (error) {
    console.error(error);
  } else {
    for (const q of data) {
      console.log('---', q.title, '---');
      console.log(JSON.stringify(q.questions, null, 2));
    }
  }
}

checkQuestionnaires();
