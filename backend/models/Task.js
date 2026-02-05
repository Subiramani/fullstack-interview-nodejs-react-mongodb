const mongoose = require('mongoose');

/**
 * Task Model
 * 
 * Represents a simple task with title, description, and completion status.
 * This is intentionally minimal to keep the boilerplate interview-friendly.
 * 
 * Extensions to discuss in interviews:
 * - Add user association (userId field)
 * - Add priority levels
 * - Add due dates
 * - Add tags/categories
 */

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
  }
);

// Index for common queries (optional but good to mention in interviews)
taskSchema.index({ completed: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
