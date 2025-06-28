/**
 * Component: App
 * Purpose: Main application component with routing and dark theme
 * Integration:
 *   - React Router for navigation between pages
 *   - Global state management and theme provider
 * Styling: Tailwind CSS with dark theme applied globally
 * Accessibility: Proper routing and focus management
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;