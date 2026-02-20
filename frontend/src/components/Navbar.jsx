import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Keep this

const Navbar = () => {
  // 1. You MUST define navigate inside the component
  const navigate = useNavigate(); 

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // These helper functions can stay, but notice I updated them 
  // to also close the dropdown so it doesn't stay open after clicking.
  const goToAdminLogin = () => {
    navigate('/admin-auth?mode=login');
    setIsDropdownOpen(false);
  };

  const goToAdminRegister = () => {
    navigate('/admin-auth?mode=register');
    setIsDropdownOpen(false);
  };

  const goToUserLogin = () => {
    navigate('/user-login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo - clicking takes you home */}
      <div 
        className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter cursor-pointer"
        onClick={() => navigate('/')}
      >
        Attendo
      </div>

      <div className="flex items-center space-x-6 md:space-x-10">
        <button onClick={() => navigate('/')} className="font-semibold hover:text-indigo-600 transition">Home</button>
        <button className="font-semibold hover:text-indigo-600 transition">About Us</button>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 shadow-md transition-all"
          >
            Portal Access
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-slate-400">Administrative</span>
                <button 
                  onClick={goToAdminLogin}
                  className="block w-full text-left py-2 text-sm font-semibold hover:text-indigo-600"
                >
                  Admin Login
                </button>
                <button 
                  onClick={goToAdminRegister}
                  className="block w-full text-left py-2 text-sm font-semibold hover:text-indigo-600"
                >
                  Register Admin
                </button>
              </div>
              <div className="px-4 py-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-slate-400">Standard User</span>
                <button 
                  onClick={goToUserLogin}
                  className="block w-full text-left py-2 text-sm font-semibold hover:text-indigo-600"
                >
                  User Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;