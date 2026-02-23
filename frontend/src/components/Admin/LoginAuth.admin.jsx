import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const AdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isLogin = params.get('mode') !== 'register';

  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    salary: '',
    gender: '',
    age: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); // Create a local preview URL
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        // --- LOGIN (Standard JSON) ---
        const response = await API.post('/admin/login', {
          email: formData.email,
          password: formData.password
        });

        setSuccess(response.data?.message || "Login Successful!");
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isLoggedIn', 'true');

        setTimeout(() => navigate('/admin-dashboard'), 1500);

      } else {
        // --- REGISTRATION (Using FormData for Image Upload) ---
        const data = new FormData();
        data.append("organizationName", formData.organizationName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("salary", formData.salary);
        data.append("gender", formData.gender);
        data.append("age", formData.age);
        data.append("profilePic", profilePic); // Key must match req.file field name in backend

        const response = await API.post('/admin/register', data, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        setSuccess(response.data?.message || "Registration successful!");
        
        setTimeout(() => {
            navigate('/admin-auth?mode=login');
            setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-indigo-600 mb-6 text-center tracking-tight">
          {isLogin ? 'Admin Login' : 'Admin Register'}
        </h2>

        {(error || success) && (
          <div className={`mb-4 p-3 text-sm font-bold rounded-xl text-center ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {error || success}
          </div>
        )}
        
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Profile Pic Upload & Preview */}
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-indigo-300 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center px-2">Upload Photo</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  required={!isLogin}
                />
              </div>

              <input 
                type="text" name="organizationName" placeholder="Organization Name" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" 
                value={formData.organizationName} onChange={handleInputChange} required 
              />
              
              <div className="flex gap-2">
                <input 
                  type="number" name="age" placeholder="Age" 
                  className="w-1/3 p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" 
                  value={formData.age} onChange={handleInputChange} required 
                />
                <select 
                  name="gender" 
                  className="w-2/3 p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  value={formData.gender} onChange={handleInputChange} required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <input 
                type="number" name="salary" placeholder="Salary (Monthly)" 
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" 
                value={formData.salary} onChange={handleInputChange} required 
              />
            </>
          )}

          <input 
            type="email" name="email" placeholder="Admin Email" 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" 
            value={formData.email} onChange={handleInputChange} required 
          />
          <input 
            type="password" name="password" placeholder="Password" 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" 
            value={formData.password} onChange={handleInputChange} required 
          />
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95 disabled:bg-slate-400"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Admin Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setError('');
              setSuccess('');
              navigate(isLogin ? '/admin-auth?mode=register' : '/admin-auth?mode=login');
            }}
            className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            {isLogin ? "New here? Register Organization" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;