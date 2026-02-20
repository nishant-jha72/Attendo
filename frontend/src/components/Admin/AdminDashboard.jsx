import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserRegistration from './UserRegistration.admin'; // Ensure filename matches

const AdminDashboard = () => {
  const navigate = useNavigate(); // REQUIRED to use navigate()

  // 1. DUMMY DATA (Expanded with your new requirements)
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: "Aryan Sharma", 
      email: "aryan@co.com", 
      position: "Senior Dev", 
      salary: "75000", 
      phone: "+91 9876543210",
      branch: "Noida", 
      project: "Banking App", 
      joinDate: "2024-01-10", 
      present: 45, 
      absent: 2,
      img: "https://i.pravatar.cc/150?u=1" 
    },
    { 
      id: 2, 
      name: "Sneha Kapoor", 
      email: "sneha@co.com", 
      position: "UI Designer", 
      salary: "65000", 
      phone: "+91 8877665544",
      branch: "Delhi", 
      project: "E-comm", 
      joinDate: "2024-02-15", 
      present: 30, 
      absent: 0,
      img: "https://i.pravatar.cc/150?u=2" 
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const removeUser = (id) => {
    if(window.confirm("Are you sure you want to remove this employee?")) {
        setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Team Management</h1>
            <p className="text-slate-500 font-medium">Manage employee records and attendance precision.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Employee
          </button>
        </div>

        {/* --- USER TABLE --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Employee Info</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role & Project</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Salary</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={user.img} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <div className="font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm font-bold text-slate-700">{user.position}</div>
                      <div className="text-xs text-indigo-500 font-medium uppercase tracking-tighter">{user.project}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm font-black text-slate-800">₹{user.salary}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{user.branch}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-bold">P: {user.present}</span>
                        <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold">A: {user.absent}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => removeUser(user.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        title="Remove User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- RENDER THE REGISTRATION MODAL --- */}
      {showAddModal && (
        <AdminUserRegistration 
          onClose={() => setShowAddModal(false)} 
          // You can pass a function here to update the user list later
        />
      )}
    </div>
  );
};

export default AdminDashboard;