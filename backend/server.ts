import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { connectDB } from './config/dbConfig.js';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

const app = express();

// CORS: Allow frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
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
app.get('/health', (_req, res) => {
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
