import React, { useState } from 'react';

const UserDashboard = () => {
  // 1. Initial State
  const [userData, setUserData] = useState({
    name: "Alice Johnson",
    email: "alice@co.com",
    branch: "New York",
    project: "Alpha",
    joinDate: "Jan 10, 2023",
    salary: "$5,000",
    profilePicture: "https://i.pravatar.cc/150?u=alice",
    present: 240,
    absent: 5,
    // This is the password the Admin initially generated
    currentHashedPassword: "admin123" 
  });

  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [lastMarkedDate, setLastMarkedDate] = useState(null);

  // --- NEW STATES FOR PASSWORD CHANGE ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  // Attendance Handler
  const handleMarkAttendance = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    setLastMarkedDate(formattedDate);
    setAttendanceMarked(true);
    setUserData(prev => ({ ...prev, present: prev.present + 1 }));
  };

  // --- PASSWORD CHANGE HANDLER ---
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordForm.current !== userData.currentHashedPassword) {
      alert("The current password you entered is incorrect.");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    // Success logic
    alert("Password updated successfully!");
    setUserData(prev => ({ ...prev, currentHashedPassword: passwordForm.newPass }));
    setShowPasswordModal(false);
    setPasswordForm({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <img 
            src={userData.profilePicture} 
            alt="Profile" 
            className="w-24 h-24 rounded-2xl object-cover border-4 border-indigo-50 shadow-sm"
          />
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-black text-slate-800">My Profile</h1>
            <p className="text-slate-500 font-medium tracking-tight">Welcome, <span className="text-indigo-600 font-bold">{userData.name}</span></p>
            
            {/* NEW: Password Change Trigger */}
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="mt-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition flex items-center gap-1 mx-auto md:mx-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Update Security Password
            </button>
          </div>
          
          <div className="md:ml-auto">
            {!attendanceMarked ? (
              <button 
                onClick={handleMarkAttendance}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95"
              >
                Mark Today's Attendance
              </button>
            ) : (
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                <span className="text-xl">✅</span> Attendance Marked
              </div>
            )}
          </div>
        </header>

        {/* --- CONFIRMATION MESSAGE --- */}
        {attendanceMarked && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <p className="text-indigo-800 text-sm font-medium text-center">
              Success! Attendance for <strong>{userData.name}</strong> was recorded on <strong>{lastMarkedDate}</strong>.
            </p>
          </div>
        )}

        {/* Stats and Info Cards (Your existing UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">Employment Details</h3>
            <div className="grid grid-cols-2 gap-y-8">
              <div><p className="text-xs text-slate-400 font-bold uppercase">Branch</p><p className="text-lg font-bold text-slate-700">{userData.branch}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Active Project</p><p className="text-lg font-bold text-slate-700">{userData.project}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Email</p><p className="text-lg font-bold text-slate-700 truncate">{userData.email}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Monthly Salary</p><p className="text-lg font-bold text-green-600">{userData.salary}</p></div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-6">Attendance Overview</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end"><span className="text-4xl font-black">{userData.present}</span><span className="text-sm font-bold opacity-70">Days Present</span></div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(userData.present / (userData.present + userData.absent)) * 100}%` }}></div>
              </div>
              <div className="flex justify-between items-end"><span className="text-2xl font-black text-rose-300">{userData.absent}</span><span className="text-sm font-bold opacity-70">Days Absent</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CHANGE PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Change Password</h2>
            <p className="text-slate-500 text-sm mb-6">Please verify your current identity to set a new password.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Current Password</label>
                <input 
                  type="password" required 
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                />
              </div>
              <div className="h-px bg-slate-100 my-2"></div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">New Password</label>
                <input 
                  type="password" required
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setPasswordForm({...passwordForm, newPass: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Confirm New Password</label>
                <input 
                  type="password" required
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPass: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition">Update</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;