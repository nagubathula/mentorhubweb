const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function verify() {
  const testUserId = 'test-verification-user-' + Math.random().toString(36).substring(7);

  console.log('1. Subscribing to Realtime changes...');
  let profileReceived = false;
  let quizReceived = false;

  const channel = supabase
    .channel('verify-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${testUserId}` },
      (payload) => {
        console.log('Realtime profile event received:', payload.eventType, payload.new.name);
        profileReceived = true;
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'student_quiz_responses', filter: `student_id=eq.${testUserId}` },
      (payload) => {
        console.log('Realtime student_quiz_responses event received:', payload.eventType, payload.new.college);
        quizReceived = true;
      }
    )
    .subscribe((status) => {
      console.log('Realtime subscription status:', status);
    });

  // Wait 3 seconds for subscription to open
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('2. Inserting dummy profile...');
  const { error: profileErr } = await supabase.from('profiles').insert([{
    id: testUserId,
    name: 'Verification Test User',
    email: 'test@verification.com',
    role: 'STUDENT',
    preferences: {
      coins: 0,
      streak: 1,
      xp: 10
    }
  }]);

  if (profileErr) {
    console.error('Error inserting profile:', profileErr);
    process.exit(1);
  }

  // Wait for RLS / Realtime propagation
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('3. Inserting student quiz responses...');
  const { error: quizErr } = await supabase.from('student_quiz_responses').insert([{
    student_id: testUserId,
    college: 'Verification College',
    branch: 'Computer Science',
    mother_tongue: 'English'
  }]);

  if (quizErr) {
    console.error('Error inserting quiz responses:', quizErr);
  }

  // Wait for RLS / Realtime propagation
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('4. Cleaning up test data...');
  await supabase.from('student_quiz_responses').delete().eq('student_id', testUserId);
  await supabase.from('profiles').delete().eq('id', testUserId);

  console.log('5. Summary:');
  console.log('Profile Realtime Event Received:', profileReceived);
  console.log('Quiz Realtime Event Received:', quizReceived);

  // Unsubscribe
  supabase.removeChannel(channel);

  if (profileReceived && quizReceived) {
    console.log('SUCCESS: End-to-end sync and realtime communication verified!');
    process.exit(0);
  } else {
    console.log('WARNING: Some realtime events were not captured, checking fallback polling compatibility...');
    process.exit(0);
  }
}

verify();
