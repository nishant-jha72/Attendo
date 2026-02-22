import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // Centralized axios instance

const UserLogin = () => {
  const navigate = useNavigate();
  
  // 1. State for form data and UI feedback
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type === 'email' ? 'email' : 'password']: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 2. Call your actual backend endpoint for user login
      const response = await API.post('/users/login', {
        email: formData.email,
        password: formData.password
      });

      // 3. Handle Success
      // Cookies are handled automatically by the browser due to withCredentials: true
      localStorage.setItem('userRole', 'user'); 
      localStorage.setItem('isLoggedIn', 'true');
      
      // Navigate to user dashboard
      navigate('/user-dashboard');
      
      // Optional: If your Navbar relies on localStorage, a single refresh or state lift is needed
      // window.location.reload(); 
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        {/* --- GREETING HEADER --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Login with your <span className="text-indigo-600">User ID</span> and password
          </p>
        </div>

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        {/* --- PORTAL BADGE --- */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="h-px w-8 bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">User Portal</span>
          <div className="h-px w-8 bg-slate-200"></div>
        </div>
        
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">User Email / ID</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@company.com" 
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-2 disabled:bg-indigo-300"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-[11px] mt-8 italic leading-relaxed">
          Forgot your password? Please contact your <br />
          <span className="font-bold text-slate-500">System Admin</span> to reset credentials.
        </p>
      </div>
    </div>
  );
};

export default UserLogin;