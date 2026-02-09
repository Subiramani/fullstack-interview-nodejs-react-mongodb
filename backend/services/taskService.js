const Task = require('../models/Task');

/**
 * Task Service Layer
 * 
 * Why separate services from controllers?
 * - Controllers handle HTTP (req/res), services handle business logic
 * - Services can be reused across different controllers or contexts
 * - Easier to test business logic independently
 * - Cleaner separation of concerns
 * 
 * Interview discussion points:
 * - When services grow complex, they can be further split
 * - Services can interact with multiple models
 * - This is where you'd add caching, external API calls, etc.
 */

class TaskService {
  /**
   * Get all tasks with optional filtering
   */
  async getAllTasks(filters = {}) {
    const query = {};
    const options = {};

    // Example: filter by completion status if provided
    if (filters.completed !== undefined) {
      query.completed = filters.completed === 'true';
    }

    if (filters.page !== undefined && !isNaN(Number(filters.page))) {
      let limit = filters.limit ? Number(filters.limit) : 10
      if (limit > 20) {
        limit = 10
      }
      options.limit = limit;
      const skipRecords = (Number(filters.page) - 1) * options.limit;
      if (skipRecords) {
        options.skip = skipRecords;
      }
    }
    // Sort by creation date (newest first)
    const tasks = await Task.find(query, null, options).sort({ createdAt: -1 });
    const count = await Task.countDocuments(query)
    const currentPage = filters.page ?? 1;
    const totalPages = Math.ceil(count / filters.limit);
    const pagination = {
      currentPage,
      totalPages,
      totalItems: count,
      itemsPerPage: filters.limit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    }

    return { tasks, pagination }
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId) {
    const task = await Task.findById(taskId);
    
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    return task;
  }

  /**
   * Create a new task
   */
  async createTask(taskData) {
    // Validation happens at the model level
    const task = await Task.create(taskData);
    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(taskId, updateData) {
    const task = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );
    
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    return task;
  }
}

// Export a single instance (simpler than instantiating in each controller)
module.exports = new TaskService();
