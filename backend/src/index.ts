import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'success', 
    message: 'Welcome to the InderPushp API!' 
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
