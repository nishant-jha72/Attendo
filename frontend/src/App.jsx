import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components (adjust paths based on your folder structure)
import LandingPage from './components/LandingPage';
import AdminAuth from './components/Admin/LoginAuth.admin';
import UserLogin from './components/user/Login.user';
import Navbar from './components/Navbar';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen font-bold">
            404 - Page Not Found
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;