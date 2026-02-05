import React from 'react';
import TasksPage from './pages/TasksPage';
import './App.css';

/**
 * Root App Component
 * 
 * In this simple boilerplate, we just render the TasksPage.
 * 
 * Interview discussion points:
 * - Where would you add routing? (React Router)
 * - Where would you add authentication? (AuthContext/Provider wrapping App)
 * - How would you handle global state? (Context API for simple cases, Redux for complex)
 * - Where would you add layout components? (Header, Sidebar, etc.)
 */

function App() {
  return (
    <div className="App">
      <TasksPage />
    </div>
  );
}

export default App;
