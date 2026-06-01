const { createClient } = require('@supabase/supabase-js');
const url = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const key = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(url, key);

async function run() {
  console.log('Testing insert into gratitude_messages...');
  const { data, error } = await supabase.from('gratitude_messages').insert({
    message_content: 'Test gratitude message',
    display_name: 'Test Sender'
  }).select();
  if (error) {
    console.error('Error inserting into gratitude_messages:', error);
  } else {
    console.log('Success! Inserted gratitude message:', data);
  }
}
run();
