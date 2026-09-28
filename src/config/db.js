import mongoose from 'mongoose';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}