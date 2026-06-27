import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import App1 from './page1';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const path = window.location.pathname;
    
    if (path.startsWith('/admin')) {
      setIsAdminRoute(true);
      if (token) {
        verifyToken(token);
      }
    } else {
      setIsAdminRoute(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('https://portfolio-backend-ee1z.onrender.com/kirubel/api/verify-token/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      setIsAuthenticated(response.ok);
      if (!response.ok) {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    window.history.pushState({}, '', '/admin/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    window.location.href = '/admin/login';
  };

  // Admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} />;
    }
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Public portfolio
  return <App1 />;
}

export default App;