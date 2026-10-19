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

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and requests with no origin (like mobile apps/curl)
      callback(null, true);
    },
    credentials: true,
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

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
