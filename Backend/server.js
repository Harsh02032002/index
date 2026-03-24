require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./utils/scheduler'); // Initialize scheduler

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/risks', require('./routes/risks'));
app.use('/api/kris', require('./routes/kris'));
app.use('/api/controls', require('./routes/controls'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/risk-appetite', require('./routes/riskAppetite'));
app.use('/api/reports', require('./routes/reports'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Nexus GRC API running on port ${PORT}`));
