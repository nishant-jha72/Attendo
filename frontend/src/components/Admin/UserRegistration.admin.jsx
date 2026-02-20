import React, { useState } from 'react';

const AdminUserRegistration = ({ onUserAdded, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    salary: '',
    address: '',
    position: '',
    phone: '',
    profilePicture: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later, you will use FormData() here to send the image to the backend
    console.log("Ready for Backend:", formData);
    alert("User Registered Successfully (Local State)");
    onClose(); // Close modal after success
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold">Register New Employee</h2>
          <p className="text-indigo-100 text-sm">Fill in the details to create a secure user account.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <input type="text" name="name" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="John Doe" />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input type="email" name="email" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="john@company.com" />
          </div>

          {/* Position */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Position</label>
            <input type="text" name="position" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Senior Developer" />
          </div>

          {/* Salary */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Monthly Salary</label>
            <input type="number" name="salary" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="5000" />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
            <input type="tel" name="phone" required onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="+1 234 567 890" />
          </div>

          {/* Profile Picture */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Profile Picture</label>
            <input type="file" name="profilePicture" accept="image/*" onChange={handleChange}
              className="w-full p-2.5 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>

          {/* Address */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Residential Address</label>
            <textarea name="address" rows="2" onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="123 Street, City, Country"></textarea>
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 flex gap-4 mt-4">
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Register Employee
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