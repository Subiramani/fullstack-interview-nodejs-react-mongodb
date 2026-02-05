import React, { useState } from 'react';
import './TaskForm.css';

/**
 * TaskForm Component
 * 
 * A controlled form component for creating new tasks.
 * 
 * Props:
 * - onSubmit: function(taskData) - Called when form is submitted
 * - isLoading: boolean - Whether the form should be disabled during submission
 * 
 * Interview discussion:
 * - Controlled vs uncontrolled components
 * - Form validation (could add client-side validation)
 * - How would you handle more complex forms? (Formik, React Hook Form)
 */

function TaskForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Call parent's onSubmit with form data
    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    // Clear form after submission
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          disabled={isLoading}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          disabled={isLoading}
          maxLength={500}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

export default TaskForm;
