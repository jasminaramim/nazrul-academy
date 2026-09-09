import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const backendEnv = path.resolve(process.cwd(), 'backend', '.env');
const rootEnv = path.resolve(process.cwd(), '.env');

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else {
  dotenv.config({ path: rootEnv });
}

import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import routes from './routes';
import { connectDB } from './config/dbConfig';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;


  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Connect to Database
  await connectDB();

  // API Routes
  app.use('/api', routes);

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production') {
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

  
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`সার্ভার চলছে: http://localhost:${PORT}`);
    });
  }

  export default app;



