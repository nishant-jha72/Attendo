import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserRegistration from './UserRegistration.admin'; 
import EmployeeDetailView from './EmployeeDetailView'; 
import API from '../../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchEmployees = async () => {
  try {
    setLoading(true);
    const response = await API.get('/admin/employees'); 
    
    // If backend is fixed to return 200 and [], this will run
    if (response.data && response.data.data) {
      setUsers(response.data.data); 
    }
  } catch (error) {
    // This only runs if the request actually FAILS (404, 500, etc.)
    console.error("Error fetching employees:", error);
    
    // Check if it's a 404 (Not Found) specifically
    if (error.response?.status === 404) {
       setUsers([]); // Clear users if not found
    } else {
       alert("Server error. Please try again later.");
    }
  } finally {
    setLoading(false); 
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  const removeUser = async (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        console.error("Error removing user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleUserAdded = () => {
    setShowAddModal(false);
    fetchEmployees(); 
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Loading Team Records...</div>;

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
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Demographics</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role & Details</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Salary</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">No employees found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr 
                      key={user._id} 
                      onClick={() => setSelectedUser(user)} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {/* Updated to check for profilePicture (User Schema) or profilePic (Admin Schema) */}
                          <img 
                            src={user.profilePicture || user.profilePic || `https://ui-avatars.com/api/?name=${user.name || user.organizationName}&background=EEF2FF&color=4F46E5`} 
                            alt="profile" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <div className="font-bold text-slate-800">{user.name || user.organizationName}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      {/* NEW: Demographics Column */}
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">{user.gender || "N/A"}</span>
                          <span className="text-xs text-slate-400">{user.age ? `${user.age} yrs` : "Age not set"}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-slate-700">{user.position || "Admin Role"}</div>
                        <div className="text-xs text-indigo-500 font-medium">{user.phoneNumber || "No Phone"}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-black text-slate-800">₹{user.salary?.toLocaleString() || 0}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[150px]">{user.address || "No Address"}</div>
                      </td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={(e) => removeUser(user._id, e)}
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

      {selectedUser && (
        <EmployeeDetailView 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          isDashboardView={true} 
        />
      )}

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