const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes (fix paths for serverless)
const riskRoutes = require('../routes/risks');
const treatmentRoutes = require('../routes/treatments');
const reviewRoutes = require('../routes/reviews');
const assetRoutes = require('../routes/assets');
const vendorRoutes = require('../routes/vendors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://your-project.vercel.app',
    'https://ezrisk.vercel.app', 
    'https://harsh02032002.github.io',
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    message: 'ezRisk Backend API is running'
  });
});

// API Routes
app.use('/api/risks', riskRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/vendors', vendorRoutes);

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found');
      return;
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error);
    isConnected = false;
  }
};

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    timestamp: new Date()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date()
  });
});

// Initialize connection
connectDB();

// Export for Vercel
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
