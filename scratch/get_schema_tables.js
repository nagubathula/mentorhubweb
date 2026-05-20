const https = require('https');

const options = {
  hostname: 'vhrmcfwlkjgepdcyhmnw.supabase.co',
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
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
      console.log('PostgREST schema keys:', Object.keys(schema));
      if (schema.definitions) {
        console.log('Known tables in schema definitions:', Object.keys(schema.definitions));
      } else {
        console.log('No definitions found. Full schema body:', data.slice(0, 1000));
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
