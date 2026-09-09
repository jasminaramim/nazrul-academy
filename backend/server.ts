import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables first
const backendEnv = path.resolve(process.cwd(), 'backend', '.env');
const rootEnv = path.resolve(process.cwd(), '.env');

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else {
  dotenv.config({ path: rootEnv });
}

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectDB } from './config/dbConfig';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

const app = express();

// CORS: লোকালে সব অনুমতি, production এ frontend URL থেকে অনুমতি
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3005'];

app.use(cors({
  origin: function (origin, callback) {
    // Vercel preview URLs বা অন্য কোনো origin allow করতে
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend server running: http://localhost:${PORT}`);
    console.log(`✅ API available at: http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);

export default app;
