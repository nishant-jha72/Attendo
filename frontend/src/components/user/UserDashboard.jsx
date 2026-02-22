import React, { useState, useEffect } from 'react';
import API from '../../api/axios'; // Centralized axios instance

const UserDashboard = () => {
  // 1. State for dynamic user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [lastMarkedDate, setLastMarkedDate] = useState(null);

  // Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPass: ''
  });

  // 2. Fetch User Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/users/profile'); // Adjust to your backend route
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 3. Handle Attendance (API Call)
  const handleMarkAttendance = async () => {
    try {
      const response = await API.post('/users/mark-attendance');
      
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      setLastMarkedDate(formattedDate);
      setAttendanceMarked(true);
      
      // Update local state to reflect increment
      setUserData(prev => ({ 
        ...prev, 
        presentDays: response.data.data.presentDays 
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  // 4. Handle Password Change (API Call)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPass) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await API.post('/users/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });

      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPass: '' });
    } catch (error) {
      alert(error.response?.data?.message || "Error updating password");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading your profile...</div>;
  if (!userData) return <div className="min-h-screen flex items-center justify-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl font-black text-indigo-600 border-4 border-white shadow-sm">
            {userData.name?.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-black text-slate-800">My Profile</h1>
            <p className="text-slate-500 font-medium tracking-tight">Welcome, <span className="text-indigo-600 font-bold">{userData.name}</span></p>
            
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="mt-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition flex items-center gap-1 mx-auto md:mx-0"
            >
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
              Success recorded on <strong>{lastMarkedDate}</strong>.
            </p>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">Employment Details</h3>
            <div className="grid grid-cols-2 gap-y-8">
              <div><p className="text-xs text-slate-400 font-bold uppercase">Position</p><p className="text-lg font-bold text-slate-700">{userData.position}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Phone</p><p className="text-lg font-bold text-slate-700">{userData.phoneNumber}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Email</p><p className="text-lg font-bold text-slate-700 truncate">{userData.email}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Monthly Salary</p><p className="text-lg font-bold text-green-600">₹{userData.salary}</p></div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                <p className="text-slate-600 text-sm">{userData.address}</p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-6">Attendance Overview</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end"><span className="text-4xl font-black">{userData.presentDays || 0}</span><span className="text-sm font-bold opacity-70">Days Present</span></div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(userData.presentDays / (userData.presentDays + userData.absentDays || 1)) * 100}%` }}></div>
              </div>
              <div className="flex justify-between items-end"><span className="text-2xl font-black text-rose-300">{userData.absentDays || 0}</span><span className="text-sm font-bold opacity-70">Days Absent</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input type="password" placeholder="Old Password" required className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50" 
                onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})} />
              <input type="password" placeholder="New Password" required className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50"
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
              <input type="password" placeholder="Confirm New Password" required className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50"
                onChange={(e) => setPasswordForm({...passwordForm, confirmPass: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold">Update</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;