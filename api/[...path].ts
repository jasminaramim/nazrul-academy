import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import routes from '../backend/routes';
import { connectDB } from '../backend/config/dbConfig';

// Load env
const backendEnv = path.resolve(process.cwd(), 'backend', '.env');
const rootEnv = path.resolve(process.cwd(), '.env');
if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else {
  dotenv.config({ path: rootEnv });
}

// Build express app
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/api', routes);

// Cache DB connection across warm invocations
let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    const result = await connectDB();
    if (result.success) isConnected = true;
  }
  return app(req as any, res as any);
}
