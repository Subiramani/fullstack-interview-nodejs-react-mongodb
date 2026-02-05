const taskService = require('../services/taskService');

/**
 * Task Controller
 * 
 * Controllers are responsible for:
 * - Receiving HTTP requests
 * - Extracting relevant data from req
 * - Calling appropriate service methods
 * - Sending HTTP responses
 * - Delegating business logic to services
 * 
 * Controllers should NOT contain business logic.
 * They're the "glue" between HTTP and your application logic.
 */

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public
 */
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.query);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Public
 */
exports.getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Public
 */
exports.createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Public
 */
exports.updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Public
 */
exports.deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
