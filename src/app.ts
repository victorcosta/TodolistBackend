import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Database connection
mongoose.set("strictQuery", false);


mongoose.connect(process.env.MONGO_URI!).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

export default app;
