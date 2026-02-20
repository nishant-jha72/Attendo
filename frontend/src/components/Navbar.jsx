import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 1. CHECK LOGIN STATUS
  // We check localStorage to see if a user session exists
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // Listen for storage changes (helps if login happens in another component)
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // 2. LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole'); // Optional: clean up role
    setIsLoggedIn(false);
    navigate('/'); // Send back to landing page
  };

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
    <>
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}

      <nav className="w-full bg-white border-b border-slate-100 px-4 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <div 
          className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter cursor-pointer"
          onClick={() => navigate('/')}
        >
          Attendo
        </div>

        <div className="flex items-center space-x-3 md:space-x-8">
          
          {/* Only show Mark Attendance if not logged in or logged in as User */}
          {!isLoggedIn && (
            <button 
              onClick={() => navigate('/user-login')}
              className="hidden sm:block text-indigo-600 border-2 border-indigo-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition whitespace-nowrap"
            >
              Mark Attendance
            </button>
          )}
          
          {/* 3. CONDITIONAL RENDERING: DROPDOWN vs LOGOUT */}
          {!isLoggedIn ? (
            <div className="relative z-50">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 shadow-md transition-all flex items-center gap-2"
              >
                <span>Portal Access</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative</span>
                    <button onClick={goToAdminLogin} className="block w-full text-left py-2 text-sm font-semibold hover:text-indigo-600 transition">Admin Login</button>
                    <button onClick={goToAdminRegister} className="block w-full text-left py-2 text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition">Register Organization</button>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standard User</span>
                    <button onClick={goToUserLogin} className="block w-full text-left py-2 text-sm font-semibold hover:text-indigo-600 transition">User Login</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* SHOW LOGOUT BUTTON WHEN LOGGED IN */
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-100 transition-all border border-red-100 shadow-sm"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;