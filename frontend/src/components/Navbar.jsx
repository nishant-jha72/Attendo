import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../api/axios';
import EmployeeDetailView from '../components/Admin/EmployeeDetailView';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userData, setUserData] = useState(null); 
  const [showSelfProfile, setShowSelfProfile] = useState(false);

  // Sync auth state whenever the URL changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUserRole(localStorage.getItem('userRole'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  // --- THE MISSING FUNCTION ---
  const handleViewProfile = async () => {
    try {
      const endpoint = userRole === 'admin' ? '/admin/me' : '/users/me';
      const response = await API.get(endpoint);
      
      if (response.data?.data) {
        setUserData(response.data.data);
        setShowSelfProfile(true);
      }
    } catch (error) {
      console.error("Could not fetch profile:", error);
      alert("Session expired or server error. Please login again.");
    }
  };

  const handleLogout = async () => {
    try {
      const logoutEndpoint = userRole === 'admin' ? '/admin/logout' : '/users/logout';
      await API.post(logoutEndpoint);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  const userName = localStorage.getItem('userName') || 'User';

  return (
    <>
      <nav className="w-full bg-white border-b border-slate-100 px-4 md:px-12 py-3 flex justify-between items-center sticky top-0 z-50">
        <div 
          className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter cursor-pointer"
          onClick={() => navigate('/')}
        >
          Attendo
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          {!isLoggedIn ? (
            <div className="flex items-center gap-6">
              <Link to="/" className="text-slate-600 font-bold hover:text-indigo-600 transition">Home</Link>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition hover:bg-indigo-700"
                >
                  Join Us <span>{isDropdownOpen ? '▲' : '▼'}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-2 z-50">
                    <button onClick={() => {navigate('/admin-auth?mode=login'); setIsDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Admin Login</button>
                    <button onClick={() => {navigate('/user-auth'); setIsDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50">Employee Login</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile Trigger */}
              <button 
                onClick={handleViewProfile}
                className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none">{userName}</p>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">My Stats</span>
                </div>
              </button>

              <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

              <button 
                onClick={handleLogout} 
                className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition shadow-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Modal */}
      {showSelfProfile && userData && (
        <EmployeeDetailView 
          user={userData} 
          onClose={() => setShowSelfProfile(false)} 
          isDashboardView={true} 
        />
      )}
    </>
  );
};

export default Navbar;