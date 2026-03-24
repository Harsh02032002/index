const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import existing routes and models (fix paths for serverless)
const riskRoutes = require('../routes/risks');
const treatmentRoutes = require('../routes/treatments');
const reviewRoutes = require('../routes/reviews');
const assetRoutes = require('../routes/assets');
const vendorRoutes = require('../routes/vendors');

const app = express();

// Middleware for serverless environment
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-project.vercel.app', 'https://ezrisk.vercel.app', 'https://harsh02032002.github.io']
    : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
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

// MongoDB connection with retry logic
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment');
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
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
  }
};

// Initialize connection for serverless
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    timestamp: new Date(),
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date(),
    availableRoutes: ['/api/health', '/api/risks', '/api/treatments', '/api/reviews', '/api/assets', '/api/vendors']
  });
});

// Vercel serverless handler
module.exports = async (req, res) => {
  // Ensure database connection for each request
  await connectDB();
  return app(req, res);
};
