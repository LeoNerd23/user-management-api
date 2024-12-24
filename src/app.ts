import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import dbconnect from './database';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Database connection
dbconnect();

export default app;
