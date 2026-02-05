const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * Task Routes
 * 
 * Routes define the API endpoints and map them to controller methods.
 * This is where you'd add middleware for:
 * - Authentication (protect routes)
 * - Validation (validate request body/params)
 * - Rate limiting
 * - etc.
 * 
 * RESTful design:
 * - GET    /api/tasks      -> Get all tasks
 * - GET    /api/tasks/:id  -> Get single task
 * - POST   /api/tasks      -> Create task
 * - PUT    /api/tasks/:id  -> Update task
 * - DELETE /api/tasks/:id  -> Delete task
 */

router
  .route('/')
  .get(taskController.getTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
