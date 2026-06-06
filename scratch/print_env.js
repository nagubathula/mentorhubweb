console.log("Keys in process.env:", Object.keys(process.env).filter(k => k.toLowerCase().includes('supabase') || k.toLowerCase().includes('key') || k.toLowerCase().includes('secret') || k.toLowerCase().includes('db') || k.toLowerCase().includes('pass')));
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
