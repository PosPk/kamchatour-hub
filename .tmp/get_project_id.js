const https = require('https');
const data = JSON.stringify({
  query: 'query (: String!) { app(byFullName: ) { id fullName slug ownerAccount { id name } } }',
  variables: { appId: '@pos-servis/kamchatour-hub' }
});
const options = {
  hostname: 'api.expo.dev',
  path: '/v2/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': ,
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      if (json.errors) {
        console.error(JSON.stringify(json, null, 2));
        process.exit(1);
      }
      const id = json && json.data && json.data.app && json.data.app.id;
        console.error('No app id in response:', body);
        process.exit(1);
      }
      process.stdout.write(id);
    } catch (e) {
      console.error('Failed to parse response:', body);
      process.exit(1);
    }
  });
});
req.on('error', err => { console.error(err.message); process.exit(1); });
req.write(data);
req.end();
