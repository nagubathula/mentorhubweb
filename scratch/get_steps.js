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
      if (q.title.includes("Onboarding") || q.title.includes("Behavioral")) {
        console.log('===', q.title, '===');
        if (Array.isArray(q.questions)) {
          q.questions.forEach((step, idx) => {
            console.log(`Step ${idx + 1}: ${step.title || 'No Title'}`);
            if (Array.isArray(step.questions)) {
              step.questions.forEach(question => {
                console.log(`  - ID: ${question.id}, Text: ${question.text.substring(0, 50)}...`);
              });
            }
          });
        }
      }
    }
  }
}

checkQuestionnaires();
