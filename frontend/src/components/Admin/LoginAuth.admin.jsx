import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // Import the central axios instance

const AdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isLogin = params.get('mode') !== 'register';

  // State for form inputs
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const [success, setSuccess] = useState('');
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        // --- LOGIN ---
        const response = await API.post('/admin/login', {
          email: formData.email,
          password: formData.password
        });

        // Capture the message from your ApiResponse class (e.g., "Admin logged in successfully")
        const successMsg = response.data?.message || "Login Successful!";
        setSuccess(successMsg);

        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isLoggedIn', 'true');

        // Delay navigation slightly so the user can actually see the success message
        setTimeout(() => {
            navigate('/admin-dashboard');
        }, 1500);

      } else {
        // --- REGISTRATION ---
        const response = await API.post('/admin/register', {
          organizationName: formData.organizationName,
          email: formData.email,
          password: formData.password
        });

        // Display the actual message from the backend (e.g., "Organization registered successfully")
        setSuccess(response.data?.message || "Registration successful!");
        
        // Switch to login mode after 2 seconds
        setTimeout(() => {
            navigate('/admin-auth?mode=login');
            setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      
      // This captures the 'message' you throw in your ApiError class on the backend
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-indigo-600 mb-6 text-center tracking-tight">
          {isLogin ? 'Admin Login' : 'Admin Register'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" 
              name="organizationName"
              placeholder="Organization Name" 
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={formData.organizationName}
              onChange={handleInputChange}
              required 
            />
          )}
          <input 
            type="email" 
            name="email"
            placeholder="Admin Email" 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
            value={formData.password}
            onChange={handleInputChange}
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95 disabled:bg-slate-400"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Admin Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setError('');
              navigate(isLogin ? '/admin-auth?mode=register' : '/admin-auth?mode=login');
            }}
            className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            {isLogin ? "New here? Register Organization" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;