const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function run() {
  console.log('1. Simulating feedback submission...');
  const feedbackMessage = 'Automated fallback test at ' + new Date().toISOString();
  
  // Try inserting into platform_feedback (will fail because table does not exist)
  console.log('Attempting insert into platform_feedback...');
  let { error } = await supabase.from('platform_feedback').insert([{
    user_name: 'Test Runner',
    user_email: 'test@runner.com',
    user_role: 'student',
    message: feedbackMessage
  }]);

  if (error) {
    console.log('As expected, platform_feedback failed:', error.message);
    console.log('Attempting fallback reviews insert...');
    
    const reviewsPayload = {
      reviewer_id: null,
      feedback: JSON.stringify({
        type: "platform_feedback",
        user_name: 'Test Runner',
        user_email: 'test@runner.com',
        user_role: 'student',
        message: feedbackMessage
      }),
      rating: 5
    };

    const { data: insertData, error: fallbackError } = await supabase
      .from('reviews')
      .insert(reviewsPayload)
      .select();

    if (fallbackError) {
      console.error('Fallback insert failed:', fallbackError);
    } else {
      console.log('Success! Fallback review inserted:', insertData);
      
      console.log('\n2. Verifying we can retrieve it under platform feedback parsing...');
      const { data: reviewsData, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
      } else {
        const parsedFeedback = (reviewsData || [])
          .filter(r => r.feedback && r.feedback.startsWith('{"type":"platform_feedback"'))
          .map(r => JSON.parse(r.feedback));

        console.log('Found parsed platform feedbacks inside reviews table:', parsedFeedback.length);
        const match = parsedFeedback.find(f => f.message === feedbackMessage);
        if (match) {
          console.log('MATCH FOUND! Successfully retrieved our custom fallback feedback:', match);
          
          console.log('\n3. Cleaning up test record...');
          const { error: deleteError } = await supabase
            .from('reviews')
            .delete()
            .eq('id', insertData[0].id);

          if (deleteError) {
            console.error('Cleanup error:', deleteError);
          } else {
            console.log('Success! Cleanup complete.');
          }
        } else {
          console.error('Test feedback was not found in fetched reviews!');
        }
      }
    }
  } else {
    console.log('Wow, platform_feedback succeeded without error!');
  }
}

run();
