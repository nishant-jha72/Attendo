import React from 'react';

const UserDashboard = () => {
  // Mock User Data (Representing the logged-in user)
  const userData = {
    name: "Alice Johnson",
    email: "alice@co.com",
    branch: "New York",
    project: "Alpha",
    joinDate: "Jan 10, 2023",
    salary: "$5,000",
    present: 240,
    absent: 5
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800">My Profile</h1>
          <p className="text-slate-500">Welcome back, {userData.name}. Here is your career overview.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">Employment Details</h3>
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Branch</p>
                <p className="text-lg font-bold text-slate-700">{userData.branch}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Active Project</p>
                <p className="text-lg font-bold text-slate-700">{userData.project}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Joining Date</p>
                <p className="text-lg font-bold text-slate-700">{userData.joinDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Monthly Salary</p>
                <p className="text-lg font-bold text-green-600">{userData.salary}</p>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-6">Attendance</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-black">{userData.present}</span>
                <span className="text-sm font-bold opacity-70">Days Present</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${(userData.present / (userData.present + userData.absent)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-red-300">{userData.absent}</span>
                <span className="text-sm font-bold opacity-70">Days Absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;