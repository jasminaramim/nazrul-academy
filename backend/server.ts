import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import routes from './routes';
import { connectDB } from './config/dbConfig';

const backendEnv = path.resolve(process.cwd(), 'backend', '.env');
const rootEnv = path.resolve(process.cwd(), '.env');

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else {
  dotenv.config({ path: rootEnv });
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

// Initialize Express app at the top level so it can be exported
const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Connect to Database asynchronously without top-level await
connectDB().catch(console.error);

// API Routes
app.use('/api', routes);

async function startServer() {
  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: 24680 } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen to port if not in Vercel environment
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  }
}

// Start the server (this will not block the export)
startServer().catch(console.error);

// Export the app for Vercel Serverless Functions
export default app;
