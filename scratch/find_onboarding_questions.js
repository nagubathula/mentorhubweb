const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function findStudentOnboarding() {
  const { data, error } = await supabase
    .from('questionnaires')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  const studentQuiz = data.find(q => q.title.includes("Student Onboarding"));
  if (studentQuiz) {
    console.log("Title:", studentQuiz.title);
    for (const step of studentQuiz.questions) {
      console.log(`\nStep: ${step.step} - ${step.title}`);
      if (step.questions) {
        for (const q of step.questions) {
          console.log(`  Question ID: ${q.id}`);
          console.log(`  Question Text: ${q.question || q.label}`);
          console.log(`  Options:`, q.options);
        }
      }
    }
  } else {
    console.log("Student Onboarding not found.");
  }
}

findStudentOnboarding();
