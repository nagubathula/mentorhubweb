const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function inspectQuestionnaires() {
  const { data, error } = await supabase
    .from('questionnaires')
    .select('*');

  if (error) {
    console.error('Error fetching questionnaires:', error);
    return;
  }

  console.log('--- QUESTIONNAIRES ---');
  for (const item of data) {
    console.log(`\nID: ${item.id}`);
    console.log(`Title: ${item.title}`);
    console.log(`Active: ${item.is_active}`);
    console.log(`Questions:`, JSON.stringify(item.questions, null, 2));
  }
}

inspectQuestionnaires();
