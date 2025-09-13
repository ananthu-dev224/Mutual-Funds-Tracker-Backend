import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import fundsRoutes from './routes/funds.js';
import auth from './middlewares/auth.js';
import { startNavUpdater } from './cron/navUpdater.js';


dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Connect DB
connectDB(process.env.MONGO_URI);
// Start cron job
startNavUpdater();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/funds', fundsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
