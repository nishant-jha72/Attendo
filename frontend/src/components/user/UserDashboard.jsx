import React, { useState, useEffect } from 'react';
import API from '../../api/axios'; 

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [lastMarkedDate, setLastMarkedDate] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPass: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/users/me');
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleMarkAttendance = async () => {
    try {
      const response = await API.post('/users/mark-attendance');
      const now = new Date();
      setLastMarkedDate(now.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }));
      setAttendanceMarked(true);
      setUserData(prev => ({ ...prev, presentDays: response.data.data.presentDays }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

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

  // CALENDAR LOGIC
  const isPresent = (dayNumber) => {
    if (!userData?.attendanceHistory) return false;
    const today = new Date();
    return userData.attendanceHistory.some(record => {
      const recordDate = new Date(record.date);
      return recordDate.getDate() === dayNumber && 
             recordDate.getMonth() === today.getMonth() &&
             recordDate.getFullYear() === today.getFullYear();
    });
  };

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const currentDay = new Date().getDate();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading profile...</div>;
  if (!userData) return <div className="min-h-screen flex items-center justify-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="mb-8 flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl font-black text-indigo-600 border-4 border-white shadow-sm overflow-hidden">
            {userData.profilePicture ? (
              <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userData.name?.charAt(0)
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-2xl font-black text-slate-800">My Workspace</h1>
            {/* Displaying Name and Username */}
            <p className="text-slate-500 text-sm font-medium">Hello, <span className="text-indigo-600 font-bold">{userData.name}</span> (@{userData.userName})</p>
            <button onClick={() => setShowPasswordModal(true)} className="mt-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition uppercase tracking-wider">Update Password</button>
          </div>
          
          <div>
            {!attendanceMarked ? (
              <button onClick={handleMarkAttendance} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95 text-sm">Mark Attendance</button>
            ) : (
              <div className="bg-green-50 text-green-600 px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 border border-green-100 text-sm"><span>✅</span> Done for Today</div>
            )}
          </div>
        </header>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Details & Calendar */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Employment Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">Employment info</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Role</p><p className="text-sm font-bold text-slate-700">{userData.position}</p></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p><p className="text-sm font-bold text-slate-700">{userData.phoneNumber}</p></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Salary</p><p className="text-sm font-bold text-green-600">₹{userData.salary}</p></div>
                {/* Changed Email to Username here */}
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Username</p><p className="text-sm font-bold text-indigo-500 truncate">@{userData.userName}</p></div>
              </div>
            </div>

            {/* Calendar Card (Unchanged logic, just display) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                  {new Date().toLocaleString('default', { month: 'long' })} Tracker
                </h3>
                <div className="flex gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-[9px] font-bold text-slate-400">Present</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-full"></div><span className="text-[9px] font-bold text-slate-400">Absent</span></div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-center text-[9px] font-black text-slate-300 mb-1">{d}</div>
                ))}
                {calendarDays.map(day => {
                  const marked = isPresent(day);
                  const isPast = day < currentDay;
                  
                  return (
                    <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] font-bold relative ${marked ? 'bg-green-50 text-green-700 border border-green-100' : isPast ? 'bg-red-50 text-red-400 border border-red-50' : 'bg-slate-50 text-slate-400'}`}>
                      {day}
                      <span className="text-[10px] absolute -bottom-0.5">
                        {marked ? '✔️' : (isPast ? '❌' : '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Overview Card (Unchanged) */}
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 h-fit sticky top-24">
            <h3 className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-8">Attendance Overview</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-4xl font-black">{userData.presentDays || 0}</p>
                  <p className="text-[10px] font-bold opacity-70 uppercase">Days Present</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-rose-300">{userData.absentDays || 0}</p>
                  <p className="text-[10px] font-bold opacity-70 uppercase">Days Absent</p>
                </div>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(userData.presentDays / (userData.presentDays + userData.absentDays || 1)) * 100}%` }}></div>
              </div>
              <p className="text-[10px] text-center font-bold opacity-60">Calculated based on working days this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- PASSWORD MODAL (Unchanged) --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-black text-slate-800 mb-4">New Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input type="password" placeholder="Old Password" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})} />
              <input type="password" placeholder="New Password" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
              <input type="password" placeholder="Confirm" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" onChange={(e) => setPasswordForm({...passwordForm, confirmPass: e.target.value})} />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm">Update</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;