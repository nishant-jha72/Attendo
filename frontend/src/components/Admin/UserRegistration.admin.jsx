import React, { useState } from 'react';
import API from '../../api/axios'; // Import your pre-configured Axios instance

const AdminUserRegistration = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    salary: '',
    address: '',
    position: '',
    phoneNumber: '', // Match backend naming
    password: 'password123', // Setting a default password for employees
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Create FormData instance for multipart/form-data (required for files)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("position", formData.position);
    data.append("salary", formData.salary);
    data.append("address", formData.address);
    data.append("phoneNumber", formData.phoneNumber);
    
    // Only append image if it exists
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture);
    }

    try {
      // 2. Make the API Call
      const response = await API.post('/admin/add-employee', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("Employee Registered Successfully!");
      if (onSuccess) onSuccess(); // Refresh the list in AdminDashboard
      onClose(); // Close the modal
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || "Failed to register employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Register New Employee</h2>
            <p className="text-indigo-100 text-sm">Create a new record in the system.</p>
          </div>
          {error && <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-bounce">Error: {error}</span>}
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <input type="text" name="name" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="John Doe" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input type="email" name="email" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="john@company.com" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Position</label>
            <input type="text" name="position" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Senior Developer" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Monthly Salary</label>
            <input type="number" name="salary" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="5000" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
            <input type="tel" name="phoneNumber" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="+91 1234567890" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Profile Picture</label>
            <input type="file" name="profilePicture" accept="image/*" onChange={handleChange}
              className="w-full p-2.5 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Residential Address</label>
            <textarea name="address" rows="2" onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="123 Street, City, Country"></textarea>
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-slate-300"
            >
              {loading ? "Registering..." : "Register Employee"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserRegistration;