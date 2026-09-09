const fs = require('fs');

let code = fs.readFileSync('backend/server.ts', 'utf8');

// The original code has:
/*
async function startServer() {
  const app = express();
  ...
  await connectDB();
  ...
  app.use('/api', routes);
  ...
  app.listen(...)
}
startServer();
*/

// We will use regex to restructure it.
// 1. Remove `async function startServer() {` and `const app = express();`
code = code.replace(/async function startServer\(\) \{\s*const app = express\(\);/, 'const app = express();');

// 2. Remove `await connectDB();`
code = code.replace(/await connectDB\(\);/, 'connectDB().catch(console.error);');

// 3. Find the Vite serving part and wrap it in startServer
code = code.replace(/\/\/ --- Vite \/ Frontend Serving ---/, `// --- Vite / Frontend Serving ---\nasync function startServer() {`);

// 4. Find the app.listen part and modify it
code = code.replace(/app\.listen\(PORT, '0\.0\.0\.0', \(\) => \{\s*console\.log\([^)]+\);\s*\}\);\s*\}/, `
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(\`সার্ভার চলছে: http://localhost:\${PORT}\`);
    });
  }
}
`);

// 5. Add export default app at the end
code += '\nexport default app;\n';

fs.writeFileSync('backend/server.ts', code);
