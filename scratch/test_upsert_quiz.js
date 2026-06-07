const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function testUpsert() {
  const userId = '2dc38f71-dfda-4c0c-8a84-a43bc36a680b'; // Ravindra
  const quizPayload = {
    student_id: userId,
    college: 'H tu',
    branch: 'Electronics / ECE',
    mother_tongue: 'Telugu',
    inspiration_source: 'Family member',
    admired_personality: null,
    curiosity_answer: 'Google it',
    exploration_frequency: 'Daily'
  };

  console.log('Testing simple upsert...');
  const { data: res1, error: err1 } = await supabase
    .from('student_quiz_responses')
    .upsert(quizPayload);
  console.log('Result 1:', res1, 'Error 1:', err1);

  console.log('Testing upsert with onConflict...');
  const { data: res2, error: err2 } = await supabase
    .from('student_quiz_responses')
    .upsert(quizPayload, { onConflict: 'student_id' });
  console.log('Result 2:', res2, 'Error 2:', err2);
}

testUpsert();
