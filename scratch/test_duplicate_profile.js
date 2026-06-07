const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function test() {
  const testId = 'test-dup-' + Math.random().toString(36).substring(7);

  console.log('Inserting STUDENT profile...');
  const { error: err1 } = await supabase.from('profiles').insert([{
    id: testId,
    name: 'Test Dup',
    email: 'test@dup.com',
    role: 'STUDENT'
  }]);
  console.log('STUDENT insert result:', err1 ? err1.message : 'SUCCESS');

  console.log('Inserting MENTOR profile for same ID...');
  const { error: err2 } = await supabase.from('profiles').insert([{
    id: testId,
    name: 'Test Dup',
    email: 'test@dup.com',
    role: 'MENTOR'
  }]);
  console.log('MENTOR insert result:', err2 ? err2.message : 'SUCCESS');

  // Cleanup if success
  await supabase.from('profiles').delete().eq('id', testId);
}

test();
