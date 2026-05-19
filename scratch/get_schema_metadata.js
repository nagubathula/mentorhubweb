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
      const enrollmentsProps = schema.definitions.enrollments.properties;
      console.log('Enrollments properties in PostgREST schema cache:');
      console.log(Object.keys(enrollmentsProps));
    } catch (e) {
      console.error('Error parsing schema:', e);
    }
  });
});

req.on('error', error => {
  console.error('HTTPS Error:', error);
});

req.end();
