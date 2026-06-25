const https = require('https');

https.get('https://date.nager.at/api/v3/PublicHolidays/2026/IN', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log(JSON.parse(data)); });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
