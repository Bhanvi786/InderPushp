import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inderpushp_db';
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error:`, error);
    // Don't crash process completely so health check and other functionality can report informative status
  }
};
