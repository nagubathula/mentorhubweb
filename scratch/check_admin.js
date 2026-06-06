const { createClient } = require('@supabase/supabase-js');
const url = "https://vhrmcfwlkjgepdcyhmnw.supabase.co";
const key = "sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe";
const supabase = createClient(url, key);

async function run() {
  const email = "admin@kindmentor.in";
  const password = "admin123";
  
  console.log("Attempting sign in...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    console.log("Sign in failed:", signInError.message);
    console.log("Attempting sign up...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          role: 'ADMIN',
          full_name: 'System Admin'
        }
      }
    });
    if (signUpError) {
      console.log("Sign up failed:", signUpError.message);
    } else {
      console.log("Sign up succeeded!", signUpData);
    }
  } else {
    console.log("Sign in succeeded!", signInData);
  }
}

run();
