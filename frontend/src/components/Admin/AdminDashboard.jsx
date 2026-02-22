import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserRegistration from './UserRegistration.admin'; 
import API from '../../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState([]); // State to store employee list
  const [loading, setLoading] = useState(true);

  // 1. Fetch Employees on Component Mount
  const fetchEmployees = async () => {
  try {
    const response = await API.get('/admin/employees'); 
    // response.data.data will contain the array of employee objects
    setUsers(response.data.data); 
  } catch (error) {
    console.error("Fetch Error:", error.response?.data?.message);
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Remove User Function
  const removeUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        // Update UI by filtering out the deleted user using _id (MongoDB default)
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        console.error("Error removing user:", error);
        alert("Failed to delete user. Check permissions.");
      }
    }
  };

  // 3. Callback to refresh list after adding new employee
  const handleUserAdded = () => {
    setShowAddModal(false);
    fetchEmployees(); // Refresh the list
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Team Records...</div>;

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
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role & Details</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Salary</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">No employees found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {/* Use a placeholder if no image exists */}
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 border-2 border-white shadow-sm">
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-slate-700">{user.position}</div>
                        <div className="text-xs text-indigo-500 font-medium uppercase tracking-tighter">{user.phoneNumber}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-black text-slate-800">₹{user.salary}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{user.address}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-bold">P: {user.presentDays}</span>
                          <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold">A: {user.absentDays}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={() => removeUser(user._id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          title="Remove User"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- RENDER THE REGISTRATION MODAL --- */}
      {showAddModal && (
        <AdminUserRegistration 
          onClose={() => setShowAddModal(false)} 
          onSuccess={handleUserAdded} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;