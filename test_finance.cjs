const http = require('http');

http.get('http://localhost:5000/api/finance/global', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Global Finance Result:");
    console.log(data);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
