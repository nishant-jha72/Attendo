import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import EmployeeDetailView from '../components/Admin/EmployeeDetailView';

const Navbar = () => {
  const navigate = useNavigate(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userData, setUserData] = useState(null); 
  const [showSelfProfile, setShowSelfProfile] = useState(false);

  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUserRole(localStorage.getItem('userRole'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleViewProfile = async () => {
    try {
      const endpoint = userRole === 'admin' ? '/admin/me' : '/users/me';
      const response = await API.get(endpoint);
      setUserData(response.data.data);
      setShowSelfProfile(true);
    } catch (error) {
      console.error("Could not fetch profile:", error);
    }
  };

  const markAttendance = async () => {
    try {
      const response = await API.post('/users/mark-attendance');
      
      // Use the timestamp sent back from the backend instead of 'new Date()'
      // Assuming your backend returns { data: { presentDays: 10, markedAt: "2026-02-23T..." } }
      const serverTime = response.data.data.markedAt 
        ? new Date(response.data.data.markedAt) 
        : new Date();

      const formattedDate = serverTime.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      setLastMarkedDate(formattedDate);
      setAttendanceMarked(true);
      
      setUserData(prev => ({ 
        ...prev, 
        presentDays: response.data.data.presentDays 
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
};

  const handleLogout = async () => {
    try {
      const logoutEndpoint = userRole === 'admin' ? '/admin/logout' : '/users/logout';
      await API.post(logoutEndpoint);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/'); 
      window.location.reload(); 
    }
  };

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
            /* --- GUEST VIEW: Home & Auth Dropdown --- */
            <div className="flex items-center gap-6">
              <Link to="/" className="text-slate-600 font-bold hover:text-indigo-600 transition">Home</Link>
              
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  Join Us <span>{isDropdownOpen ? '▲' : '▼'}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => {navigate('/admin-auth?mode=login'); setIsDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Admin Login</button>
                    <button onClick={() => {navigate('/admin-auth?mode=register'); setIsDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Register Admin</button>
                    <div className="border-t border-slate-50 my-1"></div>
                    <button onClick={() => {navigate('/user-auth'); setIsDropdownOpen(false)}} className="w-full text-left px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50">Employee Login</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* --- LOGGED IN VIEW: Profile, Stats, and Attendance --- */
            <div className="flex items-center gap-4">
              
              {/* Mark Attendance Button (For Employees) */}
              {userRole === 'user' && (
                <button 
                  onClick={markAttendance}
                  className="hidden md:block bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition shadow-lg shadow-green-100"
                >
                  Mark Attendance
                </button>
              )}

              <button 
                onClick={handleViewProfile}
                className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-sm overflow-hidden">
                  {userData?.profilePic || userData?.profilePicture ? (
                    <img src={userData.profilePic || userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0)
                  )}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none">
                    {userData?.organizationName || userData?.name || userName}
                  </p>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">View Stats</span>
                </div>
              </button>

              <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-bold text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

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