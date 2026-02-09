/**
 * API Service Layer
 * 
 * Centralized API calls to backend.
 * 
 * Benefits:
 * - Single source of truth for API endpoints
 * - Easy to switch between environments (dev, staging, prod)
 * - Consistent error handling
 * - Easy to add interceptors (auth tokens, logging, etc.)
 * 
 * Interview discussion:
 * - How would you add authentication? (Add token to headers)
 * - How would you handle retries? (Add retry logic in catch blocks)
 * - Why not use axios? (fetch is native, fewer dependencies for boilerplate)
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // API returned an error response
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    // Network error or parsing error
    throw new Error(error.message || 'Failed to fetch data');
  }
};

/**
 * Task API methods
 */
export const taskAPI = {
  /**
   * Get all tasks
   */
  getTasks: async (page = 1) => {
    return fetchAPI(`/tasks?page=${page}&limit=10`);
  },

  /**
   * Get a single task by ID
   */
  getTask: async (id) => {
    return fetchAPI(`/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  createTask: async (taskData) => {
    return fetchAPI('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update an existing task
   */
  updateTask: async (id, taskData) => {
    return fetchAPI(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: async (id) => {
    return fetchAPI(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
