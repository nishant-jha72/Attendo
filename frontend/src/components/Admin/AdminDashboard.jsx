import React, { useState } from 'react';
// LOVELY ADMIN DASHBOARD COMPONENT
const AdminDashboard = () => {
  // Mock Data (This will eventually come from your Backend API)
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@co.com", branch: "New York", project: "Alpha", joinDate: "2023-01-10", salary: "$5000", present: 240, absent: 5 },
    { id: 2, name: "Bob Smith", email: "bob@co.com", branch: "London", project: "Beta", joinDate: "2023-03-15", salary: "$4800", present: 210, absent: 12 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const removeUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Admin Management Console</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            + Add New User
          </button>
        </div>

        {/* --- USER TABLE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Branch & Project</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Joining Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Salary</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Attendance (P/A)</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="block font-medium">{user.branch}</span>
                    <span className="text-xs text-indigo-500 font-bold">{user.project}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{user.joinDate}</td>
                  <td className="p-4 font-bold text-green-600">{user.salary}</td>
                  <td className="p-4">
                    <span className="text-green-600 font-bold">{user.present}d</span> / 
                    <span className="text-red-500 font-bold ml-1">{user.absent}d</span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => removeUser(user.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD USER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Register New User</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="p-3 border rounded-xl bg-slate-50" />
              <input type="email" placeholder="Email Address" className="p-3 border rounded-xl bg-slate-50" />
              <input type="text" placeholder="Branch" className="p-3 border rounded-xl bg-slate-50" />
              <input type="text" placeholder="Assigned Project" className="p-3 border rounded-xl bg-slate-50" />
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-400 mb-1 ml-1">Joining Date</label>
                <input type="date" className="p-3 border rounded-xl bg-slate-50" />
              </div>
              <input type="number" placeholder="Salary" className="p-3 border rounded-xl bg-slate-50" />
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold"
                >
                  Confirm Registration
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;