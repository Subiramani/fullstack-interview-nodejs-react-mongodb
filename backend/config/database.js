const mongoose = require('mongoose');

/**
 * Database connection configuration
 * 
 * This module encapsulates MongoDB connection logic.
 * Benefits:
 * - Centralized connection management
 * - Easy to mock for testing
 * - Clear error handling
 */

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
