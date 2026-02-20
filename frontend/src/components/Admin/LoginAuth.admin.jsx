import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
const AdminAuth = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const isLogin = params.get('mode') !== 'register';

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    
    // 1. Here you will eventually call your Backend API
    // 2. If successful, redirect to the Admin Dashboard
    if (isLogin) {
      navigate('/admin-dashboard'); 
    } else {
      // If they just registered, maybe send them to login or dashboard
      navigate('/admin-auth?mode=login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-indigo-600 mb-6 text-center tracking-tight">
          {isLogin ? 'Admin Login' : 'Admin Register'}
        </h2>
        
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" placeholder="Organization Name" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              <input type="text" placeholder="Employee Name" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              <input type="text" placeholder="Position in Company" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </>
          )}
          <input type="email" placeholder="Admin Email" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <input type="password" placeholder="Password" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
            {isLogin ? 'Sign In' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => navigate(isLogin ? '/admin-auth?mode=register' : '/admin-auth?mode=login')}
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