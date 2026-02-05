import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { taskAPI } from '../services/api';
import './TasksPage.css';

/**
 * TasksPage Component
 * 
 * This is the main page component that orchestrates the entire task management UI.
 * It handles:
 * - Fetching tasks from the API
 * - Managing local state
 * - CRUD operations
 * - Loading and error states
 * 
 * Interview discussion points:
 * - State management: when would you move to Context API or Redux?
 * - Error handling strategies
 * - Optimistic updates vs pessimistic updates
 * - Where would pagination/infinite scroll fit?
 * - How would you add real-time updates? (WebSockets, polling)
 */

function TasksPage() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch tasks on component mount
   * useEffect with empty dependency array runs once on mount
   */
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetch all tasks from API
   */
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new task
   */
  const handleCreateTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await taskAPI.createTask(taskData);
      
      // Add new task to the beginning of the list (optimistic update)
      setTasks([response.data, ...tasks]);
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Toggle task completion status
   */
  const handleToggleComplete = async (taskId, completed) => {
    try {
      setError(null);
      const response = await taskAPI.updateTask(taskId, { completed });
      
      // Update task in local state
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
    }
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = async (taskId) => {
    try {
      setError(null);
      await taskAPI.deleteTask(taskId);
      
      // Remove task from local state
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    }
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  /**
   * Main render
   */
  return (
    <div className="container">
      <header className="page-header">
        <h1>Task Manager</h1>
        <p>A simple MERN stack demo application</p>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <TaskForm onSubmit={handleCreateTask} isLoading={isSubmitting} />
      
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

export default TasksPage;
