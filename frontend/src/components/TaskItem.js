import React, { useState } from 'react';
import './TaskItem.css';

/**
 * TaskItem Component
 * 
 * Displays a single task with options to toggle completion and delete.
 * 
 * Props:
 * - task: object - The task data
 * - onToggleComplete: function(id, completed) - Called when task completion is toggled
 * - onDelete: function(id) - Called when task is deleted
 * 
 * Interview discussion:
 * - Component composition vs prop drilling
 * - Optimistic updates vs waiting for server response
 * - How would you add edit functionality?
 */

function TaskItem({ task, onToggleComplete, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = () => {
    onToggleComplete(task._id, !task.completed);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task._id);
      } catch (error) {
        setIsDeleting(false);
        // Error handling is done in parent component
      }
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3>{task.title}</h3>
          <span className="task-status">
            {task.completed ? '✓ Completed' : '○ Pending'}
          </span>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
        </div>
      </div>

      <div className="task-actions">
        <button
          className={`btn ${task.completed ? 'btn-primary' : 'btn-success'}`}
          onClick={handleToggleComplete}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
