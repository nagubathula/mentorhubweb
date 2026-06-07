const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseKey) {
  console.error("Missing supabase publishable key in env");
  process.exit(1);
}

const hostname = supabaseUrl.replace('https://', '');

const options = {
  hostname: hostname,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const schema = JSON.parse(data);
       if (schema.definitions && schema.definitions.profiles) {
        console.log('Profiles properties in Supabase database:');
        console.log(Object.keys(schema.definitions.profiles.properties));
      } else {
        console.log('Schema properties mismatch. Body:', data);
      }
    } catch (e) {
      console.error('Error parsing schema:', e);
    }
  });
});

req.on('error', error => {
  console.error('HTTPS Error:', error);
});

req.end();
