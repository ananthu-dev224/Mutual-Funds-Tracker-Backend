require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const portfolioRoutes = require('./routes/portfolio');
// const fundsRoutes = require('./routes/funds');
// const { startNavUpdater } = require('./cron/navUpdater');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect DB
connectDB(process.env.MONGO_URI);

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/portfolio', portfolioRoutes);
// app.use('/api/funds', fundsRoutes);

// health
// app.get('/health', (req,res) => res.json({ ok:true }));

// start cron job after DB connected
// startNavUpdater();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
