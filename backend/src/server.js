import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to current working directory

// Default fallbacks if .env is missing or run from parent
process.env.PORT = process.env.PORT || 5000;
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'supersecretclinicjwtkey_change_in_production_2026';

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: '*', // Allow all origins for smooth local development & testing
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    clinic: 'MedCare Multi-Speciality Clinic',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Clinic Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
