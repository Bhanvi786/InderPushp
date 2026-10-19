import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import artworkRoutes from './routes/artwork.routes';
import uploadRoutes from './routes/upload.routes';
import categoryRoutes from './routes/category.routes';
import aboutSettingsRoutes from './routes/aboutSettings.routes';
import contactRoutes from './routes/contact.routes';

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5001;

// Trust first proxy (Render / Cloudflare / reverse proxy) for accurate IP resolution in rate limiting
app.set('trust proxy', 1);

// Security Headers (Lightweight & zero overhead)
app.use((_req: Request, res: Response, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Explicit CORS Allowlist
const ALLOWED_ORIGINS = [
  'https://inderpushphouseofart.com',
  'https://www.inderpushphouseofart.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

// Helper to validate verified Vercel preview URLs strictly for this project
const isAllowedVercelOrigin = (origin: string): boolean => {
  // Allow inder-pushp-*.vercel.app or exact inderpushp vercel domains
  return /^https:\/\/(inder-pushp|inderpushp)(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      if (ALLOWED_ORIGINS.includes(origin) || isAllowedVercelOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Welcome to the InderPushp API!',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/about-settings', aboutSettingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Centralized error handling middleware with production sanitization
app.use((err: any, req: Request, res: Response, _next: any) => {
  console.error('[Unhandled Server Error]:', err.message || err);
  const status = typeof err.status === 'number' ? err.status : 500;
  
  // Never leak stack traces or internal DB errors to public API in production
  const safeMessage =
    status < 500 || process.env.NODE_ENV !== 'production'
      ? err.message || 'Operation failed'
      : 'An unexpected internal error occurred. Please try again later.';

  res.status(status).json({
    success: false,
    message: safeMessage,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
