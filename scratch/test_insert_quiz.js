const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

async function testInsert() {
  const { data: studentQuiz, error: err1 } = await supabase
    .from('student_quiz_responses')
    .select('*')
    .limit(1);
  console.log('student_quiz_responses row:', studentQuiz, err1);

  const { data: mentorQuiz, error: err2 } = await supabase
    .from('mentor_quiz_responses')
    .select('*')
    .limit(1);
  console.log('mentor_quiz_responses row:', mentorQuiz, err2);
}

testInsert();
