const fs = require('fs');

function cleanFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/^(\s*)\/\/\s?/, '$1');
  }
  fs.writeFileSync(filePath, lines.join('\n'));
}

cleanFile('src/components/AdminDashboard.tsx');
console.log('Uncommented AdminDashboard.tsx successfully!');
