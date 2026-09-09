const fs = require('fs');
const path = require('path');
function fix(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) fix(p);
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/from '\.\.\/\.\.\/\.\.\/shared/g, "from '../../shared");
      c = c.replace(/from '\.\.\/\.\.\/\.\.\/components/g, "from '../../components");
      fs.writeFileSync(p, c);
    }
  }
}
fix(path.join(process.cwd(), 'src/frontend'));
fix(path.join(process.cwd(), 'src/admin'));
console.log('Fixed depth');
