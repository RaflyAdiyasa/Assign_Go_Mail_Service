import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import mailRoutes from './routes/mailRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mails', mailRoutes);
app.use('/api/history', historyRoutes);

// Initialize database
const initializeDB = async () => {
  try {
    await sequelize.sync();
    console.log('Database connected and synchronized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Surat service running on port ${PORT}`);
  await initializeDB();
});