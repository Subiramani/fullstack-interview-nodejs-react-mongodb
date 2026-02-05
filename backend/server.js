const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Load environment variables
 * Must be loaded before accessing process.env
 */
dotenv.config();

/**
 * Connect to MongoDB
 * We do this before starting the server to ensure DB is ready
 */
connectDB();

/**
 * Initialize Express app
 */
const app = express();

/**
 * Middleware
 * 
 * Order matters! Middleware runs in the order it's defined.
 * 
 * 1. CORS - Allow cross-origin requests from frontend
 * 2. express.json() - Parse JSON request bodies
 */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

/**
 * Routes
 * 
 * All task routes are prefixed with /api/tasks
 * This keeps the API organized and versioned (could add /api/v1/tasks later)
 */
app.use('/api/tasks', taskRoutes);

/**
 * Health check endpoint
 * Useful for monitoring, load balancers, Docker health checks
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * 404 handler for undefined routes
 * This catches any requests that don't match defined routes
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

/**
 * Error handling middleware
 * Must be defined AFTER all routes
 */
app.use(errorHandler);

/**
 * Start server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
