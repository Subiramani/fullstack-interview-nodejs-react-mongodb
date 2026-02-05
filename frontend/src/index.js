import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Application entry point
 * 
 * This is kept minimal - just renders the root App component.
 * In a real app, you might add:
 * - Global providers (Auth, Theme, etc.)
 * - Error boundaries
 * - Performance monitoring
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
