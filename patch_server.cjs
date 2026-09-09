const fs = require('fs');

let code = fs.readFileSync('backend/server.ts', 'utf8');

// Replace the startServer wrapper
code = code.replace(/async function startServer\(\) \{/g, '');
code = code.replace(/startServer\(\);/g, '');

// The Vite server part and the listener need to be wrapped or removed for Vercel
// Vercel handles static serving natively, so we don't need express to serve `dist` on Vercel.
const oldListenBlock = `  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`সার্ভার চলছে: http://localhost:\${PORT}\`);
  });
}`;

const newBlock = `
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(\`সার্ভার চলছে: http://localhost:\${PORT}\`);
    });
  }

  export default app;
`;

// It's safer to just do a string replacement
code = code.replace(/app\.listen\(PORT, '0\.0\.0\.0', \(\) => \{\s*console\.log\([^)]+\);\s*\}\);\s*\}/, newBlock);

fs.writeFileSync('backend/server.ts', code);
