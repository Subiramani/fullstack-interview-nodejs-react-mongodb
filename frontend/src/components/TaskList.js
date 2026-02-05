import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

/**
 * TaskList Component
 * 
 * Renders a list of tasks or an empty state message.
 * 
 * Props:
 * - tasks: array - Array of task objects
 * - onToggleComplete: function - Passed down to TaskItem
 * - onDelete: function - Passed down to TaskItem
 * 
 * Interview discussion:
 * - Why use key prop in lists? (React reconciliation)
 * - How would you optimize rendering for large lists? (React.memo, virtualization)
 * - How would you add sorting/filtering?
 */

function TaskList({ tasks, onToggleComplete, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Create your first task using the form above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Your Tasks ({tasks.length})</h2>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
